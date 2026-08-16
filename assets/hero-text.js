/* ============================================================================
   hero-text.js — the headline, rebuilt out of particles
   ----------------------------------------------------------------------------
   The <h1> at the top of the page is turned into a cloud of GPU-drawn points
   that fly in from a scatter, settle into the exact shape of the words, and
   get shoved aside by the pointer.

   The important idea: the *browser* still does all the typography. Nothing
   here tries to reproduce line breaks, kerning or the balanced wrapping the
   stylesheet asks for. Instead:

     1. Every word of the headline is temporarily wrapped in a bare <span>, the
        browser is asked where each one landed (getBoundingClientRect), and the
        spans are removed again. An unstyled inline span changes no layout, so
        the measurement is of the real thing.
     2. Those words are painted into an offscreen 2D canvas at the same
        positions, using the h1's own computed font. Ordinary words are painted
        red and words inside the .accent span are painted green — that one
        colour channel is how a pixel remembers which run it came from.
     3. The pixels are read back, every Nth opaque one is kept, and the list of
        coordinates becomes a THREE.Points cloud.

   After that every particle lives in the vertex shader. The fly-in, the idle
   drift and the pointer repulsion are all computed on the GPU from a handful
   of uniforms, so per frame the CPU does nothing but update a cursor position.
   That is what keeps ~20k points cheap.

   The real <h1> text stays in the DOM the whole time — it is only painted
   transparent. Screen readers, search engines, text selection and find-in-page
   all still see a normal headline.

   Crucially, the text is not hidden when the effect attaches: it is hidden on
   the first frame that actually paints settled particles, and a watchdog tears
   the whole thing down if that frame never arrives. The headline is a person's
   name on their CV — the failure mode has to be "plain text", never "nothing
   there". Anything that goes wrong here (no WebGL, three.js blocked, a shader
   that will not link, a tab that never gets an animation frame) therefore ends
   with the ordinary headline on screen.

   three.js is fetched through WBFX.loadScript, the same lazy loader the
   background layers use, so the vendor bundle is downloaded at most once and
   never at all on the tiers that do not want it.
   ========================================================================= */

