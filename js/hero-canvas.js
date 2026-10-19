// =========================================================
// hero-canvas.js: rejilla de puntos de la portada que se
// ilumina alrededor del cursor. En pantallas táctiles el foco
// de luz se mueve solo.
// =========================================================

(function () {
  const canvas = document.querySelector('.hero-canvas');
  const hero = canvas && canvas.parentElement;
  const ctx = canvas && canvas.getContext('2d');
  if (!canvas || !hero || !ctx) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const GAP = 26; // separación entre puntos
  const RADIUS = 170; // radio del foco de luz
  // En táctil el foco se mueve solo y pasa por detrás del texto: más suave
  const spotStrength = finePointer ? 1 : 0.45;

  let w = 0;
  let h = 0;
  let dotColor = '';
  let accent = '';
  let pointer = { x: -9999, y: -9999, active: false };
  let visible = true;
  let raf = 0;

  // Profundidad del túnel. animations.js la sube de 1 a TUNNEL_MAX con el scroll.
  const TUNNEL_MAX = 7;
  const tunnel = (window.heroTunnel = { zoom: 1 });

  // La rejilla base se pinta una sola vez en un canvas aparte;
  // en cada frame solo se redibujan los puntos cercanos al foco.
  const base = document.createElement('canvas');
  const bctx = base.getContext('2d');

  function readColors() {
    const css = getComputedStyle(document.documentElement);
    dotColor = css.getPropertyValue('--border-strong').trim();
    accent = css.getPropertyValue('--accent').trim();
  }

  function paintBase() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    base.width = w * dpr;
    base.height = h * dpr;
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bctx.clearRect(0, 0, w, h);
    bctx.globalAlpha = 0.55;
    bctx.fillStyle = dotColor;
    bctx.beginPath();
    for (let x = GAP / 2; x < w; x += GAP) {
      for (let y = GAP / 2; y < h; y += GAP) {
        bctx.moveTo(x + 1, y);
        bctx.arc(x, y, 1, 0, Math.PI * 2);
      }
    }
    bctx.fill();
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintBase();
    draw(performance.now());
  }

  // Túnel: la rejilla se amplía desde el centro, así que los puntos
  // salen hacia los bordes como si la cámara avanzara entre ellos.
  // Pasa del gris al color de acento y se desvanece al final.
  function drawTunnel(z) {
    const p = Math.min(1, (z - 1) / (TUNNEL_MAX - 1));
    const cx = w / 2;
    const cy = h * 0.45;
    const r = Math.min(1 + (z - 1) * 0.7, 5);

    // Solo los puntos de la rejilla que, ampliados, siguen dentro de la pantalla
    const xMin = cx - cx / z;
    const xMax = cx + (w - cx) / z;
    const yMin = cy - cy / z;
    const yMax = cy + (h - cy) / z;
    const startX = Math.floor((xMin - GAP / 2) / GAP) * GAP + GAP / 2;
    const startY = Math.floor((yMin - GAP / 2) / GAP) * GAP + GAP / 2;

    const layers = [
      { color: dotColor, alpha: 0.55 * (1 - p) },
      { color: accent, alpha: Math.min(1, p * 3) * (1 - p) },
    ];

    layers.forEach(({ color, alpha }) => {
      if (alpha <= 0.01) return;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let x = startX; x <= xMax; x += GAP) {
        for (let y = startY; y <= yMax; y += GAP) {
          const px = cx + (x - cx) * z;
          const py = cy + (y - cy) * z;
          ctx.moveTo(px + r, py);
          ctx.arc(px, py, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function draw(time) {
    // Con la portada a 0×0 (pestaña oculta, iframe…) drawImage lanzaría un error
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    if (tunnel.zoom > 1.001) {
      drawTunnel(tunnel.zoom);
      return;
    }

    ctx.drawImage(base, 0, 0, w, h);
    if (reduce) return;

    let fx = pointer.x;
    let fy = pointer.y;
    if (!pointer.active) {
      // Foco automático cuando no hay ratón encima
      fx = w * (0.62 + 0.25 * Math.sin(time / 2600));
      fy = h * (0.45 + 0.3 * Math.cos(time / 3400));
    }

    // Solo recorre los puntos que caen dentro del foco
    const x0 = Math.max(GAP / 2, Math.ceil((fx - RADIUS - GAP / 2) / GAP) * GAP + GAP / 2);
    const y0 = Math.max(GAP / 2, Math.ceil((fy - RADIUS - GAP / 2) / GAP) * GAP + GAP / 2);
    ctx.fillStyle = accent;
    for (let x = x0; x < Math.min(w, fx + RADIUS); x += GAP) {
      for (let y = y0; y < Math.min(h, fy + RADIUS); y += GAP) {
        const k = 1 - Math.hypot(x - fx, y - fy) / RADIUS;
        if (k <= 0.05) continue;
        ctx.globalAlpha = (0.55 + k * 0.45) * spotStrength;
        ctx.beginPath();
        ctx.arc(x, y, 1.4 + k * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop(time) {
    draw(time);
    if (visible && !reduce) raf = requestAnimationFrame(loop);
  }

  readColors();
  resize();
  new ResizeObserver(resize).observe(hero);

  // Vuelve a leer los colores cuando cambia el tema
  new MutationObserver(() => {
    readColors();
    paintBase();
    draw(performance.now());
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  if (reduce) return;

  if (finePointer) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
    });
    hero.addEventListener('pointerleave', () => {
      pointer.active = false;
    });
  }

  // Solo anima mientras la portada está en pantalla
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(loop);
  }).observe(hero);
})();
