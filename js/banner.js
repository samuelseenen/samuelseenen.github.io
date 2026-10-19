// =========================================================
// banner.js: banner 300x250 animado con una línea de tiempo
// de GSAP, con botones de reproducir, pausar, repetir y una
// barra para recorrer la animación.
// =========================================================

(function () {
  const demo = document.querySelector('.demo');
  if (!demo || !window.gsap) return;

  const q = gsap.utils.selector(demo);
  const toggle = demo.querySelector('.b-toggle');
  const replay = demo.querySelector('.b-replay');
  const scrub = demo.querySelector('.scrub');
  const time = demo.querySelector('.time');

  const tl = gsap.timeline({ delay: 1.3, onUpdate: update, onComplete: update });

  tl.set(q('.f, .end > *'), { autoAlpha: 0 })
    // Frame 1
    .fromTo(q('.s1'), { scale: 0, rotate: -45 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.6)' })
    .fromTo(q('.f1'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .to(q('.f1'), { autoAlpha: 0, x: 24, duration: 0.4, ease: 'power2.in' }, '+=1.2')
    // Frame 2
    .fromTo(q('.s2'), { scale: 0 }, { scale: 1, rotate: 90, duration: 0.7, ease: 'power3.out' }, '<')
    .fromTo(q('.f2'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .to(q('.f2'), { autoAlpha: 0, y: -20, duration: 0.4, ease: 'power2.in' }, '+=1.2')
    // Frame final
    .fromTo(q('.s3'), { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, '<')
    .to(q('.s1'), { x: '-6cqw', y: '6cqw', duration: 0.8, ease: 'power3.inOut' }, '<')
    .fromTo(q('.end-logo'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' })
    .fromTo(q('.end-text'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .fromTo(q('.end-cta'), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.2')
    .to(q('.end-cta'), { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1, ease: 'power1.inOut' }, '+=0.4');

  // Sincroniza la barra, el tiempo y el icono del botón con la animación
  function update() {
    scrub.value = String(Math.round(tl.progress() * 1000));
    time.value = tl.time().toFixed(1) + 's';
    setState(tl.paused() || tl.progress() === 1 ? 'paused' : 'playing');
  }

  // Solo toca el DOM cuando el estado cambia, no en cada frame
  function setState(state, force) {
    if (!force && toggle.dataset.state === state) return;
    toggle.dataset.state = state;
    toggle.setAttribute('aria-label', site.t(state === 'paused' ? 'banner.play' : 'banner.pause'));
  }

  toggle.addEventListener('click', () => {
    if (tl.progress() === 1) tl.restart();
    else tl.paused(!tl.paused());
    update();
  });

  replay.addEventListener('click', () => {
    tl.restart();
    update();
  });

  scrub.addEventListener('input', () => {
    tl.pause();
    tl.progress(Number(scrub.value) / 1000);
    update();
  });

  // Al cambiar de idioma se actualiza la etiqueta del botón
  document.addEventListener('langchange', () => setState(toggle.dataset.state || 'playing', true));
  setState('playing', true);

  // Con movimiento reducido se muestra directamente el frame final
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tl.progress(1).pause();
    update();
  }
})();
