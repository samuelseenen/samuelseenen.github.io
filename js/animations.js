// =========================================================
// animations.js: animaciones de toda la página con GSAP y
// ScrollTrigger.
//
// Todo lo que se mueve está dentro de gsap.matchMedia(), así
// que si el usuario tiene activado "reducir movimiento" en su
// sistema, no se ejecuta y la página se ve completa y estática.
// =========================================================

(function () {
  const root = document.documentElement;
  const nav = document.querySelector('.nav');

  /* ---------- Bloques .reveal: aparecen al entrar en pantalla ----------
     (la transición está en styles.css; no necesita GSAP) */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Si GSAP no ha cargado (por ejemplo, sin conexión), se muestra todo sin animar
  if (!window.gsap || !window.ScrollTrigger) {
    document.querySelectorAll('.split').forEach((el) => el.classList.add('done'));
    root.classList.remove('js');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Solo con movimiento permitido ---------- */
  const mm = gsap.matchMedia();

  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      fine: '(hover: hover) and (pointer: fine)',
      desktop: '(min-width: 900px)',
    },
    (context) => {
      const { motion, fine, desktop } = context.conditions;
      if (!motion) return;

      // Entrada de la portada: el nombre sube letra a letra y luego el resto
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo('.hero-title .c', { y: 0, yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.025 }, 0.1)
        .fromTo('[data-hero]', { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1, clearProps: 'transform' }, 0.25);

      if (desktop) {
        // Scroll inmersivo de la portada: queda fijada mientras la rejilla
        // se convierte en un túnel y el contenido pasa a través de la cámara.
        // Sin pinSpacing, la sección de experiencia sube por encima del túnel.
        gsap
          .timeline({
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', pin: true, pinSpacing: false, scrub: 0.6 },
          })
          .to(window.heroTunnel, { zoom: 7, ease: 'power2.in', duration: 1 }, 0)
          .to('.hero-copy', { scale: 1.35, autoAlpha: 0, filter: 'blur(6px)', transformOrigin: '30% 50%', ease: 'power2.in', duration: 0.6 }, 0)
          .to('.demo', { scale: 1.7, autoAlpha: 0, filter: 'blur(6px)', ease: 'power2.in', duration: 0.6 }, 0.08);

        // La experiencia llega desde el fondo mientras cubre el túnel
        gsap.fromTo(
          '.exp-grid',
          { scale: 0.86, autoAlpha: 0.2, transformOrigin: '50% 0%' },
          { scale: 1, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: '#experiencia', start: 'top bottom', end: 'top 20%', scrub: 0.6 } },
        );
      }

      // Títulos de sección: palabras (o letras) que suben al entrar en pantalla
      gsap.utils.toArray('[data-split]').forEach((el) => {
        if (el.closest('.hero')) return;
        if (desktop && el.closest('.contact')) return;
        gsap.fromTo(
          el.querySelectorAll('.c'),
          { y: 0, yPercent: 115 },
          {
            yPercent: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: el.dataset.split === 'chars' ? 0.035 : 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%' },
            onComplete: () => el.classList.add('done'),
          },
        );
      });

      // La línea de tiempo de la experiencia se dibuja con el scroll
      gsap.fromTo(
        '.rail-fill',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 60%', end: 'bottom 60%', scrub: 0.5 } },
      );

      // Tarjetas de "Lo que he construido"
      gsap.fromTo(
        '.bento .cell',
        { y: 48, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.12,
          clearProps: 'transform',
          scrollTrigger: { trigger: '.bento', start: 'top 80%' },
        },
      );

      // Los formatos de banner se dibujan uno a uno
      gsap.fromTo(
        '.fmt',
        { scale: 0, transformOrigin: '0% 100%' },
        { scale: 1, duration: 0.8, ease: 'back.out(1.4)', stagger: 0.1, scrollTrigger: { trigger: '.formats', start: 'top 85%' } },
      );

      // El código de WordPress se "teclea" línea a línea
      gsap.fromTo(
        '.snippet .ln',
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.45,
          ease: 'steps(16)',
          stagger: 0.3,
          scrollTrigger: { trigger: '.snippet', start: 'top 85%' },
        },
      );

      // Flujo del sistema QR: la petición recorre UI → PHP → MySQL en bucle
      const steps = gsap.utils.toArray('.flow li');
      const flow = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true });
      steps.forEach((step, i) => {
        flow.call(() => steps.forEach((s) => s.classList.toggle('on', s === step)), [], i * 0.7);
      });
      flow.call(() => steps.forEach((s) => s.classList.remove('on')), [], steps.length * 0.7);
      ScrollTrigger.create({
        trigger: '.flow',
        start: 'top 95%',
        end: 'bottom 5%',
        onToggle: (self) => (self.isActive ? flow.play() : flow.pause()),
      });

      // Stack: las líneas se dibujan y las tecnologías aparecen en cascada
      const stackTrigger = { trigger: '.groups', start: 'top 85%' };
      gsap.fromTo('.group', { '--line': 0 }, { '--line': 1, duration: 1.2, ease: 'expo.out', stagger: 0.12, scrollTrigger: stackTrigger });
      gsap.fromTo(
        '.group li',
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', stagger: 0.04, delay: 0.15, scrollTrigger: stackTrigger },
      );

      if (desktop) {
        // Llegada a contacto: la sección queda fijada, el título llega desde
        // muy grande hasta su sitio y después aparece el resto
        const contact = document.querySelector('.contact');
        const extras = contact.querySelectorAll('.reveal');
        extras.forEach((el) => {
          io.unobserve(el);
          el.classList.remove('reveal');
        });

        gsap
          .timeline({
            scrollTrigger: { trigger: contact, start: 'top top', end: '+=90%', pin: true, scrub: 0.6 },
          })
          .fromTo('.big', { scale: 2.6, transformOrigin: '0% 50%' }, { scale: 1, ease: 'power3.out', duration: 1 }, 0)
          .fromTo('.big .c', { y: 0, yPercent: 115 }, { yPercent: 0, ease: 'power3.out', stagger: 0.05, duration: 0.5 }, 0)
          .fromTo(extras, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'power2.out', stagger: 0.15, duration: 0.4 }, 0.7);
      }

      // La navegación se esconde al bajar y vuelve al subir
      ScrollTrigger.create({
        start: 'top -160',
        end: 'max',
        onUpdate: (self) => root.classList.toggle('nav-hidden', self.direction === 1),
        onLeaveBack: () => root.classList.remove('nav-hidden'),
      });

      if (!fine) return () => root.classList.remove('nav-hidden');

      // Brillo de las tarjetas siguiendo al cursor
      const spots = gsap.utils.toArray('.spot');
      const onSpotMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      spots.forEach((el) => el.addEventListener('pointermove', onSpotMove));

      // Botones magnéticos: se desplazan un poco hacia el cursor
      const magnets = gsap.utils.toArray('.magnetic').map((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        const move = (e) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return { el, move, leave };
      });

      // Limpieza si cambian las preferencias del sistema
      return () => {
        root.classList.remove('nav-hidden');
        spots.forEach((el) => el.removeEventListener('pointermove', onSpotMove));
        magnets.forEach(({ el, move, leave }) => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        });
      };
    },
  );

  /* ---------- Siempre activo (no es movimiento, es estado) ----------
     Se crean después de las secciones fijadas (pin) para que ScrollTrigger
     calcule sus posiciones con el espacio que añaden. */

  // Barra de progreso de lectura bajo la navegación
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => nav.style.setProperty('--progress', self.progress.toFixed(4)),
  });

  // Enlace de la navegación activo según la sección visible
  document.querySelectorAll('[data-section]').forEach((link) => {
    const section = document.getElementById(link.dataset.section);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => link.classList.toggle('active', self.isActive),
    });
  });

  // Las fuentes cambian la altura del texto: se recalculan posiciones al cargarlas
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());

  // Puntos de la línea de tiempo: se encienden al llegar a cada trabajo
  document.querySelectorAll('.job').forEach((job) => {
    ScrollTrigger.create({
      trigger: job,
      start: 'top 60%',
      onEnter: () => job.classList.add('active'),
      onLeaveBack: () => job.classList.remove('active'),
    });
  });
})();
