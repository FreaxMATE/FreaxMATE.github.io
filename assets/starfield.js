/* Ambient constellation for the homepage hero.
   Dots drift slowly and draw faint lines to nearby neighbours, a nod to the
   lattice diagrams in "Waves in Crystals". Colour comes from the --fm-dot
   CSS token, so it follows the active theme. Respects prefers-reduced-motion
   by rendering a single static frame. Ported from the GutCheck StarField. */
(function () {
  function initStarField(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var density = Number(canvas.dataset.density || 160);
    var maxLink = Number(canvas.dataset.maxLink || 150);
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dots = [], dpr = Math.min(window.devicePixelRatio || 1, 2), w = 0, h = 0, rafId = 0;
    var rgb = '184,83,47', colorDirty = true;

    function refreshColor() {
      var v = getComputedStyle(document.documentElement).getPropertyValue('--fm-dot').trim();
      if (v) rgb = v.replace(/\s+/g, '');
      colorDirty = false;
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var target = Math.max(18, Math.round((density * w * h) / (1920 * 1080)));
      if (dots.length !== target) {
        dots = [];
        for (var i = 0; i < target; i++) {
          dots.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
            r: Math.random() * 1.6 + 1.0
          });
        }
      }
    }

    function step() {
      if (colorDirty) refreshColor();
      ctx.clearRect(0, 0, w, h);
      var isDark = document.body.classList.contains('quarto-dark');
      ctx.fillStyle = 'rgba(' + rgb + ',' + (isDark ? 0.85 : 0.72) + ')';
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.lineWidth = 1;
      for (var a = 0; a < dots.length; a++) {
        for (var b = a + 1; b < dots.length; b++) {
          var dx = dots[a].x - dots[b].x, dy = dots[a].y - dots[b].y, d2 = dx * dx + dy * dy;
          if (d2 > maxLink * maxLink) continue;
          var alpha = (1 - Math.sqrt(d2) / maxLink) * 0.65;
          ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(dots[a].x, dots[a].y); ctx.lineTo(dots[b].x, dots[b].y); ctx.stroke();
        }
      }
      if (!reduceMotion) rafId = requestAnimationFrame(step);
    }

    resize();
    step();

    new ResizeObserver(function () { resize(); if (reduceMotion) step(); }).observe(canvas);

    // Quarto swaps the stylesheet and toggles quarto-light / quarto-dark on <body>.
    new MutationObserver(function () { colorDirty = true; if (reduceMotion) step(); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(rafId);
      else if (!reduceMotion) step();
    });
  }

  function boot() {
    document.querySelectorAll('canvas[data-starfield]').forEach(initStarField);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
