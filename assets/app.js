/* ============================================================================
   app.js — page wiring
   ----------------------------------------------------------------------------
   Plain browser JavaScript. No framework, no build step, no transpiler: the
   file you read here is the file the browser runs, which is the point.

   Sections
     1.  store            localStorage-backed settings with safe fallbacks
     2.  helpers          escaping, formatting, DOM shorthands
     3.  theme            apply / persist / broadcast
     4.  motion & fx      the two performance dials
     5.  reveal           IntersectionObserver entrance animations
     6.  catalog          render, search, facets, URL state
     7.  résumé           experience, skills, education
     8.  palette          the Ctrl-K command menu
     9.  drawer           settings panel, including the telemetry controls
     10. misc             scroll progress, nav highlighting, hero rotator
     11. boot
   ========================================================================= */

(function () {
  "use strict";

  var CATALOG = window.WB_CATALOG || { projects: [], categories: [], langs: [], totals: {} };
  var PROFILE = window.WB_PROFILE || {};
  var T = window.WBTelemetry;

  /* ================================================================ 1. store */

  var KEYS = {
    theme: "wb.theme",
    motion: "wb.motion",
    fx: "wb.fx",
    density: "wb.density",
  };

  /* Every read and write is wrapped: Safari in private mode throws on
     localStorage access rather than returning null, and a settings panel is
     not worth breaking a page over. */
  var store = {
    get: function (k, fallback) {
      try {
        var v = localStorage.getItem(k);
        return v === null ? fallback : v;
      } catch (e) { return fallback; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, v); } catch (e) { /* ignore */ }
    },
    del: function (k) {
      try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
    },
  };

  /* =============================================================== 2. helpers */

  var esc = (window.WBSearch && window.WBSearch.escapeHtml) || function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var hl = (window.WBSearch && window.WBSearch.highlight) || esc;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* Turns the **bold** markers used in the résumé bullets into <strong>, after
     escaping. The source text is ours, but escaping first is free. */
  function mdBold(text) {
    return esc(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  function debounce(fn, ms) {
    var t = 0;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }

  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  var ICONS = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .33 1.76l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.76-.33 1.6 1.6 0 0 0-1 1.47V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9.1 19.4a1.6 1.6 0 0 0-1.76.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.6 1.6 0 0 0 4.6 15a1.6 1.6 0 0 0-1.47-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9.1a1.6 1.6 0 0 0-.33-1.76l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.6 1.6 0 0 0 9 4.6a1.6 1.6 0 0 0 1-1.47V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.47 1.6 1.6 0 0 0 1.76-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.6 1.6 0 0 0 19.4 9v0a1.6 1.6 0 0 0 1.47 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.47 1Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4v14m0 0 6-6m-6 6-6-6"/></svg>',
    logo: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="16" cy="16" r="12"/><ellipse cx="16" cy="16" rx="12" ry="4.6"/><ellipse cx="16" cy="16" rx="4.6" ry="12"/><circle cx="16" cy="16" r="2.4" fill="currentColor" stroke="none"/></svg>',
  };

  /* ================================================================= 3. theme */

  var THEMES = [
    { key: "radiant", label: "Prime Radiant", dots: ["#7c9cff", "#57e3d0", "#c58bff"] },
    { key: "matrix", label: "Matrix", dots: ["#4dff9f", "#9dff5c", "#26c97a"] },
    { key: "blueprint", label: "Blueprint", dots: ["#4fc3f7", "#ffd479", "#7fe3c4"] },
    { key: "solar", label: "Solar", dots: ["#ff9d4d", "#ff5f7e", "#ffd166"] },
    { key: "nebula", label: "Nebula", dots: ["#d68bff", "#56d8ff", "#ff87c3"] },
    { key: "observatory", label: "Observatory", dots: ["#3b5bdb", "#0b8a72", "#8b3fd6"] },
  ];

  var themeKeys = THEMES.map(function (t) { return t.key; });

  function applyTheme(key, persist) {
    if (themeKeys.indexOf(key) === -1) key = "radiant";
    document.documentElement.setAttribute("data-theme", key);
    if (persist !== false) store.set(KEYS.theme, key);

    /* Keep the browser UI colour in step with the page. */
    var meta = $('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content",
        getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#05060d");
    }

    /* The background engines listen for this and repaint from the new
       `--fx-*` values without being rebuilt. */
    document.dispatchEvent(new CustomEvent("wb:themechange", { detail: { theme: key } }));

    $$("[data-theme-swatch]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-swatch") === key));
    });
    if (persist !== false && T) T.track("theme.change", { theme: key });
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "radiant";
  }

  /* ========================================================= 4. motion & fx */

  function applyMotion(mode, persist) {
    /* "auto" defers to the operating system preference, which the stylesheet
       already handles through a media query. "off" forces it. */
    if (mode !== "off" && mode !== "on") mode = "auto";
    document.documentElement.setAttribute("data-motion",
      mode === "off" ? "off" : (mode === "on" ? "on" : ""));
    if (mode === "auto") document.documentElement.removeAttribute("data-motion");
    if (persist !== false) store.set(KEYS.motion, mode);
    $$("[data-motion-opt]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-motion-opt") === mode));
    });
  }

  function applyFx(tier, persist) {
    if (!window.WBFX) return;
    if (tier === "auto") {
      store.del(KEYS.fx);
      window.WBFX.setTier(window.WBFX.detectTier());
    } else {
      window.WBFX.setTier(tier);
      if (persist !== false) store.set(KEYS.fx, tier);
    }
    var active = store.get(KEYS.fx, "auto");
    $$("[data-fx-opt]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-fx-opt") === active));
    });
    if (persist !== false && T) T.track("fx.change", { tier: tier });
  }

  /* ================================================================ 5. reveal */

  var revealObserver = null;
  var revealArmed = false;
  var failsafeTimer = 0;

  /* Deliberately instant. This runs when the nice path has already failed, so
     it drops the transition rather than animating eighty cards at once —
     an opacity tween that cannot complete would leave the content stuck at
     zero, which is the exact failure this function exists to prevent. */
  function revealAll() {
    document.documentElement.removeAttribute("data-reveal");
    $$(".reveal").forEach(function (n) {
      n.style.transition = "none";
      n.classList.add("in");
    });
  }

  /* The failsafe is the reason it is safe to hide content at all. If anything
     stops the observer delivering — a browser quirk, a background tab that
     never composites, an exception elsewhere — this fires and the page becomes
     plain visible content a couple of seconds later. */
  function armFailsafe() {
    clearTimeout(failsafeTimer);
    failsafeTimer = setTimeout(function () {
      var hidden = $$(".reveal:not(.in)").filter(function (n) {
        var r = n.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;   // on screen, still hidden
      });
      if (hidden.length) revealAll();
    }, 2500);
  }

  function observeReveals(root) {
    if (!("IntersectionObserver" in window)) {
      revealAll();
      return;
    }
    if (!revealArmed) {
      revealArmed = true;
      document.documentElement.setAttribute("data-reveal", "on");
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          revealObserver.unobserve(e.target);      // one-shot
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    }
    $$(".reveal:not(.in)", root).forEach(function (n) { revealObserver.observe(n); });
    armFailsafe();
  }

  /* =============================================================== 6. catalog */

  var index = null;
  var state = { q: "", cat: "", lang: "", tier: "" };
  var lastResults = [];

  function buildIndex() {
    if (!window.WBSearch) return null;
    return window.WBSearch.build(CATALOG.projects);
  }

  function matchesFacets(p) {
    if (state.cat && p.category !== state.cat) return false;
    if (state.lang && p.lang !== state.lang) return false;
    if (state.tier && p.tier !== state.tier) return false;
    return true;
  }

  /* Text relevance alone ranks a one-commit stub level with a released,
     documented project whenever both happen to mention the same word. Nudging
     by maturity fixes the case that matters: searching "esp32" should surface
     the ESP32 camera firmware before a scratch sketch that mentions the chip
     in passing. The multipliers are small enough that a strong text match
     still beats a weak one from a higher tier. */
  var TIER_BOOST = { flagship: 1.3, solid: 1.0, lab: 0.75 };

  function runSearch() {
    if (!index) return CATALOG.projects.map(function (p) { return { doc: p, score: 0, terms: [] }; });

    var results = window.WBSearch.query(index, state.q, { filter: matchesFacets, limit: 500 });

    /* With no query every score is 0, so the catalog keeps its curated order
       (category, then tier, then recency) rather than being reshuffled. */
    if (!state.q) return results;

    results.forEach(function (r) {
      r.score *= (TIER_BOOST[r.doc.tier] || 1);
      /* A gentle popularity tiebreak — at most ~10% for the most-starred. */
      r.score *= 1 + Math.min(r.doc.stars, 8) * 0.012;
    });
    results.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return String(a.doc.title).localeCompare(String(b.doc.title));
    });
    return results;
  }

  function cardHtml(res) {
    var p = res.doc;
    var terms = res.terms || [];

    var chips = p.stack.slice(0, 6).map(function (s) {
      return '<span class="chip">' + hl(s, terms) + "</span>";
    }).join("");

    var highlights = p.highlights.length
      ? '<ul class="card-highlights">' + p.highlights.slice(0, 3).map(function (h) {
          return "<li>" + hl(h, terms) + "</li>";
        }).join("") + "</ul>"
      : "";

    var langBit = p.lang
      ? '<span><i class="lang-dot" style="--lang-color:' + esc(p.langColor || "#888") + '"></i>' + esc(p.lang) + "</span>"
      : "";

    var starBit = p.stars
      ? "<span>" + ICONS.star + esc(String(p.stars)) + "</span>"
      : "";

    var homeBit = p.homepage
      ? '<a href="' + esc(p.homepage) + '" target="_blank" rel="noopener noreferrer" title="Project site" aria-label="Project site for ' + esc(p.title) + '">' + ICONS.link + "</a>"
      : "";

    var statusBit = p.status
      ? '<div class="card-owner" style="margin-top:6px">' + esc(p.status) + "</div>"
      : "";

    return (
      '<article class="card reveal" data-id="' + esc(p.id) + '">' +
        '<div class="card-top">' +
          "<div>" +
            '<h3 class="card-title"><a href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">' +
              hl(p.title, terms) +
            "</a></h3>" +
            '<div class="card-owner">' + esc(p.owner) + "/" + hl(p.name, terms) + "</div>" +
          "</div>" +
          '<span class="tier-badge" data-tier="' + esc(p.tier) + '">' + esc(p.tier) + "</span>" +
        "</div>" +
        '<p class="card-tagline">' + hl(p.tagline, terms) + "</p>" +
        '<p class="card-summary">' + hl(p.summary, terms) + "</p>" +
        highlights +
        statusBit +
        '<div class="chips">' + chips + "</div>" +
        '<div class="card-foot">' +
          langBit + starBit +
          "<span>" + esc(p.updated) + "</span>" +
          '<span class="card-links">' + homeBit +
            '<a href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer" title="Open on GitHub" aria-label="' + esc(p.id) + ' on GitHub">' + ICONS.github + "</a>" +
          "</span>" +
        "</div>" +
      "</article>"
    );
  }

  function renderCatalog(opts) {
    opts = opts || {};
    var grid = $("#catalog-grid");
    if (!grid) return;

    var results = runSearch();
    lastResults = results;

    var countEl = $("#result-count");
    if (countEl) countEl.textContent = plural(results.length, "project", "projects");

    if (!results.length) {
      grid.innerHTML =
        '<div class="empty-state">' +
          "<p>Nothing matched that.</p>" +
          '<p style="margin-top:10px;font-size:14px">Try a broader word, or a field query such as ' +
          "<code>lang:rust</code>, <code>owner:worxbend</code> or <code>tier:flagship</code>.</p>" +
        "</div>";
      return;
    }

    /* Group by category only when the visitor has not narrowed things down.
       Once there is a query, a flat relevance-ordered list is more useful than
       headings that fragment six results across six groups. */
    var grouped = !state.q && !state.lang && !state.tier;
    var html = "";

    if (grouped) {
      var byCat = {};
      results.forEach(function (r) {
        (byCat[r.doc.category] || (byCat[r.doc.category] = [])).push(r);
      });
      CATALOG.categories.forEach(function (c) {
        var list = byCat[c.key];
        if (!list || !list.length) return;
        html +=
          '<div class="group-head">' +
            "<h3>" + esc(c.label) + "</h3>" +
            '<span class="count">' + list.length + "</span>" +
          "</div>";
        html += list.map(cardHtml).join("");
      });
    } else {
      html = results.map(cardHtml).join("");
    }

    grid.innerHTML = html;

    /* On a re-render from typing, showing the entrance animation again reads
       as flicker. Only the first paint gets the stagger. */
    if (opts.animate === false) {
      $$(".card.reveal", grid).forEach(function (n) { n.classList.add("in"); });
    } else {
      $$(".card.reveal", grid).forEach(function (n, i) {
        n.style.setProperty("--reveal-delay", Math.min(i, 12) * 28 + "ms");
      });
      observeReveals(grid);
    }

    attachCardPointer(grid);
  }

  /* The cursor sheen on each card. One delegated listener rather than eighty. */
  function attachCardPointer(grid) {
    if (grid.__pointerBound) return;
    grid.__pointerBound = true;
    grid.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--cx", (e.clientX - r.left) + "px");
      card.style.setProperty("--cy", (e.clientY - r.top) + "px");
    }, { passive: true });

    grid.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest("a[href]");
      if (!link) return;
      var card = link.closest(".card");
      if (card && T) T.track("project.open", { id: card.getAttribute("data-id"), href: link.href });
    });
  }

  /* --------------------------------------------------------- facet chrome */

  function renderFacets() {
    var host = $("#facets");
    if (!host) return;

    function group(legend, name, options) {
      return (
        '<div class="facet-group" role="group" aria-label="' + esc(legend) + '">' +
          '<span class="facet-legend">' + esc(legend) + "</span>" +
          options.map(function (o) {
            return '<button type="button" class="facet" data-facet="' + esc(name) + '" data-value="' + esc(o.value) + '" aria-pressed="' + (state[name] === o.value) + '">' +
              esc(o.label) +
              (o.count != null ? '<span class="count">' + o.count + "</span>" : "") +
              "</button>";
          }).join("") +
        "</div>"
      );
    }

    var cats = [{ value: "", label: "All", count: CATALOG.projects.length }].concat(
      CATALOG.categories.map(function (c) { return { value: c.key, label: c.label, count: c.count }; })
    );

    var langs = [{ value: "", label: "Any" }].concat(
      CATALOG.langs.slice(0, 10).map(function (l) { return { value: l.lang, label: l.lang, count: l.count }; })
    );

    var tiers = [
      { value: "", label: "Any" },
      { value: "flagship", label: "Flagship", count: CATALOG.projects.filter(function (p) { return p.tier === "flagship"; }).length },
      { value: "solid", label: "Solid", count: CATALOG.projects.filter(function (p) { return p.tier === "solid"; }).length },
      { value: "lab", label: "Lab", count: CATALOG.projects.filter(function (p) { return p.tier === "lab"; }).length },
    ];

    host.innerHTML =
      group("Domain", "cat", cats) +
      group("Language", "lang", langs) +
      group("Maturity", "tier", tiers);

    host.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".facet");
      if (!b) return;
      var name = b.getAttribute("data-facet");
      var value = b.getAttribute("data-value");
      state[name] = state[name] === value ? "" : value;
      syncFacetPressed();
      renderCatalog({ animate: false });
      writeUrl();
      if (T) T.track("facet.change", { facet: name, value: state[name] });
    });
  }

  function syncFacetPressed() {
    $$("#facets .facet").forEach(function (b) {
      var name = b.getAttribute("data-facet");
      b.setAttribute("aria-pressed", String(state[name] === b.getAttribute("data-value")));
    });
  }

  /* ------------------------------------------------------------- URL state */

  /* Keeping the query in the address bar means a filtered view is linkable and
     survives a reload. replaceState avoids filling the back stack with every
     keystroke. */
  var writeUrl = debounce(function () {
    var params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.cat) params.set("cat", state.cat);
    if (state.lang) params.set("lang", state.lang);
    if (state.tier) params.set("tier", state.tier);
    var qs = params.toString();
    var url = location.pathname + (qs ? "?" + qs : "") + location.hash;
    try { history.replaceState(null, "", url); } catch (e) { /* file:// */ }
  }, 260);

  function readUrl() {
    try {
      var p = new URLSearchParams(location.search);
      state.q = p.get("q") || "";
      state.cat = p.get("cat") || "";
      state.lang = p.get("lang") || "";
      state.tier = p.get("tier") || "";
    } catch (e) { /* ignore */ }
  }

  /* -------------------------------------------------------------- search UI */

  function wireSearch() {
    var input = $("#catalog-search");
    var field = $("#search-field");
    if (!input) return;

    input.value = state.q;
    if (field) field.classList.toggle("is-searching", !!state.q);

    var onInput = debounce(function () {
      state.q = input.value.trim();
      if (field) field.classList.toggle("is-searching", !!state.q);
      renderCatalog({ animate: false });
      writeUrl();
      if (state.q.length > 1 && T) {
        T.track("search", { q: state.q, results: lastResults.length });
      }
    }, 130);

    input.addEventListener("input", onInput);

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        input.value = "";
        state.q = "";
        if (field) field.classList.remove("is-searching");
        renderCatalog({ animate: false });
        writeUrl();
        input.blur();
      }
    });

    var clear = $("#search-clear");
    if (clear) clear.addEventListener("click", function () {
      input.value = "";
      state.q = "";
      if (field) field.classList.remove("is-searching");
      renderCatalog({ animate: false });
      writeUrl();
      input.focus();
    });

    /* "/" focuses search, the convention from GitHub and Vim-flavoured UIs. */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      input.focus();
      input.select();
    });
  }

  /* ================================================================ 7. résumé */

  function renderExperience() {
    var host = $("#timeline");
    if (!host || !PROFILE.jobs) return;
    host.innerHTML = PROFILE.jobs.map(function (j) {
      var points = j.points.map(function (p, i) {
        var mark = String(i + 1).padStart(2, "0");
        return '<li data-mark="' + mark + '">' + mdBold(p) + "</li>";
      }).join("");
      var tech = j.tech.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("");
      return (
        '<article class="job reveal">' +
          '<div class="job-when">' +
            '<span class="range">' + esc(j.start) + " — " + esc(j.end) + "</span>" +
            '<span class="dur">' + esc(j.duration) + "</span>" +
            '<span class="loc">' + esc(j.location) + "</span>" +
          "</div>" +
          "<div>" +
            '<h3 class="job-role">' + esc(j.role) + (j.team ? " · " + esc(j.team) : "") + "</h3>" +
            '<div class="job-org">' + esc(j.company) + "</div>" +
            '<p class="job-blurb">' + esc(j.blurb) + "</p>" +
            '<ul class="job-points">' + points + "</ul>" +
            '<div class="chips">' + tech + "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  function renderSkills() {
    var host = $("#skill-grid");
    if (!host || !PROFILE.skillGroups) return;
    var span = 9;   // career length in years, the bar's denominator
    host.innerHTML = PROFILE.skillGroups.map(function (g) {
      var rows = g.items.map(function (s) {
        var pct = Math.max(8, Math.min(100, Math.round((s.yrs / span) * 100)));
        return (
          '<div class="skill-row">' +
            '<div class="skill-label">' +
              '<span class="name">' + esc(s.name) + (s.note ? " <span class='yrs'>· " + esc(s.note) + "</span>" : "") + "</span>" +
              '<span class="yrs">' + s.yrs + "y</span>" +
            "</div>" +
            '<div class="skill-track"><div class="skill-fill" style="--pct:' + pct + '%"></div></div>' +
          "</div>"
        );
      }).join("");
      return (
        '<div class="skill-card reveal">' +
          '<div class="skill-head">' +
            '<span class="skill-glyph">' + esc(g.glyph) + "</span>" +
            "<h3>" + esc(g.title) + "</h3>" +
          "</div>" + rows +
        "</div>"
      );
    }).join("");
  }

  function renderEducation() {
    var host = $("#education-list");
    if (!host || !PROFILE.education) return;
    host.innerHTML = PROFILE.education.map(function (e) {
      return (
        '<div class="line-item reveal">' +
          '<span class="when">' + esc(e.date) + "</span>" +
          "<div>" +
            '<div class="what">' + esc(e.degree) + "</div>" +
            '<div class="where">' + esc(e.school) + " · " + esc(e.place) + "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  /* ======================================================= 8. command palette */

  var palette = {
    open: false,
    items: [],
    filtered: [],
    cursor: 0,
  };

  function buildPaletteItems() {
    var items = [];

    $$("[data-section]").forEach(function (s) {
      items.push({
        kind: "go",
        title: s.getAttribute("data-section-label") || s.id,
        sub: "Jump to section",
        run: function () { location.hash = "#" + s.id; },
      });
    });

    THEMES.forEach(function (t) {
      items.push({
        kind: "theme",
        title: t.label,
        sub: "Switch theme",
        run: function () { applyTheme(t.key); },
      });
    });

    items.push(
      { kind: "action", title: "Settings", sub: "Open the settings panel", run: openDrawer },
      { kind: "action", title: "Copy email address", sub: PROFILE.person.email, run: function () { copy(PROFILE.person.email); } },
      { kind: "action", title: "Reduce motion", sub: "Stop all animation", run: function () { applyMotion("off"); toast("Motion reduced"); } },
      { kind: "action", title: "Restore motion", sub: "Follow the system preference", run: function () { applyMotion("auto"); toast("Motion follows your system"); } }
    );

    CATALOG.projects.forEach(function (p) {
      items.push({
        kind: p.category,
        title: p.title,
        sub: p.owner + "/" + p.name + " — " + p.tagline,
        run: function () { window.open(p.url, "_blank", "noopener"); },
      });
    });

    return items;
  }

  function openPalette() {
    var scrim = $("#palette-scrim");
    if (!scrim) return;
    palette.open = true;
    if (!palette.items.length) palette.items = buildPaletteItems();
    scrim.classList.add("is-open");
    var input = $("#palette-input");
    input.value = "";
    filterPalette("");
    setTimeout(function () { input.focus(); }, 30);
    if (T) T.track("palette.open");
  }

  function closePalette() {
    var scrim = $("#palette-scrim");
    if (!scrim) return;
    palette.open = false;
    scrim.classList.remove("is-open");
  }

  function filterPalette(q) {
    q = q.toLowerCase().trim();
    var out;
    if (!q) {
      out = palette.items.slice(0, 40);
    } else {
      out = palette.items.filter(function (it) {
        return (it.title + " " + it.sub + " " + it.kind).toLowerCase().indexOf(q) !== -1;
      }).slice(0, 60);
    }
    palette.filtered = out;
    palette.cursor = 0;
    paintPalette();
  }

  function paintPalette() {
    var list = $("#palette-list");
    if (!list) return;
    if (!palette.filtered.length) {
      list.innerHTML = '<li><div class="palette-item" style="cursor:default"><span class="pi-main"><span class="pi-sub">No matches</span></span></div></li>';
      return;
    }
    list.innerHTML = palette.filtered.map(function (it, i) {
      return (
        "<li>" +
          '<button type="button" class="palette-item" data-i="' + i + '" aria-selected="' + (i === palette.cursor) + '">' +
            '<span class="pi-kind">' + esc(it.kind) + "</span>" +
            '<span class="pi-main">' +
              '<span class="pi-title">' + esc(it.title) + "</span>" +
              '<span class="pi-sub">' + esc(it.sub) + "</span>" +
            "</span>" +
          "</button>" +
        "</li>"
      );
    }).join("");
    var sel = list.querySelector('[aria-selected="true"]');
    if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: "nearest" });
  }

  function movePalette(delta) {
    if (!palette.filtered.length) return;
    palette.cursor = (palette.cursor + delta + palette.filtered.length) % palette.filtered.length;
    paintPalette();
  }

  function runPalette(i) {
    var it = palette.filtered[i != null ? i : palette.cursor];
    if (!it) return;
    closePalette();
    if (T) T.track("palette.run", { kind: it.kind, title: it.title });
    it.run();
  }

  function wirePalette() {
    var scrim = $("#palette-scrim");
    if (!scrim) return;
    var input = $("#palette-input");
    var list = $("#palette-list");

    input.addEventListener("input", function () { filterPalette(input.value); });

    document.addEventListener("keydown", function (e) {
      var isK = (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
      if (isK) { e.preventDefault(); palette.open ? closePalette() : openPalette(); return; }
      if (!palette.open) return;
      if (e.key === "Escape") { e.preventDefault(); closePalette(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); movePalette(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); movePalette(-1); }
      else if (e.key === "Enter") { e.preventDefault(); runPalette(); }
    });

    list.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".palette-item");
      if (!b || !b.hasAttribute("data-i")) return;
      runPalette(parseInt(b.getAttribute("data-i"), 10));
    });

    scrim.addEventListener("click", function (e) { if (e.target === scrim) closePalette(); });

    var trigger = $("#cmd-trigger");
    if (trigger) trigger.addEventListener("click", openPalette);
  }

  /* ============================================================== 9. drawer */

  function openDrawer() {
    $("#drawer").classList.add("is-open");
    $("#drawer-scrim").classList.add("is-open");
    $("#drawer").setAttribute("aria-hidden", "false");
    refreshTelemetryReadout();
    if (T) T.track("settings.open");
  }

  function closeDrawer() {
    $("#drawer").classList.remove("is-open");
    $("#drawer-scrim").classList.remove("is-open");
    $("#drawer").setAttribute("aria-hidden", "true");
  }

  function renderThemeSwatches() {
    var host = $("#theme-swatches");
    if (!host) return;
    host.innerHTML = THEMES.map(function (t) {
      var dots = t.dots.map(function (d) { return '<i style="background:' + esc(d) + '"></i>'; }).join("");
      return (
        '<button type="button" class="swatch" data-theme-swatch="' + esc(t.key) + '" aria-pressed="false">' +
          '<span class="swatch-dots">' + dots + "</span>" +
          "<span>" + esc(t.label) + "</span>" +
        "</button>"
      );
    }).join("");
    host.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-theme-swatch]");
      if (b) applyTheme(b.getAttribute("data-theme-swatch"));
    });
  }

  function refreshTelemetryReadout() {
    if (!T) return;
    var toggle = $("#telemetry-toggle");
    if (toggle) toggle.setAttribute("aria-checked", String(T.isEnabled()));

    var readout = $("#telemetry-readout");
    if (!readout) return;

    if (!T.isAvailable()) {
      readout.innerHTML = '<div><div class="n">—</div><div class="l">unavailable</div></div>' +
        '<div><div class="n">—</div><div class="l">in this browser</div></div>';
      return;
    }
    T.stats().then(function (s) {
      readout.innerHTML =
        '<div><div class="n">' + s.events + '</div><div class="l">events</div></div>' +
        '<div><div class="n">' + s.sessions + '</div><div class="l">sessions</div></div>';
    });
  }

  function wireDrawer() {
    var open = $("#settings-btn");
    if (open) open.addEventListener("click", openDrawer);
    var close = $("#drawer-close");
    if (close) close.addEventListener("click", closeDrawer);
    var scrim = $("#drawer-scrim");
    if (scrim) scrim.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && $("#drawer").classList.contains("is-open")) closeDrawer();
    });

    $$("[data-motion-opt]").forEach(function (b) {
      b.addEventListener("click", function () { applyMotion(b.getAttribute("data-motion-opt")); });
    });
    $$("[data-fx-opt]").forEach(function (b) {
      b.addEventListener("click", function () { applyFx(b.getAttribute("data-fx-opt")); });
    });

    var toggle = $("#telemetry-toggle");
    if (toggle && T) {
      toggle.addEventListener("click", function () {
        var next = toggle.getAttribute("aria-checked") !== "true";
        T.setEnabled(next).then(function () {
          toggle.setAttribute("aria-checked", String(T.isEnabled()));
          refreshTelemetryReadout();
          toast(T.isEnabled() ? "Local analytics on" : "Local analytics off");
        });
      });
    }

    var exportBtn = $("#telemetry-export");
    if (exportBtn && T) exportBtn.addEventListener("click", function () {
      T.exportJson().then(function (json) {
        var blob = new Blob([json], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "worxbend-telemetry-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
        toast("Exported");
      });
    });

    var clearBtn = $("#telemetry-clear");
    if (clearBtn && T) clearBtn.addEventListener("click", function () {
      T.clear().then(function () {
        refreshTelemetryReadout();
        toast("Local data cleared");
      });
    });

    var resetBtn = $("#reset-settings");
    if (resetBtn) resetBtn.addEventListener("click", function () {
      Object.keys(KEYS).forEach(function (k) { store.del(KEYS[k]); });
      applyTheme("radiant");
      applyMotion("auto");
      applyFx("auto");
      toast("Settings reset");
    });
  }

  /* ================================================================ 10. misc */

  var toastTimer = 0;
  function toast(msg) {
    var t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-open");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-open"); }, 2200);
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { toast("Copied " + text); },
        function () { toast(text); }
      );
    } else {
      toast(text);
    }
  }

  function wireScrollProgress() {
    var bar = $("#scroll-progress");
    if (!bar) return;
    var ticking = false;
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.setProperty("--progress", pct.toFixed(2) + "%");
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function wireNavSpy() {
    var links = $$(".primary-nav a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = byId[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute("aria-current"); });
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });

    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) obs.observe(s);
    });
  }

  /* The hero's rotating specialism. Types in, holds, deletes, moves on. */
  function wireRotator() {
    var host = $("#hero-rotator");
    if (!host || !PROFILE.person) return;
    var words = PROFILE.person.specialisms || [];
    if (!words.length) return;

    /* With motion off this becomes a static label rather than dead space. */
    if (document.documentElement.getAttribute("data-motion") === "off" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      host.textContent = words[0];
      return;
    }

    var wi = 0, ci = 0, deleting = false;
    function step() {
      var word = words[wi];
      ci += deleting ? -1 : 1;
      host.textContent = word.slice(0, ci);

      var delay = deleting ? 34 : 62;
      if (!deleting && ci === word.length) { deleting = true; delay = 1750; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 320; }
      setTimeout(step, delay);
    }
    setTimeout(step, 700);
  }

  function wireMetrics() {
    var host = $("#metrics");
    if (!host || !PROFILE.metrics) return;
    host.innerHTML = PROFILE.metrics.map(function (m) {
      return (
        '<div class="metric">' +
          '<div class="metric-val" data-target="' + esc(m.val) + '" data-suffix="' + esc(m.suffix || "") + '">0' + esc(m.suffix || "") + "</div>" +
          '<div class="metric-lbl">' + esc(m.lbl) + "</div>" +
        "</div>"
      );
    }).join("");

    if (!("IntersectionObserver" in window)) {
      $$(".metric-val", host).forEach(function (n) {
        n.textContent = n.getAttribute("data-target") + n.getAttribute("data-suffix");
      });
      return;
    }

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.getAttribute("data-motion") === "off";

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        countUp(e.target, reduce);
      });
    }, { threshold: 0.4 });

    $$(".metric-val", host).forEach(function (n) { obs.observe(n); });
  }

  function countUp(node, instant) {
    var raw = node.getAttribute("data-target");
    var suffix = node.getAttribute("data-suffix") || "";
    var plus = raw.indexOf("+") !== -1;
    var target = parseFloat(raw.replace(/[^\d.]/g, "")) || 0;

    if (instant) { node.textContent = raw + suffix; return; }

    var t0 = performance.now();
    var dur = 1400;
    function frame(now) {
      var p = Math.min(1, (now - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = target * eased;
      node.textContent = (target % 1 === 0 ? Math.round(v) : v.toFixed(1)) + (plus ? "+" : "") + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function wireCopyables() {
    $$("[data-copy]").forEach(function (n) {
      n.addEventListener("click", function (e) {
        e.preventDefault();
        copy(n.getAttribute("data-copy"));
        if (T) T.track("contact.copy", { what: n.getAttribute("data-copy-label") || "value" });
      });
    });
  }

  /* Clicking the page sends a ripple through the particle mesh. Ignored on
     interactive elements so it never competes with a real click. */
  function wireFxPulse() {
    document.addEventListener("pointerdown", function (e) {
      if (!window.WBFX) return;
      if (e.target.closest && e.target.closest("a,button,input,select,textarea,.card,.drawer,.palette")) return;
      window.WBFX.pulse(e.clientX, e.clientY);
    }, { passive: true });
  }

  /* ================================================================= 11. boot */

  function boot() {
    /* Settings first, so nothing renders in the wrong theme and then jumps. */
    applyTheme(store.get(KEYS.theme, "radiant"), false);
    applyMotion(store.get(KEYS.motion, "auto"), false);

    renderThemeSwatches();
    applyTheme(currentTheme(), false);          // sync swatch pressed states

    readUrl();

    index = buildIndex();
    renderFacets();
    wireSearch();
    renderCatalog({ animate: true });

    renderExperience();
    renderSkills();
    renderEducation();
    wireMetrics();

    wirePalette();
    wireDrawer();
    wireScrollProgress();
    wireNavSpy();
    wireRotator();
    wireCopyables();
    wireFxPulse();

    observeReveals(document);

    /* Background effects last: they are decorative, and starting them after
       the content is on screen keeps the first paint quick. */
    if (window.WBFX) {
      var saved = store.get(KEYS.fx, "auto");
      window.WBFX.start(saved === "auto" ? window.WBFX.detectTier() : saved);
      $$("[data-fx-opt]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-fx-opt") === saved));
      });
    }

    if (T) {
      T.init().then(function () {
        T.track("page.view", {
          theme: currentTheme(),
          fx: window.WBFX ? window.WBFX.tier() : null,
          projects: CATALOG.projects.length,
        });
        refreshTelemetryReadout();
      });
    }

    /* Stamp the generated-on date and totals into the footer. */
    var stamp = $("#data-stamp");
    if (stamp) {
      stamp.textContent = CATALOG.projects.length + " projects · data " + (CATALOG.generatedAt || "—");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
