/* ============================================================================
   WBFX layer: "glyphs" — falling glyph rain, rendered with PixiJS 8
   ----------------------------------------------------------------------------
   The Matrix motif, handled so it survives being switched into a theme that is
   not about green terminals. Each theme sets `--fx-glyph-alpha`: the Matrix
   theme turns the rain up to a foreground element, everything else keeps it as
   a faint texture you notice only when you look for it.

   Rendering approach
     Glyph faces are baked once into a small texture atlas on an offscreen
     canvas, then drawn as tinted sprites. Nothing calls into text layout
     during the frame loop, and every sprite comes from a fixed pool that is
     allocated at start — a column "resetting" reuses the same sprite objects
     rather than creating new ones.

   The head of each column is drawn brighter and in the accent colour, with the
   trail falling off behind it, which is what makes the rain read as motion
   rather than as a static dotted grid.
   ========================================================================= */

(function () {
  "use strict";

  if (!window.WBFX) return;

  var PIXI_SRC = "assets/vendor/pixi.min.js";

  /* Half-width katakana, digits, and a few operators — the traditional mix. */
  var CHARS = (
    "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ" +
    "0123456789" +
    "<>=/\\+*:;|"
  ).split("");

  var CELL = 20;             // column pitch and glyph cell size, CSS px
  var GLYPH_PX = 16;
  var MAX_SPRITES = 1700;    // hard ceiling on pool size
  var TRAIL_MIN = 8;
  var TRAIL_MAX = 26;

  window.WBFX.register("glyphs", function (canvas, ctx2) {
    var PIXI = null;
    var app = null;
    var container = null;
    var textures = [];
    var sprites = [];          // flat pool
    var columns = [];
    var destroyed = false;
    var running = false;
    var pal = ctx2.palette;
    var W = 0, H = 0;
    var tintTrail = 0xffffff, tintHead = 0xffffff;
    var baseAlpha = 0.3;

    /* --------------------------------------------------------------- boot */

    ctx2.loadScript(PIXI_SRC).then(function () {
      if (destroyed) return;
      PIXI = window.PIXI;
      if (!PIXI || !PIXI.Application) { destroyed = true; return; }
      return boot();
    }).catch(function () { destroyed = true; });

    function boot() {
      W = ctx2.view.w;
      H = ctx2.view.h;

      app = new PIXI.Application();
      return app.init({
        canvas: canvas,
        width: W,
        height: H,
        resolution: ctx2.view.dpr,
        autoDensity: true,
        backgroundAlpha: 0,
        antialias: false,
        powerPreference: "low-power",
      }).then(function () {
        if (destroyed) { safeDestroy(); return; }
        buildAtlas();
        container = new PIXI.Container();
        app.stage.addChild(container);
        layout();
        applyPalette(pal);
        app.ticker.add(tick);
        running = true;
      }).catch(function () {
        destroyed = true;
        safeDestroy();
      });
    }

    /* -------------------------------------------------------- glyph atlas */

    /* One canvas per glyph. They are tiny (20×20 device pixels) and there are
       fewer than seventy of them, so the upload cost is negligible and each
       sprite can then be tinted independently. */
    function buildAtlas() {
      var dpr = Math.min(ctx2.view.dpr, 2);
      for (var i = 0; i < CHARS.length; i++) {
        var c = document.createElement("canvas");
        c.width = Math.round(CELL * dpr);
        c.height = Math.round(CELL * dpr);
        var g = c.getContext("2d");
        g.scale(dpr, dpr);
        g.font = "600 " + GLYPH_PX + "px ui-monospace, 'Geist Mono', Menlo, monospace";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillStyle = "#ffffff";      // white so `tint` controls the colour
        g.fillText(CHARS[i], CELL / 2, CELL / 2);
        textures.push(PIXI.Texture.from(c));
      }
    }

    /* ------------------------------------------------------------- layout */

    function layout() {
      var colCount = Math.max(1, Math.ceil(W / CELL));
      var perCol = Math.min(TRAIL_MAX, Math.max(TRAIL_MIN, Math.floor(H / CELL)));
      var wanted = Math.min(MAX_SPRITES, colCount * perCol);
      var slotsPerCol = Math.max(TRAIL_MIN, Math.floor(wanted / colCount));

      /* Grow the pool to the size this viewport needs, then hide any surplus
         rather than destroying it — a later resize may want them back. */
      var need = colCount * slotsPerCol;
      while (sprites.length < need && sprites.length < MAX_SPRITES) {
        var s = new PIXI.Sprite(textures[0]);
        s.anchor.set(0.5);
        s.visible = false;
        container.addChild(s);
        sprites.push(s);
      }
      for (var k = need; k < sprites.length; k++) sprites[k].visible = false;

      columns = [];
      for (var c = 0; c < colCount; c++) {
        var slot = c * slotsPerCol;
        if (slot + slotsPerCol > sprites.length) break;
        columns.push(newColumn(c, slot, slotsPerCol));
      }
    }

    function newColumn(index, slot, len) {
      return {
        x: index * CELL + CELL / 2,
        /* Start above the fold at a random offset so the field does not begin
           as one synchronised wave. */
        head: -Math.random() * H,
        speed: 42 + Math.random() * 118,     // px/s
        len: len,
        slot: slot,
        swapAt: 0,
      };
    }

    function resetColumn(col) {
      col.head = -Math.random() * H * 0.5;
      col.speed = 42 + Math.random() * 118;
    }

    /* ------------------------------------------------------------ palette */

    function applyPalette(p) {
      pal = p;
      baseAlpha = p.glyphAlpha;
      tintTrail = ctx2.packRgb(p.node);
      tintHead = ctx2.packRgb(p.c4);
      if (!container) return;
      /* `screen`/`add` would wash out on a light background, so the light
         theme composites normally and the layer's blend mode in CSS flips to
         multiply alongside it. */
      container.blendMode = p.additive ? "add" : "normal";
    }

    /* --------------------------------------------------------------- tick */

    function tick(ticker) {
      if (!running || destroyed || !app) return;
      var dt = Math.min(ticker.deltaMS, 50) / 1000;

      for (var c = 0; c < columns.length; c++) {
        var col = columns[c];
        col.head += col.speed * dt;

        /* Once the whole trail has cleared the bottom, recycle the column. */
        if (col.head - col.len * CELL > H) { resetColumn(col); }

        col.swapAt -= dt;
        var swap = false;
        if (col.swapAt <= 0) { col.swapAt = 0.06 + Math.random() * 0.12; swap = true; }

        for (var i = 0; i < col.len; i++) {
          var s = sprites[col.slot + i];
          if (!s) continue;
          var y = col.head - i * CELL;

          if (y < -CELL || y > H + CELL) { s.visible = false; continue; }

          s.visible = true;
          s.x = col.x;
          s.y = y;

          /* Reassign a glyph occasionally so the characters churn. Doing every
             sprite every frame would cost more than it is worth visually. */
          if (swap && Math.random() < 0.22) {
            s.texture = textures[(Math.random() * textures.length) | 0];
          }

          var fall = 1 - i / col.len;
          if (i === 0) {
            s.tint = tintHead;
            s.alpha = Math.min(1, baseAlpha * 2.6);
          } else {
            s.tint = tintTrail;
            s.alpha = baseAlpha * fall * fall;
          }
        }
      }
    }

    /* ------------------------------------------------------------ cleanup */

    function safeDestroy() {
      try {
        if (app) {
          app.ticker && app.ticker.remove(tick);
          app.destroy(false, { children: true, texture: true });
        }
      } catch (e) { /* renderer may already be gone */ }
      app = null;
      container = null;
      sprites = [];
      columns = [];
      textures = [];
    }

    /* ------------------------------------------------------------- public */

    return {
      resize: function () {
        if (destroyed || !app) return;
        W = ctx2.view.w;
        H = ctx2.view.h;
        app.renderer.resolution = ctx2.view.dpr;
        app.renderer.resize(W, H);
        layout();
        applyPalette(pal);
      },

      theme: function (p) {
        if (destroyed) { pal = p; return; }
        applyPalette(p);
      },

      pause: function () {
        running = false;
        if (app && app.ticker) app.ticker.stop();
      },

      resume: function () {
        if (destroyed || !app) return;
        running = true;
        app.ticker.start();
      },

      destroy: function () {
        destroyed = true;
        running = false;
        safeDestroy();
      },
    };
  });
})();
