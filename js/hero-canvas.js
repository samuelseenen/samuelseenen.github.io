// =========================================================
// hero-canvas.js: fondo de la portada. Recrea la primera
// página que escribí en el Bloc de notas en el instituto: el
// código se teclea solo al cargar y se queda el cursor
// parpadeando, en la columna derecha de la portada. En el
// túnel (animations.js) la cámara entra en la línea de
// "Hola mundo" hasta llegar a la experiencia.
// =========================================================

(function () {
  const canvas = document.querySelector('.hero-canvas');
  const hero = canvas && canvas.parentElement;
  const ctx = canvas && canvas.getContext('2d');
  if (!canvas || !hero || !ctx) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sin tildes a propósito: así se escribía en el Bloc de notas
  const CODE = [
    '<html>',
    '<head>',
    '<title>Hola</title>',
    '</head>',
    '<body bgcolor="black">',
    '<h1>Hola mundo</h1>',
    '<p>Mi primera web</p>',
    '<font color="blue">',
    'Samuel</font>',
    '<marquee>Hola!</marquee>',
    '</body>',
    '</html>',
  ];
  const FOCUS_LINE = 5; // la línea de <h1>, hacia la que va el túnel
  const TOTAL = CODE.reduce((n, line) => n + line.length + 1, 0);
  const CHAR_MS = 28; // velocidad de tecleo
  const START_MS = 900; // espera a que entre el nombre
  const BLINK_MS = 530;

  let w = 0;
  let h = 0;
  let size = 16;
  let x0 = 0;
  let y0 = 0;
  let textColor = '';
  let accent = '';
  let show = true; // solo con texto y banner en dos columnas
  let visible = true;
  let raf = 0;
  let startTime = 0;
  let lastKey = '';

  // Profundidad del túnel. animations.js la sube de 1 a 7 con el scroll.
  const TUNNEL_MAX = 7;
  const tunnel = (window.heroTunnel = { zoom: 1 });

  function readColors() {
    const css = getComputedStyle(document.documentElement);
    textColor = css.getPropertyValue('--muted').trim();
    accent = css.getPropertyValue('--accent').trim();
  }

  // El código se dibuja dentro del hueco .notepad-slot de la portada. El
  // hueco tiene la proporción del bloque de texto, así que el tamaño de
  // letra es su ancho dividido entre el ancho de la línea más larga.
  const LONGEST = Math.max(...CODE.map((line) => line.length));
  const CHAR_RATIO = 0.6; // ancho de un carácter de IBM Plex Mono respecto a su tamaño
  const slot = hero.querySelector('.notepad-slot');

  // Posición del hueco dentro de la portada sin contar transformaciones
  // (la entrada de la portada lo desplaza unos píxeles al cargar)
  function layout() {
    let x = 0;
    let y = 0;
    for (let el = slot; el && el !== hero; el = el.offsetParent) {
      x += el.offsetLeft;
      y += el.offsetTop;
    }
    show = slot.offsetWidth > 0;
    size = slot.offsetWidth / (LONGEST * CHAR_RATIO);
    x0 = x;
    y0 = y + size * 0.875;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout();
    lastKey = '';
    draw(performance.now());
  }

  // Cuántos caracteres se han tecleado hasta ahora
  function typedChars(time) {
    if (reduce || !startTime) return TOTAL;
    return Math.max(0, Math.min(TOTAL, Math.floor((time - startTime - START_MS) / CHAR_MS)));
  }

  function draw(time) {
    if (!w || !h) return;

    const z = tunnel.zoom;
    const typed = z > 1.001 ? TOTAL : typedChars(time);
    const caretOn = reduce || typed < TOTAL || Math.floor(time / BLINK_MS) % 2 === 0;
    // Solo se vuelve a pintar si algo ha cambiado
    const key = `${typed}|${caretOn}|${z.toFixed(4)}|${w}|${h}|${textColor}`;
    if (key === lastKey) return;
    lastKey = key;

    ctx.clearRect(0, 0, w, h);
    if (!show) return;
    const lh = size * 1.75;
    const p = Math.min(1, (z - 1) / (TUNNEL_MAX - 1));

    ctx.save();
    ctx.font = `400 ${size}px 'IBM Plex Mono', ui-monospace, monospace`;
    ctx.textBaseline = 'middle';
    if (z > 1.001) {
      // Túnel: todo se amplía desde la línea de "Hola mundo"
      const fx = x0 + ctx.measureText(CODE[FOCUS_LINE]).width * 0.5;
      const fy = y0 + FOCUS_LINE * lh;
      ctx.translate(fx, fy);
      ctx.scale(z, z);
      ctx.translate(-fx, -fy);
    }

    // Se hace más visible al empezar el túnel y desaparece antes de que
    // llegue la experiencia, para no cruzarse con su texto
    const fade = Math.max(0, 1 - p / 0.35) ** 2;
    const base = (document.documentElement.dataset.theme === 'light' ? 0.85 : 0.8) * fade;

    let left = typed;
    let caretX = x0;
    let caretY = y0;
    for (let i = 0; i < CODE.length && left > 0; i++) {
      const text = CODE[i].slice(0, left);
      left -= CODE[i].length + 1;
      const y = y0 + i * lh;
      ctx.globalAlpha = base;
      ctx.fillStyle = i === FOCUS_LINE && z > 1.001 ? accent : textColor;
      ctx.fillText(text, x0, y);
      caretX = x0 + ctx.measureText(text).width;
      caretY = y;
    }

    // Cursor del Bloc de notas
    if (caretOn && z <= 1.001) {
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = accent;
      ctx.fillRect(caretX + 2, caretY - size * 0.6, Math.max(1.5, size * 0.09), size * 1.2);
    }
    ctx.restore();
  }

  function loop(time) {
    draw(time);
    if (visible) raf = requestAnimationFrame(loop);
  }

  readColors();
  resize();
  new ResizeObserver(resize).observe(hero);

  // Las medidas del texto dependen de la fuente: se recalculan al cargarla
  if (document.fonts) document.fonts.ready.then(resize);

  // Vuelve a leer los colores cuando cambia el tema
  new MutationObserver(() => {
    readColors();
    lastKey = '';
    draw(performance.now());
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  if (reduce) return;

  startTime = performance.now();

  // Solo anima mientras la portada está en pantalla
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(loop);
  }).observe(hero);
})();
