/* ============================================================================
   WBTelemetry — local-only analytics foundation
   ----------------------------------------------------------------------------
   READ THIS FIRST: nothing here ever leaves the browser.

   There is no endpoint, no fetch, no sendBeacon, no image pixel, no third
   party. Events are appended to an IndexedDB database that lives in the
   visitor's own browser profile, and the only ways data comes back out are the
   "Export JSON" and "Clear" buttons in the settings drawer, both driven by the
   visitor. If this file ever grows a network call, that is a bug.

   What it is for: this is the foundation layer for product analytics on a
   static site. The event shape, the session model, the buffering and the
   pruning are all real; the only missing piece is a transport, which is a
   deliberate choice rather than an oversight.

   Storage layout
     database  wb-telemetry (version 1)
       events   auto-increment id
                indexes: ts, type, session
       sessions keyPath "id"

   Event record
     { id, session, ts, type, props, path }

   Consent
     Enabled by default because the data is local, with two exceptions that
     turn it off before it ever starts: the Do Not Track header and the Global
     Privacy Control signal. The visitor's explicit choice, once made, wins
     over both and is remembered in localStorage.
   ========================================================================= */

(function (global) {
  "use strict";

  var DB_NAME = "wb-telemetry";
  var DB_VERSION = 1;
  var STORE_EVENTS = "events";
  var STORE_SESSIONS = "sessions";

  var CONSENT_KEY = "wb.telemetry.enabled";
  var SESSION_KEY = "wb.telemetry.session";

  var MAX_EVENTS = 5000;      // prune oldest beyond this
  var FLUSH_MS = 1200;        // batch window
  var MAX_BUFFER = 40;        // flush early once the buffer hits this

  var db = null;
  var enabled = false;
  var ready = false;
  var buffer = [];
  var flushTimer = 0;
  var sessionId = null;
  var sessionStart = 0;
  var failed = false;         // IndexedDB unavailable (private mode, etc.)

  /* ------------------------------------------------------------- consent */

  function privacySignalsOptOut() {
    /* Both signals are advisory strings/booleans depending on the browser. */
    var dnt = global.doNotTrack || navigator.doNotTrack || navigator.msDoNotTrack;
    if (dnt === "1" || dnt === 1 || dnt === "yes") return true;
    if (navigator.globalPrivacyControl === true) return true;
    return false;
  }

  function storedConsent() {
    try {
      var v = localStorage.getItem(CONSENT_KEY);
      if (v === "1") return true;
      if (v === "0") return false;
    } catch (e) { /* storage blocked */ }
    return null;
  }

  function persistConsent(on) {
    try { localStorage.setItem(CONSENT_KEY, on ? "1" : "0"); } catch (e) { /* ignore */ }
  }

  function resolveConsent() {
    var stored = storedConsent();
    if (stored !== null) return stored;      // explicit choice wins
    return !privacySignalsOptOut();
  }

  /* ------------------------------------------------------------- session */

  function newId() {
    /* crypto.randomUUID is not on older Safari; the fallback does not need to
       be cryptographically strong, only unique enough within one browser. */
    if (global.crypto && global.crypto.randomUUID) return global.crypto.randomUUID();
    return "s-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  /* A session is one browser tab visit. sessionStorage is scoped to exactly
     that, which is the semantics we want, and it disappears on tab close. */
  function initSession() {
    var raw = null;
    try { raw = sessionStorage.getItem(SESSION_KEY); } catch (e) { /* ignore */ }

    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        sessionId = parsed.id;
        sessionStart = parsed.start;
        return false;                        // resumed, not new
      } catch (e) { /* fall through and start fresh */ }
    }

    sessionId = newId();
    sessionStart = Date.now();
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: sessionId, start: sessionStart }));
    } catch (e) { /* ignore */ }
    return true;                             // brand new session
  }

  function sessionRecord() {
    return {
      id: sessionId,
      start: sessionStart,
      referrer: document.referrer || null,
      lang: navigator.language || null,
      /* Screen size bucketed rather than exact — there is no reason to keep a
         precise fingerprint even locally. */
      viewport: bucket(global.innerWidth) + "x" + bucket(global.innerHeight),
      tz: (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || null,
    };
  }

  function bucket(n) { return Math.round(n / 80) * 80; }

  /* ------------------------------------------------------------------ db */

  function open() {
    return new Promise(function (resolve, reject) {
      if (!global.indexedDB) { reject(new Error("no indexedDB")); return; }
      var req;
      try { req = indexedDB.open(DB_NAME, DB_VERSION); }
      catch (e) { reject(e); return; }

      req.onupgradeneeded = function (e) {
        var d = e.target.result;
        if (!d.objectStoreNames.contains(STORE_EVENTS)) {
          var s = d.createObjectStore(STORE_EVENTS, { keyPath: "id", autoIncrement: true });
          s.createIndex("ts", "ts");
          s.createIndex("type", "type");
          s.createIndex("session", "session");
        }
        if (!d.objectStoreNames.contains(STORE_SESSIONS)) {
          d.createObjectStore(STORE_SESSIONS, { keyPath: "id" });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error("indexedDB open failed")); };
      req.onblocked = function () { reject(new Error("indexedDB blocked")); };
    });
  }

  function tx(stores, mode) {
    return db.transaction(stores, mode);
  }

  /* --------------------------------------------------------------- write */

  function flush() {
    clearTimeout(flushTimer);
    flushTimer = 0;
    if (!ready || !db || !buffer.length) return Promise.resolve(0);

    var batch = buffer;
    buffer = [];

    return new Promise(function (resolve) {
      var t;
      try { t = tx([STORE_EVENTS], "readwrite"); }
      catch (e) { resolve(0); return; }

      var store = t.objectStore(STORE_EVENTS);
      for (var i = 0; i < batch.length; i++) store.add(batch[i]);

      t.oncomplete = function () { resolve(batch.length); };
      t.onerror = function () { resolve(0); };
      t.onabort = function () { resolve(0); };
    });
  }

  function scheduleFlush() {
    if (buffer.length >= MAX_BUFFER) { flush(); return; }
    if (flushTimer) return;
    flushTimer = setTimeout(flush, FLUSH_MS);
  }

  /* Keep the store bounded. Runs once per session, well after first paint, so
     it never competes with rendering. */
  function prune() {
    if (!db) return;
    var t;
    try { t = tx([STORE_EVENTS], "readwrite"); } catch (e) { return; }
    var store = t.objectStore(STORE_EVENTS);
    var countReq = store.count();
    countReq.onsuccess = function () {
      var excess = countReq.result - MAX_EVENTS;
      if (excess <= 0) return;
      /* Walk forward from the oldest key and delete exactly the overflow. */
      var cursorReq = store.openCursor();
      var removed = 0;
      cursorReq.onsuccess = function (e) {
        var cur = e.target.result;
        if (!cur || removed >= excess) return;
        cur.delete();
        removed++;
        cur.continue();
      };
    };
  }

  /* ---------------------------------------------------------------- read */

  function readAll() {
    return new Promise(function (resolve) {
      if (!db) { resolve({ events: [], sessions: [] }); return; }
      var out = { events: [], sessions: [] };
      var t;
      try { t = tx([STORE_EVENTS, STORE_SESSIONS], "readonly"); }
      catch (e) { resolve(out); return; }

      t.objectStore(STORE_EVENTS).getAll().onsuccess = function (e) { out.events = e.target.result || []; };
      t.objectStore(STORE_SESSIONS).getAll().onsuccess = function (e) { out.sessions = e.target.result || []; };
      t.oncomplete = function () { resolve(out); };
      t.onerror = function () { resolve(out); };
    });
  }

  /* ------------------------------------------------------------- public */

  var API = {
    /* Resolves to the API itself so callers can chain, and never rejects —
       telemetry failing must not break the page. */
    init: function () {
      enabled = resolveConsent();
      var fresh = initSession();

      if (!enabled) return Promise.resolve(API);

      return open().then(function (d) {
        db = d;
        ready = true;
        if (fresh) {
          try {
            tx([STORE_SESSIONS], "readwrite").objectStore(STORE_SESSIONS).put(sessionRecord());
          } catch (e) { /* non-fatal */ }
        }
        /* Prune when the browser is idle rather than during load. */
        if (global.requestIdleCallback) requestIdleCallback(prune, { timeout: 4000 });
        else setTimeout(prune, 3000);
        return API;
      }).catch(function () {
        failed = true;
        ready = false;
        return API;
      });
    },

    track: function (type, props) {
      if (!enabled || failed) return;
      buffer.push({
        session: sessionId,
        ts: Date.now(),
        type: String(type),
        props: props || {},
        path: location.pathname + location.hash,
      });
      scheduleFlush();
    },

    flush: flush,

    isEnabled: function () { return enabled; },
    isReady: function () { return ready; },
    isAvailable: function () { return !failed && !!global.indexedDB; },
    sessionId: function () { return sessionId; },

    setEnabled: function (on) {
      on = !!on;
      persistConsent(on);
      if (on === enabled) return Promise.resolve(API);
      enabled = on;
      if (!on) {
        buffer = [];
        clearTimeout(flushTimer);
        flushTimer = 0;
        return Promise.resolve(API);
      }
      if (db) { ready = true; return Promise.resolve(API); }
      return API.init();
    },

    /* Counts for the settings drawer readout. */
    stats: function () {
      return readAll().then(function (all) {
        var byType = Object.create(null);
        for (var i = 0; i < all.events.length; i++) {
          var t = all.events[i].type;
          byType[t] = (byType[t] || 0) + 1;
        }
        var first = all.events.length ? all.events[0].ts : null;
        return {
          events: all.events.length,
          sessions: all.sessions.length,
          byType: byType,
          since: first,
        };
      });
    },

    exportJson: function () {
      return flush().then(readAll).then(function (all) {
        return JSON.stringify({
          exportedAt: new Date().toISOString(),
          note: "Local-only telemetry from worxbend personal page. Never transmitted.",
          schemaVersion: DB_VERSION,
          sessions: all.sessions,
          events: all.events,
        }, null, 2);
      });
    },

    clear: function () {
      buffer = [];
      clearTimeout(flushTimer);
      flushTimer = 0;
      return new Promise(function (resolve) {
        if (!db) { resolve(false); return; }
        var t;
        try { t = tx([STORE_EVENTS, STORE_SESSIONS], "readwrite"); }
        catch (e) { resolve(false); return; }
        t.objectStore(STORE_EVENTS).clear();
        t.objectStore(STORE_SESSIONS).clear();
        t.oncomplete = function () { resolve(true); };
        t.onerror = function () { resolve(false); };
      });
    },
  };

  /* A tab being hidden is the last reliable moment to persist. `pagehide`
     fires on mobile Safari where `beforeunload` does not. */
  global.addEventListener("pagehide", function () { flush(); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) flush();
  });

  global.WBTelemetry = API;
})(window);