(function () {
  "use strict";

  var THREE_SRC = "assets/vendor/three.min.js";

  var CONFIG = {
    selector: ".hero-title",

    /* sampling */
    supersample: 2,        // offscreen canvas scale; higher = finer glyph edges
    step: 3,               // keep every Nth device pixel of that canvas
    alphaCutoff: 90,       // 0-255; ignore the faint antialiased fringe
    maxParticles: 22000,   // hard cap, thinned evenly if the text is huge
    pad: 90,               // px of slack round the h1 so pushed particles live

    /* fly-in */
    introDuration: 1.5,    // seconds from full scatter to settled
    introStagger: 0.45,    // fraction of the run each particle is offset within
    scatterRadius: 260,    // px each particle starts away from its target
    scatterDepth: 420,     // px of z spread at the start

    /* idle */
    driftAmount: 1.3,      // px of breathing once settled
    driftSpeed: 0.55,

    /* pointer */
    pointerRadius: 130,    // px of influence
    pointerPush: 62,       // px a particle right under the cursor is shoved
    pointerSwirl: 0.5,     // radians of rotation added to the push direction
    pointerEase: 0.18,     // smoothing of the cursor position, 0-1 per frame

    /* look */
    pointScale: 1.35,      // point size as a multiple of the sample spacing
    gradientSpeed: 0.11,   // how fast the accent gradient travels
    tint: 0.42,            // how much of that gradient plain words take, 0-1
  };

  /* ================================================================ shaders */

  var VERT = [
    "uniform float uTime;",
    "uniform float uProgress;",
    "uniform float uSize;",
    "uniform float uPixelRatio;",
    "uniform vec2  uPointer;",
    "uniform float uPointerRadius;",
    "uniform float uPointerPush;",
    "uniform float uPointerSwirl;",
    "uniform float uDrift;",
    "uniform float uDriftSpeed;",
    "uniform float uStagger;",

    "attribute vec3  aScatter;",
    "attribute float aSeed;",
    "attribute float aAccent;",
    "attribute float aSize;",

    "varying float vAccent;",
    "varying float vFade;",
    "varying float vX;",

    "void main() {",
    /* Every particle runs the same easing curve, just started at a different
       moment. aSeed is its random 0-1 slot in the stagger window. */
    "  float span = max(1.0 - uStagger, 0.0001);",
    "  float t = clamp((uProgress - aSeed * uStagger) / span, 0.0, 1.0);",
    "  float e = 1.0 - pow(1.0 - t, 3.0);",              // easeOutCubic

    "  vec3 p = mix(position + aScatter, position, e);",

    /* Once settled, drift on a slow circle so the block never looks frozen. */
    "  float w = uTime * uDriftSpeed + aSeed * 6.2831853;",
    "  p.xy += vec2(sin(w), cos(w * 1.37)) * uDrift * e;",

    /* Pointer repulsion: push outward, with a twist so the hole swirls open
       instead of merely expanding. */
    "  vec2 d = p.xy - uPointer;",
    "  float dist = length(d);",
    "  float f = 1.0 - smoothstep(0.0, uPointerRadius, dist);",
    "  if (f > 0.0) {",
    "    float a = uPointerSwirl * f;",
    "    vec2 dir = normalize(d + vec2(0.0001));",
    "    dir = vec2(dir.x * cos(a) - dir.y * sin(a), dir.x * sin(a) + dir.y * cos(a));",
    "    p.xy += dir * f * f * uPointerPush;",
    "  }",

    "  vAccent = aAccent;",
    "  vFade = e;",
    "  vX = position.x;",

    "  vec4 mv = modelViewMatrix * vec4(p, 1.0);",
    "  gl_Position = projectionMatrix * mv;",
    "  gl_PointSize = uSize * aSize * uPixelRatio;",
    "}",
  ].join("\n");

  /* No `precision` line in the fragment shaders here or in hero-orb.js: three.js
     prepends the same qualifier to both stages, and declaring a different one by
     hand makes uniforms shared between them fail to link. */
  var FRAG = [
    "uniform vec3  uColorA;",
    "uniform vec3  uColorB;",
    "uniform vec3  uAccentA;",
    "uniform vec3  uAccentB;",
    "uniform vec3  uAccentC;",
    "uniform float uWidth;",
    "uniform float uTime;",
    "uniform float uGradientSpeed;",
    "uniform float uTint;",
    "uniform float uOpacity;",

    "varying float vAccent;",
    "varying float vFade;",
    "varying float vX;",

    "void main() {",
    /* Round, soft-edged dot. Square points read as pixel mush at this density. */
    "  float r = length(gl_PointCoord - 0.5);",
    "  float a = smoothstep(0.5, 0.16, r);",
    "  if (a <= 0.002) discard;",

    "  float u = clamp(vX / max(uWidth, 1.0), 0.0, 1.0);",
    "  vec3 col = mix(uColorA, uColorB, u);",
    /* A three-stop gradient — accent, accent-2, accent-3 — travelling slowly
       along the headline. */
    "  float g = fract(u * 0.8 + uTime * uGradientSpeed);",
    "  vec3 acc = g < 0.5",
    "    ? mix(uAccentA, uAccentB, g * 2.0)",
    "    : mix(uAccentB, uAccentC, (g - 0.5) * 2.0);",
    /* Two ways in. A word inside an .accent span takes the gradient outright
       (vAccent = 1). Everything else takes uTint of it, weighted toward the end
       of the line, so a headline with no accent span still has colour moving
       through it instead of sitting flat. */
    "  float tint = uTint * (0.30 + 0.70 * u);",
    "  col = mix(col, acc, max(vAccent, tint));",

    "  gl_FragColor = vec4(col, a * vFade * uOpacity);",
    "}",
  ].join("\n");

  /* ========================================================= colour helpers */

  /* Reads a CSS custom property off :root and returns it as a THREE.Color.
     Handles "#rrggbb" and the bare "R G B" triplets the --fx-* tokens use. */
  function cssColor(THREE, name, fallback) {
    var raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!raw) raw = fallback;
    var triplet = raw.match(/^(\d+)\s+(\d+)\s+(\d+)$/);
    if (triplet) {
      return new THREE.Color(
        Number(triplet[1]) / 255,
        Number(triplet[2]) / 255,
        Number(triplet[3]) / 255
      );
    }
    try {
      return new THREE.Color(raw);
    } catch (e) {
      return new THREE.Color(fallback);
    }
  }

  /* Every theme publishes --fx-composite. "source-over" means the theme is
     light and additive blending would bleach the text to white. */
  function isAdditive() {
    var cs = getComputedStyle(document.documentElement);
    return cs.getPropertyValue("--fx-composite").trim() !== "source-over";
  }

  /* ========================================================= word measuring */

  /* Wraps every word of `el` in a bare <span>, reads where the browser put it,
     then puts the original markup back. `accentSelector` marks the words inside
     the gradient span so they can be coloured differently. */
  function measureWords(el, accentSelector) {
    var original = el.innerHTML;
    var marker = "data-hp-word";
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    var node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach(function (text) {
      var chunks = text.nodeValue.split(/(\s+)/);
      if (chunks.length === 1 && !chunks[0].trim()) return;
      var frag = document.createDocumentFragment();
      chunks.forEach(function (chunk) {
        if (!chunk) return;
        if (!chunk.trim()) {
          frag.appendChild(document.createTextNode(chunk));
          return;
        }
        var span = document.createElement("span");
        span.setAttribute(marker, "");
        span.textContent = chunk;
        frag.appendChild(span);
      });
      text.parentNode.replaceChild(frag, text);
    });

    var box = el.getBoundingClientRect();
    var words = [];
    Array.prototype.forEach.call(el.querySelectorAll("[" + marker + "]"), function (span) {
      var r = span.getBoundingClientRect();
      if (!r.width || !r.height) return;
      words.push({
        text: span.textContent,
        x: r.left - box.left,
        top: r.top - box.top,
        accent: !!span.closest(accentSelector),
      });
    });

    el.innerHTML = original;
    return { words: words, width: box.width, height: box.height };
  }

  /* =============================================================== sampling */

  /* Paints the measured words into an offscreen canvas and returns one entry per
     surviving pixel: position in CSS pixels relative to the h1 box, plus whether
     it belonged to the accent run. */
  function sampleWords(measured, fontSpec) {
    var ss = CONFIG.supersample;
    var w = Math.max(1, Math.ceil(measured.width));
    var h = Math.max(1, Math.ceil(measured.height));

    var canvas = document.createElement("canvas");
    canvas.width = Math.ceil(w * ss);
    canvas.height = Math.ceil(h * ss);
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.scale(ss, ss);
    ctx.font = fontSpec.font;
    if ("letterSpacing" in ctx) ctx.letterSpacing = fontSpec.letterSpacing;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";

    /* An inline box's top edge sits one font-ascent above the baseline, so this
       puts the canvas text on exactly the baseline the browser used. */
    var probe = ctx.measureText("Hxg");
    var ascent = probe.fontBoundingBoxAscent || probe.actualBoundingBoxAscent || fontSpec.size * 0.8;

    measured.words.forEach(function (word) {
      ctx.fillStyle = word.accent ? "#00ff00" : "#ff0000";
      ctx.fillText(word.text, word.x, word.top + ascent);
    });

    var data;
    try {
      data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    } catch (e) {
      return null;                       // tainted canvas; nothing to be done
    }

    var step = CONFIG.step;
    var pts = [];
    for (var y = 0; y < canvas.height; y += step) {
      for (var x = 0; x < canvas.width; x += step) {
        var i = (y * canvas.width + x) * 4;
        if (data[i + 3] < CONFIG.alphaCutoff) continue;
        pts.push({
          x: x / ss,
          y: y / ss,
          accent: data[i + 1] > data[i] ? 1 : 0,
        });
      }
    }

    /* Thin evenly rather than truncating, so a long headline loses density
       everywhere instead of losing its last word. */
    if (pts.length > CONFIG.maxParticles) {
      var keep = CONFIG.maxParticles / pts.length;
      pts = pts.filter(function () { return Math.random() < keep; });
    }

    return { points: pts, spacing: step / ss, width: w, height: h };
  }

  /* ============================================================= the effect */

  function ParticleHeadline(THREE, el) {
    this.THREE = THREE;
    this.el = el;
    this.pad = CONFIG.pad;
    this.canvas = document.createElement("canvas");
    this.canvas.className = "hero-particles";
    this.canvas.setAttribute("aria-hidden", "true");

    this.pointer = { x: -99999, y: -99999, tx: -99999, ty: -99999 };
    this.painted = false;          // has a settled frame reached the screen?
    this.running = false;
    this.visible = true;
    this.start = 0;
    this.raf = 0;
    this.rebuildTimer = 0;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearAlpha(0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, 1, 0, 1, -2000, 2000);

    this.uniforms = {
      uTime:          { value: 0 },
      uProgress:      { value: 0 },
      uSize:          { value: 3 },
      uPixelRatio:    { value: 1 },
      uPointer:       { value: new THREE.Vector2(-99999, -99999) },
      uPointerRadius: { value: CONFIG.pointerRadius },
      uPointerPush:   { value: CONFIG.pointerPush },
      uPointerSwirl:  { value: CONFIG.pointerSwirl },
      uDrift:         { value: CONFIG.driftAmount },
      uDriftSpeed:    { value: CONFIG.driftSpeed },
      uStagger:       { value: CONFIG.introStagger },
      uColorA:        { value: new THREE.Color("#e8ecfb") },
      uColorB:        { value: new THREE.Color("#e8ecfb") },
      uAccentA:       { value: new THREE.Color("#7c9cff") },
      uAccentB:       { value: new THREE.Color("#57e3d0") },
      uAccentC:       { value: new THREE.Color("#c58bff") },
      uWidth:         { value: 1 },
      uGradientSpeed: { value: CONFIG.gradientSpeed },
      uTint:          { value: CONFIG.tint },
      uOpacity:       { value: 1 },
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    this.points = null;
    this.geometry = null;

    /* `has-particles` only makes the h1 a positioning context for the canvas.
       Hiding the real text is a separate class, added on first paint below. */
    this.el.appendChild(this.canvas);
    this.el.classList.add("has-particles");

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.frame = this.frame.bind(this);
    this.scheduleRebuild = this.scheduleRebuild.bind(this);
  }

  ParticleHeadline.prototype.fontSpec = function () {
    var cs = getComputedStyle(this.el);
    var size = parseFloat(cs.fontSize) || 48;
    return {
      size: size,
      font: [cs.fontStyle, cs.fontWeight, cs.fontSize + "/" + cs.lineHeight, cs.fontFamily].join(" "),
      letterSpacing: cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing,
    };
  };

  /* Re-read the current theme's colours. Called again whenever the theme flips. */
  ParticleHeadline.prototype.syncTheme = function () {
    var THREE = this.THREE;
    var additive = isAdditive();
    var text = cssColor(THREE, "--fg", "#e8ecfb");

    this.uniforms.uColorA.value.copy(text);
    this.uniforms.uColorB.value.copy(cssColor(THREE, "--fg-muted", "#9ba3c4")).lerp(text, 0.45);
    this.uniforms.uAccentA.value.copy(cssColor(THREE, "--fx-c1", "#7c9cff"));
    this.uniforms.uAccentB.value.copy(cssColor(THREE, "--fx-c2", "#57e3d0"));
    this.uniforms.uAccentC.value.copy(cssColor(THREE, "--fx-c3", "#c58bff"));

    /* On a dark theme the dots are light-on-dark, so adding them together gives
       a pleasant bloom where they overlap. On a light theme the same maths
       bleaches the text to white, so blend normally there. */
    this.material.blending = additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    this.uniforms.uOpacity.value = additive ? 0.95 : 1;
    this.material.needsUpdate = true;
  };

  ParticleHeadline.prototype.build = function () {
    var THREE = this.THREE;

    /* measureWords rewrites the h1's innerHTML, which would replace our canvas
       with a fresh (and unreferenced) copy of itself. Take it out of the way. */
    if (this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    var measured = measureWords(this.el, ".accent");
    this.el.appendChild(this.canvas);
    if (!measured.words.length) return false;

    var sampled = sampleWords(measured, this.fontSpec());
    if (!sampled || sampled.points.length < 32) return false;

    var n = sampled.points.length;
    var pad = this.pad;
    var position = new Float32Array(n * 3);
    var scatter = new Float32Array(n * 3);
    var seed = new Float32Array(n);
    var accent = new Float32Array(n);
    var size = new Float32Array(n);

    for (var i = 0; i < n; i++) {
      var p = sampled.points[i];
      position[i * 3]     = p.x + pad;
      position[i * 3 + 1] = p.y + pad;
      position[i * 3 + 2] = 0;

      /* Start on a random ring around the target, well outside the headline. */
      var ang = Math.random() * Math.PI * 2;
      var rad = CONFIG.scatterRadius * (0.35 + Math.random() * 0.65);
      scatter[i * 3]     = Math.cos(ang) * rad;
      scatter[i * 3 + 1] = Math.sin(ang) * rad * 0.6;
      scatter[i * 3 + 2] = (Math.random() - 0.5) * CONFIG.scatterDepth;

      seed[i] = Math.random();
      accent[i] = p.accent;
      size[i] = 0.75 + Math.random() * 0.5;
    }

    if (this.points) {
      this.scene.remove(this.points);
      this.geometry.dispose();
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
    this.geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    this.geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    this.geometry.setAttribute("aAccent", new THREE.BufferAttribute(accent, 1));
    this.geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    var w = sampled.width + pad * 2;
    var h = sampled.height + pad * 2;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.camera.left = 0;
    this.camera.right = w;
    this.camera.top = 0;
    this.camera.bottom = h;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.canvas.style.left = -pad + "px";
    this.canvas.style.top = -pad + "px";

    this.uniforms.uPixelRatio.value = dpr;
    this.uniforms.uSize.value = sampled.spacing * CONFIG.pointScale;
    this.uniforms.uWidth.value = sampled.width;

    this.syncTheme();
    return true;
  };

  ParticleHeadline.prototype.onPointerMove = function (e) {
    var r = this.canvas.getBoundingClientRect();
    this.pointer.tx = e.clientX - r.left;
    this.pointer.ty = e.clientY - r.top;
  };

  ParticleHeadline.prototype.onPointerLeave = function () {
    this.pointer.tx = -99999;
    this.pointer.ty = -99999;
    this.pointer.x = -99999;
    this.pointer.y = -99999;
  };

  ParticleHeadline.prototype.frame = function (now) {
    this.raf = requestAnimationFrame(this.frame);
    if (!this.visible) return;

    if (!this.start) this.start = now;
    var t = (now - this.start) / 1000;

    this.uniforms.uTime.value = t;
    this.uniforms.uProgress.value = Math.min(t / CONFIG.introDuration, 1);

    var ease = CONFIG.pointerEase;
    this.pointer.x += (this.pointer.tx - this.pointer.x) * ease;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * ease;
    this.uniforms.uPointer.value.set(this.pointer.x, this.pointer.y);

    this.renderer.render(this.scene, this.camera);

    /* Hand the headline over only once the particles are far enough through
       the fly-in to read as text. Before that the real <h1> is still visible
       underneath, so the two never both disappear. */
    if (!this.painted && this.uniforms.uProgress.value >= 0.2) {
      this.painted = true;
      this.el.classList.add("particles-live");
    }
  };

  /* Re-sample the headline after a resize or a webfont swap. The fly-in is
     deliberately NOT replayed: `start` keeps its original value, so uProgress
     stays where it was and the new particles appear already settled.

     Replaying it would mean every resize tick, and every late-arriving font,
     drops the headline back to zero opacity and fades it in again — which
     reads as flicker, and leaves the name invisible for the length of the
     intro each time. */
  ParticleHeadline.prototype.scheduleRebuild = function () {
    var self = this;
    clearTimeout(this.rebuildTimer);
    this.rebuildTimer = setTimeout(function () { self.build(); }, 220);
  };

  ParticleHeadline.prototype.destroy = function () {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.el.classList.remove("has-particles");
    this.el.classList.remove("particles-live");
    if (this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    try { this.renderer.dispose(); } catch (e) { /* context already gone */ }
  };

  ParticleHeadline.prototype.run = function () {
    if (this.running) return;
    this.running = true;

    var self = this;

    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerdown", this.onPointerMove, { passive: true });
    document.addEventListener("pointerleave", this.onPointerLeave);
    window.addEventListener("blur", this.onPointerLeave);

    if ("ResizeObserver" in window) {
      new ResizeObserver(this.scheduleRebuild).observe(this.el);
    } else {
      window.addEventListener("resize", this.scheduleRebuild);
    }

    /* Only burn frames while the headline is actually on screen. */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        self.visible = entries[0].isIntersecting;
      }, { rootMargin: "120px" }).observe(this.el);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cancelAnimationFrame(self.raf);
        self.raf = 0;
      } else if (!self.raf) {
        self.raf = requestAnimationFrame(self.frame);
      }
    });

    /* The theme swatches and the motion switch both live on <html>. */
    new MutationObserver(function () { self.syncTheme(); }).observe(
      document.documentElement,
      { attributes: true, attributeFilter: ["data-theme"] }
    );

    /* If no frame has painted by now, something in the pipeline is not running
       — a driver that refused the context, a tab that never got an animation
       frame, a shader that linked but draws nothing. Give the headline back. */
    setTimeout(function () {
      if (!self.painted) self.destroy();
    }, 2500);

    this.raf = requestAnimationFrame(this.frame);
  };

  /* =================================================================== boot */

  /* The effect is decoration, so it only runs where decoration is wanted: not
     under reduced motion and not with the motion switch off.

     It runs from the "medium" tier upward, unlike the orb. One small canvas the
     size of the headline is a very different cost from a full-viewport scene,
     and this is the effect the page is actually built around — gating it behind
     the top tier meant most visitors never saw it. The "low" tier still gets
     the plain gradient headline and no WebGL context at all. */
  function wanted() {
    var root = document.documentElement;
    if (root.getAttribute("data-motion") === "off") return false;
    if (root.getAttribute("data-motion") !== "on" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (!window.WBFX) return false;
    var tier = window.WBFX.tier();
    return tier === "medium" || tier === "high";
  }

  function init() {
    if (!window.WBFX || !wanted()) return;

    var el = document.querySelector(CONFIG.selector);
    if (!el) return;

    window.WBFX.loadScript(THREE_SRC).then(function () {
      var THREE = window.THREE;
      if (!THREE || !wanted()) return;

      var effect;
      try {
        effect = new ParticleHeadline(THREE, el);
        if (!effect.build()) throw new Error("no samples");
      } catch (e) {
        /* Leave the plain gradient headline exactly as it was. */
        if (effect) effect.destroy();
        return;
      }

      effect.run();

      /* Webfonts usually land after this runs; remeasure once they do, or the
         particles keep the shape of the fallback font. */
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { effect.scheduleRebuild(); });
      }
    }).catch(function () { /* three.js unavailable — plain headline stands */ });
  }

  /* app.js starts WBFX during its own boot, so wait for the load event: by then
     a tier has been chosen and wanted() can give a real answer. */
  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);
})();
