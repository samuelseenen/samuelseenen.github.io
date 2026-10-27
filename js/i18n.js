// =========================================================
// Textos del portfolio en español e inglés.
//
// En index.html, cada elemento traducible tiene un atributo
// data-i18n="clave". Al cambiar de idioma, main.js busca esa
// clave aquí y sustituye el texto.
// =========================================================

window.TRANSLATIONS = {
  es: {
    'meta.title': 'Samuel Senén López | Desarrollador Full-Stack',
    'meta.description':
      'Portfolio de Samuel Senén López, desarrollador full-stack junior en Guadalajara, España. HTML5, CSS, JavaScript, GSAP, PHP y MySQL.',

    // Navegación
    'nav.experience': 'Experiencia',
    'nav.work': 'Trabajo',
    'nav.stack': 'Stack',
    'nav.contact': 'Contacto',
    'nav.label': 'Principal',
    'nav.menu': 'Menú',
    'nav.close': 'Cerrar',
    'nav.switchLang': 'Switch to English',
    'nav.themeToDark': 'Activar modo oscuro',
    'nav.themeToLight': 'Activar modo claro',
    'nav.skip': 'Saltar al contenido',

    // Portada
    'hero.lead':
      'Desarrollador full-stack junior que no deja de aprender. Empecé con PHP y MySQL, hoy hago creatividades HTML5 en WPP Production y ahora me estoy formando en Node.js y Angular.',
    'hero.ctaPrimary': 'Contactar',
    'hero.notepad': 'Así empezó todo: HTML en el Bloc de notas del instituto.',
    'hero.ctaSecondary': 'Descargar CV',

    // Banner animado
    'banner.label': 'Hola, soy Samuel. Esto es un banner de 300×250.',
    'banner.f1': 'Hola, soy Samuel.',
    'banner.f2': 'Esto es un banner de 300×250.',
    'banner.f3': 'Hecho con HTML, CSS y GSAP, como los que hago cada día.',
    'banner.cta': 'Escríbeme',
    'banner.caption': 'Un banner de verdad, funcionando aquí mismo. Puedes pausarlo o arrastrar la barra para verlo frame a frame.',
    'banner.play': 'Reproducir',
    'banner.pause': 'Pausar',
    'banner.replay': 'Repetir',
    'banner.scrub': 'Línea de tiempo del banner',

    // Experiencia
    'exp.title': 'Experiencia',
    'exp.intro': 'Algo más de dos años de trabajo, la mayor parte en publicidad digital.',
    'exp.now': 'Actualidad',
    'exp.rowStudy': 'Estudios',
    'exp.rowWork': 'Trabajo',
    'exp.segStudy': 'Ciclo DAW',
    'exp.today': 'hoy',
    'exp.tags': 'Tecnologías',
    'exp1.dates': 'Feb 2026 -',
    'exp1.role': 'Front-End Developer',
    'exp1.p1': 'Hago creatividades HTML5 interactivas con JavaScript, CSS y GSAP para campañas internacionales.',
    'exp1.p2': 'Cada plataforma tiene su límite de peso y sus normas, y la animación tiene que caber en ellas sin perder fluidez.',
    'exp1.p3': 'Me aseguro de que se vean igual en todos los navegadores, dispositivos y formatos.',
    'exp2.dates': 'Ene 2025 - Feb 2026',
    'exp2.role': 'Front-End Developer',
    'exp2.p1': 'Desarrollé y mantuve banners publicitarios con HTML5, CSS y JavaScript.',
    'exp2.p2': 'Maqueté emails responsive que se vieran bien en Gmail, Outlook y móvil.',
    'exp2.p3': 'Revisaba con el resto del equipo que cada creatividad estuviera bien antes de entregarla.',
    'exp3.dates': 'Oct 2023 - Ene 2024',
    'exp3.role': 'Becario de desarrollo web',
    'exp3.p1': 'Hice aplicaciones web y plantillas de WordPress a medida con PHP, JavaScript, Bootstrap y MySQL.',
    'exp3.p2': 'Desarrollé un sistema de acceso por códigos QR para instalaciones municipales, desde la interfaz hasta la base de datos.',

    // Lo que he construido
    'work.title': 'Lo que he construido',
    'project.meta': 'Proyecto de fin de ciclo · 2024',
    'project.body':
      'Aplicación web para pedir cita en una barbería. El cliente elige día, peluquero y hora, recibe por email un código QR cifrado y en la barbería se escanea para comprobar la cita. La hice entera: frontend, API y base de datos.',
    'project.code': 'Ver el código',
    'project.shots': 'Capturas',
    'project.shot.inicio': 'Inicio',
    'project.shot.reservar': 'Reservar cita',
    'project.shot.servicios': 'Servicios',
    'project.shot.login': 'Inicio de sesión',
    'project.alt.inicio': 'Página de inicio de Urbano97',
    'project.alt.reservar': 'Calendario para elegir el día de la cita en Urbano97',
    'project.alt.servicios': 'Lista de servicios y precios de Urbano97',
    'project.alt.login': 'Pantalla de inicio de sesión de Urbano97',
    'work.formats': 'Formatos habituales: 160×600, 970×250, 728×90, 300×250, 320×50',
    'work.banners.title': 'Creatividades HTML5 interactivas',
    'work.banners.body':
      'Banners animados con GSAP para campañas internacionales. Cada formato tiene sus medidas y su límite de peso, y la animación tiene que encajar en los dos.',
    'work.emails.title': 'Emails responsive',
    'work.emails.mobile': 'Móvil',
    'work.emails.body': 'Plantillas que se ven bien en Gmail, Outlook y móvil, con el HTML que cada cliente de correo acepta.',
    'work.qr.title': 'Acceso por códigos QR',
    'work.qr.body': 'Sistema de acceso para instalaciones municipales: frontend, lógica de servidor en PHP y base de datos MySQL.',
    'work.wp.title': 'Templates WordPress a medida',
    'work.wp.body': 'Temas y aplicaciones web personalizadas para distintos clientes con PHP, JavaScript, Bootstrap y MySQL.',

    // Stack
    'stack.title': 'Stack',
    'stack.frontend': 'Frontend',
    'stack.backend': 'Backend y datos',
    'stack.tools': 'Herramientas',
    'stack.banners': 'Banners HTML5',
    'stack.emails': 'Emails responsive',

    // Formación e idiomas
    'origin.title': 'Cómo empecé',
    'origin.p1':
      'En el instituto empezamos a ver HTML escribiendo en el Bloc de notas: un título, un párrafo, algún color de fondo, guardar como .html y abrirlo en el navegador. Era lo más básico que existe, pero me enganchó ver cómo unas pocas líneas de texto se convertían en una página que cualquiera podía abrir.',
    'origin.p2':
      'De ahí pasé al ciclo de Desarrollo de Aplicaciones Web y desde entonces no he parado: primero PHP, MySQL y WordPress; después banners y emails en agencia; y ahora sigo con Node.js y Angular, que ya usé en mi proyecto de fin de ciclo. Lo que me gustó aquel primer día sigue igual: escribir algo y ver cómo funciona.',
    'origin.p3': 'Fuera de la pantalla: música a todas horas y gimnasio.',
    'howiwork.title': 'Cómo trabajo',
    'howiwork.p1':
      'Con cualquier cosa nueva, lo primero que hago es intentar que funcione, aunque sea de cualquier manera. Cuando ya funciona, la ordeno y la pulo. Paso más tiempo probando en el navegador que planeando en papel.',
    'howiwork.p2':
      'En el trabajo me pasa lo mismo: antes de dar un banner por terminado lo abro en todos los navegadores y móviles que tengo a mano. Hasta que no lo veo funcionar en todos, no me quedo tranquilo.',
    'edu.title': 'Formación',
    'edu.dam': 'CFGS Desarrollo de Aplicaciones Web',
    'edu.bach': 'Bachillerato de Ciencias',
    'edu.languages': 'Idiomas',
    'edu.spanish': 'Español',
    'edu.native': 'Nativo',
    'edu.english': 'Inglés',

    // Contacto
    'contact.title': 'Si has llegado hasta aquí, escríbeme.',
    'contact.body': 'Una oferta, un proyecto o cualquier cosa que quieras comentarme: te leo.',
    'contact.copy': 'Copiar email',
    'contact.copied': 'Copiado',
    'contact.location': 'Guadalajara, España',
    'contact.statusLabel': 'Estado',
    'contact.status': 'Abierto a nuevas oportunidades',
    'contact.locationLabel': 'Ubicación',
    'contact.linkedin': 'Ver perfil',
    'contact.cv': 'Descargar PDF',
    'footer.rights': 'Hecho con HTML, CSS y JavaScript.',
    'footer.top': 'Volver arriba',
  },

  en: {
    'meta.title': 'Samuel Senén López | Full-Stack Developer',
    'meta.description':
      'Portfolio of Samuel Senén López, junior full-stack developer based in Guadalajara, Spain. HTML5, CSS, JavaScript, GSAP, PHP and MySQL.',

    'nav.experience': 'Experience',
    'nav.work': 'Work',
    'nav.stack': 'Stack',
    'nav.contact': 'Contact',
    'nav.label': 'Main',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.switchLang': 'Cambiar a español',
    'nav.themeToDark': 'Switch to dark mode',
    'nav.themeToLight': 'Switch to light mode',
    'nav.skip': 'Skip to content',

    'hero.lead':
      "Junior full-stack developer who never stops learning. I started out with PHP and MySQL, today I build HTML5 creatives at WPP Production, and I'm now learning Node.js and Angular.",
    'hero.ctaPrimary': 'Get in touch',
    'hero.notepad': 'Where it all started: HTML in Notepad, back in high school.',
    'hero.ctaSecondary': 'Download CV',

    'banner.label': "Hi, I'm Samuel. This is a 300×250 banner.",
    'banner.f1': "Hi, I'm Samuel.",
    'banner.f2': 'This is a 300×250 banner.',
    'banner.f3': 'Built with HTML, CSS and GSAP, like the ones I make every day.',
    'banner.cta': 'Say hello',
    'banner.caption': 'A real banner, running right here. Pause it or drag the bar to go through it frame by frame.',
    'banner.play': 'Play',
    'banner.pause': 'Pause',
    'banner.replay': 'Replay',
    'banner.scrub': 'Banner timeline',

    'exp.title': 'Experience',
    'exp.intro': 'A little over two years of work, most of it in digital advertising.',
    'exp.now': 'Present',
    'exp.rowStudy': 'Studies',
    'exp.rowWork': 'Work',
    'exp.segStudy': 'Web dev diploma',
    'exp.today': 'today',
    'exp.tags': 'Technologies',
    'exp1.dates': 'Feb 2026 -',
    'exp1.role': 'Front-End Developer',
    'exp1.p1': 'I build interactive HTML5 creatives with JavaScript, CSS and GSAP for international campaigns.',
    'exp1.p2': 'Every platform has its own weight limit and rules, and the animation has to fit inside them and still run smoothly.',
    'exp1.p3': 'I make sure they look the same on every browser, device and format.',
    'exp2.dates': 'Jan 2025 - Feb 2026',
    'exp2.role': 'Front-End Developer',
    'exp2.p1': 'I built and maintained advertising banners with HTML5, CSS and JavaScript.',
    'exp2.p2': 'I coded responsive emails that looked right in Gmail, Outlook and on mobile.',
    'exp2.p3': 'I checked every creative with the rest of the team before it was delivered.',
    'exp3.dates': 'Oct 2023 - Jan 2024',
    'exp3.role': 'Web Development Intern',
    'exp3.p1': 'I built custom web apps and WordPress templates with PHP, JavaScript, Bootstrap and MySQL.',
    'exp3.p2': 'I developed a QR code access system for municipal facilities, from the interface to the database.',

    'work.title': "What I've built",
    'project.meta': 'Final diploma project · 2024',
    'project.body':
      'A web app for booking appointments at a barbershop. Customers pick a day, a barber and a time, get an encrypted QR code by email, and the shop scans it to check the booking. I built all of it: frontend, API and database.',
    'project.code': 'View the code',
    'project.shots': 'Screenshots',
    'project.shot.inicio': 'Home',
    'project.shot.reservar': 'Book an appointment',
    'project.shot.servicios': 'Services',
    'project.shot.login': 'Sign in',
    'project.alt.inicio': 'Urbano97 home page',
    'project.alt.reservar': 'Calendar for choosing the appointment day in Urbano97',
    'project.alt.servicios': 'Urbano97 list of services and prices',
    'project.alt.login': 'Urbano97 sign-in screen',
    'work.formats': 'Common formats: 160×600, 970×250, 728×90, 300×250, 320×50',
    'work.banners.title': 'Interactive HTML5 creatives',
    'work.banners.body':
      'GSAP-animated banners for international campaigns. Every format has its own size and weight limit, and the animation has to fit both.',
    'work.emails.title': 'Responsive emails',
    'work.emails.mobile': 'Mobile',
    'work.emails.body': 'Templates that render properly in Gmail, Outlook and on mobile, using the HTML each email client accepts.',
    'work.qr.title': 'QR code access system',
    'work.qr.body': 'Access control for municipal facilities: frontend, PHP server logic and a MySQL database.',
    'work.wp.title': 'Custom WordPress templates',
    'work.wp.body': 'Bespoke themes and web apps for several clients, built with PHP, JavaScript, Bootstrap and MySQL.',

    'stack.title': 'Stack',
    'stack.frontend': 'Frontend',
    'stack.backend': 'Backend and data',
    'stack.tools': 'Tools',
    'stack.banners': 'HTML5 banners',
    'stack.emails': 'Responsive emails',

    'origin.title': 'How I got started',
    'origin.p1':
      "In high school we started learning HTML by typing it into Notepad: a heading, a paragraph, a background colour, save it as .html and open it in the browser. It was as basic as it gets, but I was hooked on seeing a few lines of text turn into a page anyone could open.",
    'origin.p2':
      "That led me to a vocational diploma in Web Application Development, and I haven't stopped since: first PHP, MySQL and WordPress, then banners and emails at agencies, and now Node.js and Angular, which I already used in my final project. What I liked that first day hasn't changed: writing something and watching it work.",
    'origin.p3': 'Away from the screen: music all day and the gym.',
    'howiwork.title': 'How I work',
    'howiwork.p1':
      "With anything new, the first thing I do is try to get it working, however rough. Once it works, I tidy it up and polish it. I spend more time testing in the browser than planning on paper.",
    'howiwork.p2':
      "It's the same at work: before I call a banner done, I open it in every browser and phone I can get my hands on. Until I've seen it work in all of them, I'm not happy.",
    'edu.title': 'Education',
    'edu.dam': 'Higher Vocational Diploma in Web Application Development',
    'edu.bach': 'Science Baccalaureate',
    'edu.languages': 'Languages',
    'edu.spanish': 'Spanish',
    'edu.native': 'Native',
    'edu.english': 'English',

    'contact.title': 'Made it this far? Drop me a line.',
    'contact.body': 'A job offer, a project or anything else you want to tell me about.',
    'contact.copy': 'Copy email',
    'contact.copied': 'Copied',
    'contact.location': 'Guadalajara, Spain',
    'contact.statusLabel': 'Status',
    'contact.status': 'Open to new opportunities',
    'contact.locationLabel': 'Location',
    'contact.linkedin': 'View profile',
    'contact.cv': 'Download PDF',
    'footer.rights': 'Built with HTML, CSS and JavaScript.',
    'footer.top': 'Back to top',
  },
};
