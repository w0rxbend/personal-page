/* ============================================================================
   WBFX — background effect manager
   ----------------------------------------------------------------------------
   One small coordinator that owns everything the decorative canvases share:
   the palette, the pointer, the viewport, the device-pixel ratio, and the
   question of whether we should be animating at all.

   The visual layers themselves live in sibling files and know nothing about
   each other. Each one registers a factory:

       WBFX.register("stars", function (host, ctx) {
         // host  : an HTMLCanvasElement already sized and in the DOM
         // ctx   : { palette, pointer, viewport, dpr, prefersReducedMotion }
         return {
           resize()          {},   // viewport changed
           theme(palette)    {},   // the visitor picked a different theme
           pause()           {},   // tab hidden — stop burning battery
           resume()          {},
           destroy()         {},   // tier changed — release GPU resources
         };
       });

   "Tier" is the single performance dial. It decides which layers exist at all,
   and it is chosen from device capability but always overridable by the
   visitor from the settings drawer. A layer is never asked to half-run: it is
   either constructed or it is not.

   Adding a new effect is therefore two steps: write a module that calls
   WBFX.register, then name it in a tier below. No other file changes.
   ========================================================================= */

(function (global) {
  "use strict";

  /* ------------------------------------------------------------ registry */

  var factories = Object.create(null);
  var live = [];                 // [{ name, api, canvas }]
  var started = false;
  var currentTier = null;
  var stack = null;              // the .fx-stack container element

  /* Which layers run at each tier, back-to-front. `low` deliberately keeps a
     canvas-free page: the CSS grid and vignette still render, so the design
     does not collapse, it only stops moving. */
  var TIERS = {
    off:    [],
    low:    [],
    medium: ["network"],
    high:   ["stars", "network", "glyphs"],
  };

  var TIER_ORDER = ["off", "low", "medium", "high"];

  /* ------------------------------------------------------------- palette */

  /* Themes publish their effect colours as `--fx-*` custom properties. Reading
     them here is what lets a new theme restyle the canvases without touching
     any JavaScript. Values are `R G B` triplets to match the CSS `rgb(… / a)`
     syntax used elsewhere in the stylesheet. */

  var palette = {
    node: [145, 170, 255],
    link: [110, 128, 200],
    c1:   [124, 156, 255],
    c2:   [87, 227, 208],
    c3:   [197, 139, 255],
    c4:   [255, 255, 255],
    alphaNode: 0.62,
    alphaLink: 0.26,
    additive: true,
    starHue: 224,
    glyphAlpha: 0.3,
  };

  function triplet(styles, name, fallback) {
    var raw = styles.getPropertyValue(name).trim();
    if (!raw) return fallback;
    var parts = raw.split(/[\s,]+/).map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return fallback;
    return parts;
  }

  function num(styles, name, fallback) {
    var v = parseFloat(styles.getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }

  function readPalette() {
    var cs = getComputedStyle(document.documentElement);
    palette.node = triplet(cs, "--fx-node", palette.node);
    palette.link = triplet(cs, "--fx-link", palette.link);
    palette.c1 = triplet(cs, "--fx-c1", palette.c1);
    palette.c2 = triplet(cs, "--fx-c2", palette.c2);
    palette.c3 = triplet(cs, "--fx-c3", palette.c3);
    palette.c4 = triplet(cs, "--fx-c4", palette.c4);
    palette.alphaNode = num(cs, "--fx-alpha-node", palette.alphaNode);
    palette.alphaLink = num(cs, "--fx-alpha-link", palette.alphaLink);
    palette.starHue = num(cs, "--fx-star-hue", palette.starHue);
    palette.glyphAlpha = num(cs, "--fx-glyph-alpha", palette.glyphAlpha);
    palette.additive = cs.getPropertyValue("--fx-composite").trim() !== "source-over";
    return palette;
  }

  /* Pack an [r,g,b] triplet into the 0xRRGGBB integer WebGL layers expect. */
  function packRgb(t) {
    return ((t[0] & 255) << 16) | ((t[1] & 255) << 8) | (t[2] & 255);
  }

  /* ------------------------------------------------------- shared inputs */

  var pointer = {
    x: -9999, y: -9999,   // px, viewport space; eased
    tx: -9999, ty: -9999, // px, raw target
    nx: 0, ny: 0,         // normalised -1..1 from centre, eased
    active: false,
    down: false,
    coarse: false,
  };

  var view = { w: 0, h: 0, dpr: 1 };

  function measure() {
    view.w = global.innerWidth;
    view.h = global.innerHeight;
    /* Cap the device-pixel ratio. A 3x phone screen would otherwise ask the
       GPU for nine times the fill rate for effects nobody is looking at. */
    view.dpr = Math.min(global.devicePixelRatio || 1, 2);
    return view;
  }

  function onPointerMove(e) {
    pointer.tx = e.clientX;
    pointer.ty = e.clientY;
    pointer.active = true;
    /* The CSS vignette follows the cursor through these two variables. */
    root.style.setProperty("--mx", e.clientX + "px");
    root.style.setProperty("--my", e.clientY + "px");
  }

  function onPointerLeave() {
    pointer.active = false;
    pointer.tx = -9999;
    pointer.ty = -9999;
  }

  var root = document.documentElement;

  function bindInput() {
    pointer.coarse = global.matchMedia("(pointer: coarse)").matches;
    global.addEventListener("pointermove", onPointerMove, { passive: true });
    global.addEventListener("pointerleave", onPointerLeave, { passive: true });
    global.addEventListener("pointerdown", function () { pointer.down = true; }, { passive: true });
    global.addEventListener("pointerup", function () { pointer.down = false; }, { passive: true });
    global.addEventListener("blur", onPointerLeave);
  }

  /* Called once per frame by whichever layer runs first; cheap enough that
     letting every layer call it would also be fine. */
  var lastEase = 0;
  function easePointer(now) {
    if (now === lastEase) return pointer;
    lastEase = now;
    if (pointer.x < -9000) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
    pointer.x += (pointer.tx - pointer.x) * 0.12;
    pointer.y += (pointer.ty - pointer.y) * 0.12;
    var cx = pointer.active ? pointer.x : view.w / 2;
    var cy = pointer.active ? pointer.y : view.h / 2;
    pointer.nx += ((cx / Math.max(view.w, 1) - 0.5) * 2 - pointer.nx) * 0.05;
    pointer.ny += ((cy / Math.max(view.h, 1) - 0.5) * 2 - pointer.ny) * 0.05;
    return pointer;
  }

  /* ------------------------------------------------------- capability ---- */

  function hasWebGL() {
    try {
      var c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch (e) {
      return false;
    }
  }

  function prefersReducedMotion() {
    return global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* A deliberately conservative guess. Anything that looks like a phone, an
     old laptop, or a machine that has told us it wants less motion gets the
     cheap tier. The visitor can always turn it back up by hand. */
  function detectTier() {
    if (prefersReducedMotion()) return "low";
    if (!hasWebGL()) return "medium";

    var cores = navigator.hardwareConcurrency || 4;
    var mem = navigator.deviceMemory || 4;
    var coarse = global.matchMedia("(pointer: coarse)").matches;
    var narrow = global.innerWidth < 760;
    var saveData = navigator.connection && navigator.connection.saveData;

    if (saveData) return "low";
    if (coarse || narrow) return "medium";
    if (cores <= 4 || mem <= 4) return "medium";
    return "high";
  }

  /* --------------------------------------------------------- script load */

  var loading = Object.create(null);

  /* Vendor bundles are fetched only when a tier actually needs them, so the
     default visit never pays for three.js or PixiJS. */
  function loadScript(src) {
    if (loading[src]) return loading[src];
    loading[src] = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("failed to load " + src)); };
      document.head.appendChild(s);
    });
    return loading[src];
  }

  /* ------------------------------------------------------------ lifecycle */

  function makeCanvas(name) {
    var c = document.createElement("canvas");
    c.id = "fx-" + name;
    c.className = "fx-layer";
    c.setAttribute("aria-hidden", "true");
    stack.appendChild(c);
    return c;
  }

  function context() {
    return {
      palette: palette,
      pointer: pointer,
      view: view,
      easePointer: easePointer,
      packRgb: packRgb,
      loadScript: loadScript,
      prefersReducedMotion: prefersReducedMotion(),
    };
  }

  function teardown() {
    live.forEach(function (l) {
      try { l.api.destroy && l.api.destroy(); } catch (e) { /* layer already gone */ }
      if (l.canvas && l.canvas.parentNode) l.canvas.parentNode.removeChild(l.canvas);
    });
    live = [];
  }

  function buildTier(tier) {
    var names = TIERS[tier] || [];
    names.forEach(function (name) {
      var factory = factories[name];
      if (!factory) return;                  // module not loaded — skip quietly
      var canvas = makeCanvas(name);
      var api;
      try {
        api = factory(canvas, context());
      } catch (e) {
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        return;
      }
      if (!api) {
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        return;
      }
      live.push({ name: name, api: api, canvas: canvas });
      /* Fade the layer in once it has had a frame to fill itself. */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { canvas.classList.add("is-live"); });
      });
    });
  }

  /* ----------------------------------------------------------- resizing */

  var resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      measure();
      live.forEach(function (l) {
        try { l.api.resize && l.api.resize(); } catch (e) { /* non-fatal */ }
      });
    }, 140);
  }

  function onVisibility() {
    var hidden = document.hidden;
    live.forEach(function (l) {
      try {
        if (hidden) { l.api.pause && l.api.pause(); }
        else { l.api.resume && l.api.resume(); }
      } catch (e) { /* non-fatal */ }
    });
  }

  /* -------------------------------------------------------- public API */

  var WBFX = {
    /* Layer modules call this at file scope. Registration is allowed before or
       after start(); a module that loads late is picked up on the next tier
       change, which is why setTier re-reads the registry every time. */
    register: function (name, factory) {
      factories[name] = factory;
      return WBFX;
    },

    tiers: TIER_ORDER.slice(),

    detectTier: detectTier,

    start: function (tier) {
      if (started) return WBFX.setTier(tier);
      stack = document.querySelector(".fx-stack");
      if (!stack) return WBFX;
      started = true;

      measure();
      readPalette();
      bindInput();

      global.addEventListener("resize", onResize, { passive: true });
      global.addEventListener("orientationchange", onResize, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      document.addEventListener("wb:themechange", function () { WBFX.refreshTheme(); });

      return WBFX.setTier(tier || detectTier());
    },

    setTier: function (tier) {
      if (TIER_ORDER.indexOf(tier) === -1) tier = detectTier();
      if (tier === currentTier) return WBFX;
      currentTier = tier;
      root.setAttribute("data-fx", tier);
      teardown();
      if (stack) buildTier(tier);
      return WBFX;
    },

    tier: function () { return currentTier; },

    /* Layers repaint themselves from the new palette rather than being rebuilt,
       so switching themes never drops the animation or reallocates buffers. */
    refreshTheme: function () {
      readPalette();
      live.forEach(function (l) {
        try { l.api.theme && l.api.theme(palette); } catch (e) { /* non-fatal */ }
      });
      return WBFX;
    },

    /* A one-off outward push at a point, used to acknowledge clicks. */
    pulse: function (x, y) {
      live.forEach(function (l) {
        try { l.api.pulse && l.api.pulse(x, y); } catch (e) { /* non-fatal */ }
      });
      return WBFX;
    },

    palette: function () { return palette; },
    pointer: pointer,
    view: view,
    loadScript: loadScript,

    destroy: function () {
      teardown();
      currentTier = null;
      return WBFX;
    },
  };

  global.WBFX = WBFX;
})(window);
