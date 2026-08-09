/* ============================================================================
   WBFX layer: "network" — the constellation mesh, rendered on Canvas2D
   ----------------------------------------------------------------------------
   Nodes drift under a low-frequency noise field, link to whichever neighbours
   fall inside a radius, and light up as the cursor drags energy through the
   mesh. It is the "foundation" motif: a lattice that holds itself together.

   Why Canvas2D and not WebGL: this layer has to run on the medium tier, which
   is exactly the hardware that should not be asked to spin up a second GPU
   context. A few hundred nodes and a few hundred line segments per frame is
   comfortably inside Canvas2D's budget when the draw calls are batched.

   Two properties keep it cheap:

     * Nothing allocates inside the frame loop. Every buffer below is a typed
       array sized once at start and reused for the life of the page.
     * Neighbour search is a uniform grid with a counting sort, not an O(n²)
       double loop. Doubling the node count roughly doubles the cost instead of
       quadrupling it.
   ========================================================================= */

(function () {
  "use strict";

  if (!window.WBFX) return;

  var CFG = {
    areaPerNode: 9200,       // one node per this many CSS pixels of viewport
    minNodes: 45,
    maxNodes: 260,

    damping: 0.972,
    maxSpeed: 44,
    windForce: 5.0,          // px/s² from the noise field
    windScale: 0.0016,       // spatial frequency of the field
    windDrift: 0.05,         // how fast the field itself moves
    edgeMargin: 60,
    edgePush: 40,

    linkDist: 132,
    maxLinksPerNode: 6,

    springK: 1.5,
    springRest: 0.78,        // fraction of linkDist
    springDamp: 0.9,

    cursorRadius: 220,
    cursorPull: 4800,
    cursorMax: 200,
    swirl: 0.32,             // tangential share, so nodes orbit the cursor
    pulseForce: 300,
    pulseRadius: 400,

    energyRadius: 180,
    energyGain: 2.5,
    energyDecay: 0.955,
    energySpread: 0.18,

    nodeRadius: 1.5,
    nodeJitter: 1.3,
    lineWidth: 1,
    fadeIn: 1.4,             // seconds
  };

  var BUCKETS = 6;           // brightness bands — one stroke batch each
  var TAU = Math.PI * 2;

  /* ------------------------------------------------------- value noise */

  /* A cheap 2D value-noise field. Good enough to look like wind, and far
     cheaper than a real simplex implementation. */
  function hash2(ix, iy, seed) {
    var h = ix * 374761393 + iy * 668265263 + seed * 2147483647;
    h = (h ^ (h >> 13)) * 1274126177;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
  }

  function noise2(x, y, seed) {
    var ix = Math.floor(x), iy = Math.floor(y);
    var fx = x - ix, fy = y - iy;
    var ux = fx * fx * (3 - 2 * fx);
    var uy = fy * fy * (3 - 2 * fy);
    var a = hash2(ix, iy, seed);
    var b = hash2(ix + 1, iy, seed);
    var c = hash2(ix, iy + 1, seed);
    var d = hash2(ix + 1, iy + 1, seed);
    return (a * (1 - ux) + b * ux) * (1 - uy) + (c * (1 - ux) + d * ux) * uy;
  }

  window.WBFX.register("network", function (canvas, ctx2) {
    var g = canvas.getContext("2d", { alpha: true });
    if (!g) return null;

    var W = 0, H = 0, dpr = 1;
    var n = 0, cap = 0;

    /* Node state — structure of arrays, not array of structures. */
    var px, py, vx, vy, rad, energy;

    /* Link buffers. Sized for the worst case so they never grow mid-frame. */
    var linkA, linkB, linkD, linkCount = 0;

    /* Spatial hash */
    var cellSize = CFG.linkDist;
    var cols = 0, rows = 0, cellCount = 0;
    var cellStart, cellItems, cellFill;

    var raf = 0, running = false, destroyed = false;
    var last = 0, elapsed = 0;
    var pal = ctx2.palette;
    var ripples = [];        // reused objects; never grows past a few entries

    /* --------------------------------------------------------- allocation */

    function allocate() {
      var target = Math.round((W * H) / CFG.areaPerNode);
      n = Math.max(CFG.minNodes, Math.min(CFG.maxNodes, target));

      if (n > cap) {
        cap = n;
        px = new Float32Array(cap);
        py = new Float32Array(cap);
        vx = new Float32Array(cap);
        vy = new Float32Array(cap);
        rad = new Float32Array(cap);
        energy = new Float32Array(cap);

        var maxLinks = cap * CFG.maxLinksPerNode;
        linkA = new Uint16Array(maxLinks);
        linkB = new Uint16Array(maxLinks);
        linkD = new Float32Array(maxLinks);

        cellItems = new Uint16Array(cap);
      }

      for (var i = 0; i < n; i++) {
        px[i] = Math.random() * W;
        py[i] = Math.random() * H;
        vx[i] = (Math.random() - 0.5) * 12;
        vy[i] = (Math.random() - 0.5) * 12;
        rad[i] = CFG.nodeRadius + Math.random() * CFG.nodeJitter;
        energy[i] = 0;
      }

      buildGrid();
    }

    function buildGrid() {
      cols = Math.max(1, Math.ceil(W / cellSize));
      rows = Math.max(1, Math.ceil(H / cellSize));
      var count = cols * rows;
      if (count !== cellCount) {
        cellCount = count;
        cellStart = new Int32Array(cellCount + 1);
        cellFill = new Int32Array(cellCount);
      }
    }

    /* Counting sort of node indices into grid cells. Two passes, no sorting
       library, no allocation. */
    function hashNodes() {
      cellStart.fill(0);
      var i, c;
      for (i = 0; i < n; i++) {
        c = cellOf(px[i], py[i]);
        cellStart[c + 1]++;
      }
      for (i = 0; i < cellCount; i++) cellStart[i + 1] += cellStart[i];
      cellFill.set(cellStart.subarray(0, cellCount));
      for (i = 0; i < n; i++) {
        c = cellOf(px[i], py[i]);
        cellItems[cellFill[c]++] = i;
      }
    }

    function cellOf(x, y) {
      var cx = x < 0 ? 0 : (x >= W ? cols - 1 : (x / cellSize) | 0);
      var cy = y < 0 ? 0 : (y >= H ? rows - 1 : (y / cellSize) | 0);
      if (cx >= cols) cx = cols - 1;
      if (cy >= rows) cy = rows - 1;
      return cy * cols + cx;
    }

    /* ---------------------------------------------------------- physics */

    function integrate(dt, t) {
      var wind = CFG.windForce;
      var ns = CFG.windScale;
      var drift = t * CFG.windDrift;
      var maxSp = CFG.maxSpeed;

      for (var i = 0; i < n; i++) {
        /* Two noise lookups offset by a large constant give a rough vector
           field without needing a curl. */
        var a = noise2(px[i] * ns + drift, py[i] * ns, 1) - 0.5;
        var b = noise2(px[i] * ns, py[i] * ns + drift, 7919) - 0.5;
        vx[i] += a * wind * dt * 2;
        vy[i] += b * wind * dt * 2;

        /* Soft walls. Pushing back before the edge stops nodes piling up in
           the corners, which a hard bounce would cause. */
        if (px[i] < CFG.edgeMargin) vx[i] += CFG.edgePush * dt * (1 - px[i] / CFG.edgeMargin);
        else if (px[i] > W - CFG.edgeMargin) vx[i] -= CFG.edgePush * dt * (1 - (W - px[i]) / CFG.edgeMargin);
        if (py[i] < CFG.edgeMargin) vy[i] += CFG.edgePush * dt * (1 - py[i] / CFG.edgeMargin);
        else if (py[i] > H - CFG.edgeMargin) vy[i] -= CFG.edgePush * dt * (1 - (H - py[i]) / CFG.edgeMargin);

        var d = Math.pow(CFG.damping, dt * 60);
        vx[i] *= d;
        vy[i] *= d;

        var sp = Math.hypot(vx[i], vy[i]);
        if (sp > maxSp) {
          var k = maxSp / sp;
          vx[i] *= k; vy[i] *= k;
        }

        px[i] += vx[i] * dt;
        py[i] += vy[i] * dt;

        /* Belt and braces: clamp in case a huge dt slipped through. */
        if (px[i] < -20) px[i] = -20; else if (px[i] > W + 20) px[i] = W + 20;
        if (py[i] < -20) py[i] = -20; else if (py[i] > H + 20) py[i] = H + 20;

        energy[i] *= CFG.energyDecay;
      }
    }

    function connect() {
      linkCount = 0;
      var maxD = CFG.linkDist;
      var maxD2 = maxD * maxD;
      var perNode = CFG.maxLinksPerNode;
      var cellMax = linkA.length;

      for (var cy = 0; cy < rows; cy++) {
        for (var cx = 0; cx < cols; cx++) {
          var c = cy * cols + cx;
          var s = cellStart[c], e = cellStart[c + 1];
          for (var ii = s; ii < e; ii++) {
            var i = cellItems[ii];
            var mine = 0;

            /* Scan this cell and the four "forward" neighbours only. Each
               unordered pair is therefore visited exactly once. */
            for (var oy = 0; oy <= 1; oy++) {
              for (var ox = -1; ox <= 1; ox++) {
                if (oy === 0 && ox < 0) continue;
                var nx2 = cx + ox, ny2 = cy + oy;
                if (nx2 < 0 || nx2 >= cols || ny2 >= rows) continue;
                var c2 = ny2 * cols + nx2;
                var s2 = cellStart[c2], e2 = cellStart[c2 + 1];
                for (var jj = s2; jj < e2; jj++) {
                  var j = cellItems[jj];
                  if (c2 === c && j <= i) continue;
                  var dx = px[j] - px[i], dy = py[j] - py[i];
                  var d2 = dx * dx + dy * dy;
                  if (d2 > maxD2 || d2 === 0) continue;
                  if (mine >= perNode) { oy = 2; ox = 2; break; }
                  if (linkCount >= cellMax) return;
                  linkA[linkCount] = i;
                  linkB[linkCount] = j;
                  linkD[linkCount] = Math.sqrt(d2);
                  linkCount++;
                  mine++;
                }
              }
            }
          }
        }
      }
    }

    function springs(dt) {
      var rest = CFG.linkDist * CFG.springRest;
      var k = CFG.springK;
      for (var l = 0; l < linkCount; l++) {
        var i = linkA[l], j = linkB[l], d = linkD[l];
        if (d < 0.001) continue;
        var dx = (px[j] - px[i]) / d, dy = (py[j] - py[i]) / d;
        var f = (d - rest) * k * dt;
        vx[i] += dx * f; vy[i] += dy * f;
        vx[j] -= dx * f; vy[j] -= dy * f;

        /* Energy bleeds along every edge, so a bright node lights its
           neighbourhood a frame or two later. */
        var avg = (energy[i] + energy[j]) * 0.5;
        var s = CFG.energySpread * dt * 60 * 0.5;
        energy[i] += (avg - energy[i]) * s;
        energy[j] += (avg - energy[j]) * s;
      }
    }

    function cursor(dt) {
      var p = ctx2.pointer;
      if (!p.active) return;
      var R = CFG.cursorRadius, R2 = R * R;
      var pull = p.down ? -CFG.cursorPull * 1.4 : CFG.cursorPull;

      for (var i = 0; i < n; i++) {
        var dx = p.x - px[i], dy = p.y - py[i];
        var d2 = dx * dx + dy * dy;
        if (d2 > R2 || d2 < 1) continue;
        var d = Math.sqrt(d2);
        var f = Math.min(pull / d2, CFG.cursorMax);
        var ux = dx / d, uy = dy / d;
        /* A tangential component turns a collapse into an orbit. */
        vx[i] += (ux * (1 - CFG.swirl) - uy * CFG.swirl) * f * dt;
        vy[i] += (uy * (1 - CFG.swirl) + ux * CFG.swirl) * f * dt;

        if (d < CFG.energyRadius) {
          energy[i] = Math.min(1, energy[i] + (1 - d / CFG.energyRadius) * CFG.energyGain * dt);
        }
      }
    }

    function applyRipples(dt) {
      for (var r = ripples.length - 1; r >= 0; r--) {
        var rp = ripples[r];
        rp.age += dt;
        var reach = rp.age * 900;
        if (reach > CFG.pulseRadius) { ripples.splice(r, 1); continue; }
        for (var i = 0; i < n; i++) {
          var dx = px[i] - rp.x, dy = py[i] - rp.y;
          var d = Math.hypot(dx, dy);
          if (Math.abs(d - reach) > 46 || d < 1) continue;
          var f = CFG.pulseForce * (1 - reach / CFG.pulseRadius);
          vx[i] += (dx / d) * f * dt * 12;
          vy[i] += (dy / d) * f * dt * 12;
          energy[i] = Math.min(1, energy[i] + 0.45);
        }
      }
    }

    /* ----------------------------------------------------------- render */

    var mixOut = [0, 0, 0];

    /* Idle → warm → hot, so an energised region reads as a different colour
       and not merely a brighter one. */
    function mixColour(e) {
      var a, b, t;
      if (e < 0.5) { a = pal.node; b = pal.c1; t = e * 2; }
      else { a = pal.c1; b = pal.c2; t = (e - 0.5) * 2; }
      mixOut[0] = (a[0] + (b[0] - a[0]) * t) | 0;
      mixOut[1] = (a[1] + (b[1] - a[1]) * t) | 0;
      mixOut[2] = (a[2] + (b[2] - a[2]) * t) | 0;
      return mixOut;
    }

    function draw() {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      g.globalCompositeOperation = pal.additive ? "lighter" : "source-over";

      var intro = Math.min(1, elapsed / CFG.fadeIn);
      var linkAlpha = pal.alphaLink * intro;
      var nodeAlpha = pal.alphaNode * intro;

      /* --- links, batched into brightness buckets ---------------------- */
      /* One beginPath/stroke per bucket instead of per segment: six draw
         calls a frame rather than several hundred. */
      g.lineWidth = CFG.lineWidth;
      for (var band = 0; band < BUCKETS; band++) {
        var lo = band / BUCKETS, hi = (band + 1) / BUCKETS;
        var mid = (lo + hi) * 0.5;
        var c = mixColour(mid);
        var any = false;

        g.beginPath();
        for (var l = 0; l < linkCount; l++) {
          var i = linkA[l], j = linkB[l];
          var e = (energy[i] + energy[j]) * 0.5;
          if (e < lo || e >= hi) continue;
          var fall = 1 - linkD[l] / CFG.linkDist;
          if (fall <= 0) continue;
          g.moveTo(px[i], py[i]);
          g.lineTo(px[j], py[j]);
          any = true;
        }
        if (any) {
          g.strokeStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," +
            (linkAlpha * (0.35 + mid * 1.5)).toFixed(3) + ")";
          g.stroke();
        }
      }

      /* --- nodes -------------------------------------------------------- */
      for (var band2 = 0; band2 < BUCKETS; band2++) {
        var lo2 = band2 / BUCKETS, hi2 = (band2 + 1) / BUCKETS;
        var mid2 = (lo2 + hi2) * 0.5;
        var c2 = mixColour(mid2);
        var drew = false;

        g.beginPath();
        for (var k = 0; k < n; k++) {
          var en = energy[k];
          if (en < lo2 || en >= hi2) continue;
          var r = rad[k] * (1 + en * 1.5);
          g.moveTo(px[k] + r, py[k]);
          g.arc(px[k], py[k], r, 0, TAU);
          drew = true;
        }
        if (drew) {
          g.fillStyle = "rgba(" + c2[0] + "," + c2[1] + "," + c2[2] + "," +
            (nodeAlpha * (0.5 + mid2)).toFixed(3) + ")";
          g.fill();
        }
      }

      g.globalCompositeOperation = "source-over";
    }

    /* ------------------------------------------------------------- loop */

    function frame(now) {
      if (!running || destroyed) return;
      raf = requestAnimationFrame(frame);

      if (!last) last = now;
      /* Clamp the step. A backgrounded tab that wakes up with a 3-second gap
         must not launch every node into orbit. */
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;

      ctx2.easePointer(now);

      hashNodes();
      connect();
      integrate(dt, elapsed);
      springs(dt);
      cursor(dt);
      if (ripples.length) applyRipples(dt);
      draw();
    }

    /* ------------------------------------------------------------ sizing */

    function resize() {
      W = ctx2.view.w;
      H = ctx2.view.h;
      dpr = ctx2.view.dpr;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
    }

    /* --------------------------------------------------------------- boot */

    resize();
    allocate();
    running = true;
    raf = requestAnimationFrame(frame);

    return {
      resize: function () {
        if (destroyed) return;
        var oldW = W, oldH = H;
        resize();
        buildGrid();
        /* Rescale positions instead of re-randomising, so a window drag does
           not visibly reshuffle the mesh. */
        if (oldW > 0 && oldH > 0) {
          var sx = W / oldW, sy = H / oldH;
          for (var i = 0; i < n; i++) { px[i] *= sx; py[i] *= sy; }
        }
        var want = Math.max(CFG.minNodes, Math.min(CFG.maxNodes, Math.round((W * H) / CFG.areaPerNode)));
        if (want > cap) { allocate(); return; }
        /* Growing within the existing capacity: seed only the new nodes. */
        for (var k = n; k < want; k++) {
          px[k] = Math.random() * W;
          py[k] = Math.random() * H;
          vx[k] = (Math.random() - 0.5) * 12;
          vy[k] = (Math.random() - 0.5) * 12;
          rad[k] = CFG.nodeRadius + Math.random() * CFG.nodeJitter;
          energy[k] = 0;
        }
        n = want;
      },

      theme: function (p) { pal = p; },

      pulse: function (x, y) {
        if (destroyed || ripples.length > 4) return;
        ripples.push({ x: x, y: y, age: 0 });
      },

      pause: function () { running = false; cancelAnimationFrame(raf); },

      resume: function () {
        if (destroyed || running) return;
        running = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      },

      destroy: function () {
        destroyed = true;
        running = false;
        cancelAnimationFrame(raf);
        px = py = vx = vy = rad = energy = null;
        linkA = linkB = linkD = cellItems = cellStart = cellFill = null;
        ripples = [];
      },
    };
  });
})();
