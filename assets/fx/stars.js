/* ============================================================================
   WBFX layer: "stars" — the celestial plate, rendered with three.js
   ----------------------------------------------------------------------------
   Three things share one WebGL scene:

     1. a deep starfield      ~2200 points on a spherical shell, each with its
                              own colour, size and twinkle phase
     2. the Prime Radiant     a wireframe icosahedron off to one side, turning
                              slowly — the "celestial mechanism" motif
     3. orbital rings         three tilted ellipses around the mechanism

   The camera never moves toward the content; it only leans a few degrees
   toward the cursor and drifts with the scroll position. That keeps the plate
   feeling like a distant sky rather than something the page is flying through.

   three.js is loaded on demand by this module, so a visitor on a low tier
   never downloads it.
   ========================================================================= */

(function () {
  "use strict";

  if (!window.WBFX) return;

  var THREE_SRC = "assets/vendor/three.min.js";

  var STAR_COUNT = 2200;
  var SHELL_INNER = 240;
  var SHELL_OUTER = 900;

  var VERT = [
    "attribute float aSize;",
    "attribute float aPhase;",
    "attribute vec3 aColor;",
    "uniform float uTime;",
    "uniform float uDpr;",
    "varying vec3 vColor;",
    "varying float vTwinkle;",
    "void main() {",
    "  vColor = aColor;",
    /* Each star gets its own phase so the field shimmers instead of pulsing
       in unison. */
    "  vTwinkle = 0.55 + 0.45 * sin(uTime * 1.5 + aPhase * 6.2831853);",
    "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
    "  gl_PointSize = aSize * uDpr * (300.0 / max(-mv.z, 1.0));",
    "  gl_Position = projectionMatrix * mv;",
    "}",
  ].join("\n");

  var FRAG = [
    "precision mediump float;",
    "uniform float uOpacity;",
    "varying vec3 vColor;",
    "varying float vTwinkle;",
    "void main() {",
    "  vec2 uv = gl_PointCoord - vec2(0.5);",
    "  float d = length(uv);",
    "  if (d > 0.5) discard;",
    /* A soft core with a fast falloff reads as a point of light without
       needing a texture upload. */
    "  float core = smoothstep(0.5, 0.0, d);",
    "  float a = pow(core, 2.6) * uOpacity * vTwinkle;",
    "  gl_FragColor = vec4(vColor * (0.65 + 0.5 * vTwinkle), a);",
    "}",
  ].join("\n");

  window.WBFX.register("stars", function (canvas, ctx) {
    var THREE = null;
    var renderer, scene, camera, clock;
    var stars, starMat, starGeo;
    var mechanism, rings = [];
    var raf = 0;
    var running = false;
    var destroyed = false;
    var scrollY = 0;
    var time = 0;

    /* --------------------------------------------------------------- boot */

    ctx.loadScript(THREE_SRC).then(function () {
      if (destroyed) return;
      THREE = window.THREE;
      if (!THREE) return;
      try {
        build();
        running = true;
        loop();
      } catch (e) {
        /* A WebGL failure must never take the page down with it. The layer
           simply stays blank and the CSS grid carries the background. */
        destroyed = true;
      }
    }).catch(function () { destroyed = true; });

    /* ------------------------------------------------------------- build */

    function build() {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(ctx.view.dpr);
      renderer.setSize(ctx.view.w, ctx.view.h, false);
      if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
      }

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(58, ctx.view.w / Math.max(ctx.view.h, 1), 1, 2400);
      camera.position.set(0, 0, 460);
      clock = new THREE.Clock();

      buildStars();
      buildMechanism();
      applyPalette(ctx.palette);
    }

    /* Stars sit on a shell rather than filling a box, so no star is ever close
       enough to the camera to blow up into a disc when the camera leans. */
    function buildStars() {
      var pos = new Float32Array(STAR_COUNT * 3);
      var col = new Float32Array(STAR_COUNT * 3);
      var size = new Float32Array(STAR_COUNT);
      var phase = new Float32Array(STAR_COUNT);

      for (var i = 0; i < STAR_COUNT; i++) {
        /* Uniform direction on a sphere, then a random radius in the shell. */
        var u = Math.random() * 2 - 1;
        var theta = Math.random() * Math.PI * 2;
        var s = Math.sqrt(1 - u * u);
        var r = SHELL_INNER + Math.random() * (SHELL_OUTER - SHELL_INNER);

        pos[i * 3] = Math.cos(theta) * s * r;
        pos[i * 3 + 1] = Math.sin(theta) * s * r * 0.7;   // flatten a little
        pos[i * 3 + 2] = u * r;

        /* A few bright stars carry most of the visual weight; the rest are
           faint. Squaring a uniform random gives that distribution. */
        var t = Math.random();
        size[i] = 0.8 + t * t * 5.2;
        phase[i] = Math.random();

        col[i * 3] = 1; col[i * 3 + 1] = 1; col[i * 3 + 2] = 1;
      }

      starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      starGeo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
      starGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
      starGeo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));

      starMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uDpr: { value: ctx.view.dpr },
          uOpacity: { value: 0.9 },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);
    }

    function buildMechanism() {
      mechanism = new THREE.Group();
      /* Pushed right and up so it sits in the empty quadrant beside the hero
         copy rather than behind it. */
      mechanism.position.set(210, 70, -60);
      scene.add(mechanism);

      var geo = new THREE.IcosahedronGeometry(96, 2);
      var wire = new THREE.WireframeGeometry(geo);
      var mat = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      var shell = new THREE.LineSegments(wire, mat);
      shell.userData.role = "shell";
      mechanism.add(shell);
      geo.dispose();

      /* Vertex sparks on the hull read as instrument nodes. */
      var vGeo = new THREE.IcosahedronGeometry(96, 2);
      var vMat = new THREE.PointsMaterial({
        size: 2.4,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      });
      var vPts = new THREE.Points(vGeo, vMat);
      vPts.userData.role = "nodes";
      mechanism.add(vPts);

      /* Three rings on different axes — the orbital mechanics motif. */
      var tilts = [
        [Math.PI / 2, 0, 0],
        [Math.PI / 2.6, 0.5, 0.2],
        [Math.PI / 1.7, -0.6, -0.3],
      ];
      var radii = [150, 190, 230];

      for (var i = 0; i < tilts.length; i++) {
        var curve = new THREE.EllipseCurve(0, 0, radii[i], radii[i] * 0.94, 0, Math.PI * 2, false, 0);
        var pts = curve.getPoints(128);
        var rGeo = new THREE.BufferGeometry().setFromPoints(pts);
        var rMat = new THREE.LineBasicMaterial({
          transparent: true,
          opacity: 0.22 - i * 0.045,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        var ring = new THREE.LineLoop(rGeo, rMat);
        ring.rotation.set(tilts[i][0], tilts[i][1], tilts[i][2]);
        ring.userData.spin = (i % 2 === 0 ? 1 : -1) * (0.02 + i * 0.012);
        mechanism.add(ring);
        rings.push(ring);
      }
    }

    /* ------------------------------------------------------------ palette */

    /* Star colours are drawn from the theme's three accents plus white, with
       white weighted heaviest so the field stays readable rather than gaudy. */
    function applyPalette(p) {
      if (!THREE || !starGeo) return;

      var choices = [p.c1, p.c2, p.c3, p.c4, p.c4];
      var col = starGeo.getAttribute("aColor");
      for (var i = 0; i < STAR_COUNT; i++) {
        var pick = choices[i % choices.length];
        /* Deterministic per-index jitter keeps the field stable across theme
           switches — the same star keeps roughly the same character. */
        var j = 0.78 + ((i * 2654435761) % 1000) / 1000 * 0.22;
        col.setXYZ(i, (pick[0] / 255) * j, (pick[1] / 255) * j, (pick[2] / 255) * j);
      }
      col.needsUpdate = true;

      /* The light theme needs the plate pulled right down or the white page
         turns into fog. */
      var light = !p.additive;
      starMat.uniforms.uOpacity.value = light ? 0.34 : 0.9;
      starMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      starMat.needsUpdate = true;

      var c1 = new THREE.Color(p.c1[0] / 255, p.c1[1] / 255, p.c1[2] / 255);
      var c2 = new THREE.Color(p.c2[0] / 255, p.c2[1] / 255, p.c2[2] / 255);

      mechanism.children.forEach(function (child) {
        if (!child.material) return;
        if (child.userData.role === "nodes") {
          child.material.color = c2;
          child.material.opacity = light ? 0.5 : 0.75;
        } else if (child.userData.role === "shell") {
          child.material.color = c1;
          child.material.opacity = light ? 0.22 : 0.34;
        } else {
          child.material.color = c2;
          child.material.opacity = light ? 0.12 : 0.2;
        }
        child.material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
        child.material.needsUpdate = true;
      });
    }

    /* --------------------------------------------------------------- loop */

    function loop() {
      if (!running || destroyed) return;
      raf = requestAnimationFrame(loop);

      var dt = Math.min(clock.getDelta(), 0.05);
      time += dt;

      var p = ctx.easePointer(time);

      starMat.uniforms.uTime.value = time;

      /* The whole sky counter-rotates very slowly; the mechanism turns faster
         so the two never look locked together. */
      stars.rotation.y = time * 0.008;
      stars.rotation.x = Math.sin(time * 0.05) * 0.04;

      mechanism.rotation.y = time * 0.13;
      mechanism.rotation.x = Math.sin(time * 0.19) * 0.16;

      for (var i = 0; i < rings.length; i++) {
        rings[i].rotation.z += rings[i].userData.spin * dt;
      }

      /* Camera lean: a few units, eased, plus a slow scroll drift. */
      camera.position.x = p.nx * 34;
      camera.position.y = -p.ny * 24 - scrollY * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    /* ------------------------------------------------------------ scroll */

    function onScroll() { scrollY = window.scrollY || 0; }
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ------------------------------------------------------------- public */

    return {
      resize: function () {
        if (!renderer || destroyed) return;
        renderer.setPixelRatio(ctx.view.dpr);
        renderer.setSize(ctx.view.w, ctx.view.h, false);
        camera.aspect = ctx.view.w / Math.max(ctx.view.h, 1);
        camera.updateProjectionMatrix();
        starMat.uniforms.uDpr.value = ctx.view.dpr;
      },

      theme: function (p) {
        if (destroyed || !THREE) return;
        applyPalette(p);
      },

      pause: function () {
        running = false;
        cancelAnimationFrame(raf);
      },

      resume: function () {
        if (destroyed || !renderer || running) return;
        running = true;
        clock.getDelta();          // swallow the gap so nothing jumps
        loop();
      },

      destroy: function () {
        destroyed = true;
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);

        if (scene) {
          scene.traverse(function (o) {
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
              if (Array.isArray(o.material)) o.material.forEach(function (m) { m.dispose(); });
              else o.material.dispose();
            }
          });
        }
        if (renderer) {
          renderer.dispose();
          /* Browsers cap the number of live WebGL contexts. Releasing this one
             explicitly matters when the visitor toggles the tier repeatedly. */
          if (renderer.forceContextLoss) renderer.forceContextLoss();
        }
        renderer = scene = camera = stars = starMat = starGeo = mechanism = null;
        rings = [];
      },
    };
  });
})();
