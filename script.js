/* =========================================================
   HIERRO 06 · interacción
   Menú, golpe del titular, vídeo interactivo, horario,
   calculadora 1RM, tarifas, tienda, contacto y cookies.
   La escena 3D vive en escena.js.
   ========================================================= */
(() => {
  'use strict';

  /* ===================== CONFIG ===================== */
  const CONFIG = {
    whatsapp: '34600000000',
    // 0 = domingo … 6 = sábado. [abre, cierra] en horas decimales
    horario: { 0: [[9, 14]], 1: [[6.5, 23]], 2: [[6.5, 23]], 3: [[6.5, 23]], 4: [[6.5, 23]], 5: [[6.5, 23]], 6: [[9, 21]] }
  };
  const TIPOS = {
    Fuerza: '#C6F432',
    Kettlebell: '#FF3B47',
    Halterofilia: '#2F7DE1',
    Movilidad: '#F4C531'
  };
  // Clases de la semana: [hora, nombre, tipo, coach, plazas libres de 6]
  const SEMANA = {
    1: [['7:00', 'Fuerza base', 'Fuerza', 'Irene', 3], ['9:30', 'Kettlebell 30’', 'Kettlebell', 'Marcos', 5], ['14:00', 'Express mediodía', 'Kettlebell', 'Marcos', 2], ['18:00', 'Técnica de arrancada', 'Halterofilia', 'Irene', 1], ['19:30', 'Fuerza 5×5', 'Fuerza', 'Marcos', 4], ['21:00', 'Movilidad y core', 'Movilidad', 'Nuria', 6]],
    2: [['7:00', 'Kettlebell 30’', 'Kettlebell', 'Marcos', 4], ['10:00', 'Movilidad de cadera', 'Movilidad', 'Nuria', 5], ['14:00', 'Fuerza base', 'Fuerza', 'Irene', 3], ['18:00', 'Halterofilia iniciación', 'Halterofilia', 'Irene', 2], ['19:30', 'Kettlebell sport', 'Kettlebell', 'Marcos', 0], ['21:00', 'Fuerza nocturna', 'Fuerza', 'Marcos', 5]],
    3: [['7:00', 'Fuerza base', 'Fuerza', 'Irene', 4], ['9:30', 'Kettlebell 30’', 'Kettlebell', 'Marcos', 6], ['14:00', 'Express mediodía', 'Kettlebell', 'Marcos', 3], ['18:00', 'Cargada y envión', 'Halterofilia', 'Irene', 2], ['19:30', 'Fuerza 5×5', 'Fuerza', 'Marcos', 1], ['21:00', 'Estiramientos', 'Movilidad', 'Nuria', 6]],
    4: [['7:00', 'Kettlebell 30’', 'Kettlebell', 'Marcos', 5], ['10:00', 'Movilidad de hombro', 'Movilidad', 'Nuria', 4], ['14:00', 'Fuerza base', 'Fuerza', 'Irene', 2], ['18:00', 'Halterofilia iniciación', 'Halterofilia', 'Irene', 3], ['19:30', 'Kettlebell sport', 'Kettlebell', 'Marcos', 1], ['21:00', 'Fuerza nocturna', 'Fuerza', 'Marcos', 4]],
    5: [['7:00', 'Fuerza base', 'Fuerza', 'Irene', 5], ['9:30', 'Kettlebell 30’', 'Kettlebell', 'Marcos', 6], ['18:00', 'Open de halterofilia', 'Halterofilia', 'Irene', 4], ['19:30', 'Viernes de kettlebell', 'Kettlebell', 'Marcos', 2]],
    6: [['10:00', 'Test de fuerza', 'Fuerza', 'Irene', 3], ['11:30', 'Kettlebell en pareja', 'Kettlebell', 'Marcos', 2], ['18:00', 'Movilidad total', 'Movilidad', 'Nuria', 6]],
    0: [['10:00', 'Domingo de movilidad', 'Movilidad', 'Nuria', 6], ['11:30', 'Fuerza libre guiada', 'Fuerza', 'Marcos', 5]]
  };
  const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const DIAS_LARGO = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  // Vídeo de la clase: capítulos (segundos) y consejos con su posición (% del vídeo 16:9)
  const CAPITULOS = [
    { nombre: 'Swing ruso', desde: 0, hasta: 8, periodo: 1.6, cima: .5 },
    { nombre: 'Sentadilla goblet', desde: 8, hasta: 16, periodo: 2.4, cima: 1 },
    { nombre: 'Press militar', desde: 16, hasta: 24, periodo: 2.6, cima: .5 }
  ];
  const CONSEJOS = [
    { t: [.3, 2.8], x: 58, y: 40, titulo: 'Bisagra de cadera', texto: 'Lleva la cadera atrás como si cerraras una puerta con ella. Espalda recta y rodillas apenas dobladas.' },
    { t: [2.8, 5.4], x: 30, y: 24, titulo: 'Brazos como cuerdas', texto: 'Los brazos no levantan nada: la kettlebell sube por el empujón de la cadera hasta la altura del pecho.' },
    { t: [5.4, 7.8], x: 62, y: 62, titulo: 'Glúteo y abdomen arriba', texto: 'Arriba aprieta glúteos y abdomen a la vez: el cuerpo forma una tabla. No eches los hombros atrás.' },
    { t: [8.6, 11], x: 60, y: 34, titulo: 'Pecho alto', texto: 'Sujeta la kettlebell por los cuernos, pegada al esternón. Si el pecho cae, el peso te tira hacia delante.' },
    { t: [11, 13.6], x: 38, y: 66, titulo: 'Rodillas hacia fuera', texto: 'Las rodillas siguen la línea de los pies y los codos bajan por dentro de las rodillas.' },
    { t: [13.6, 15.8], x: 60, y: 84, titulo: 'Talones en el suelo', texto: 'Empuja el suelo con todo el pie. Si se levantan los talones, abre un poco más las piernas.' },
    { t: [16.6, 19], x: 40, y: 42, titulo: 'Antebrazo vertical', texto: 'En la posición de rack la muñeca está recta y el antebrazo, vertical bajo la kettlebell.' },
    { t: [19, 21.4], x: 62, y: 52, titulo: 'Costillas abajo', texto: 'No arquees la espalda para subir más: aprieta el abdomen y deja las costillas abajo.' },
    { t: [21.4, 23.8], x: 38, y: 16, titulo: 'Bloquea arriba', texto: 'Termina con el bíceps junto a la oreja y el codo bloqueado un segundo antes de bajar.' }
  ];

  const KB = {
    competicion: { 8: 49, 12: 59, 16: 69, 20: 79, 24: 89, 28: 99, 32: 109 },
    hierro: { 8: 29, 12: 36, 16: 44, 20: 52, 24: 60, 28: 68, 32: 76 },
    colores: { 8: ['#F06AA7', 'rosa'], 12: ['#2F7DE1', 'azul'], 16: ['#F4C531', 'amarillo'], 20: ['#7B4FD8', 'morado'], 24: ['#2FA35C', 'verde'], 28: ['#F07A26', 'naranja'], 32: ['#E2363F', 'rojo'] },
    consejo(kg) {
      if (kg <= 12) return 'Para empezar si nunca has entrenado con kettlebell, y para press y movilidad si ya entrenas.';
      if (kg <= 16) return 'El peso con el que aprende el swing casi todo el mundo que ya entrena.';
      if (kg <= 24) return 'Para swing y sentadilla cuando la técnica ya está limpia.';
      return 'Para avanzados: es el peso del test de fuerza de los coaches.';
    }
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wa = txt => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } }
  };
  const fmt = n => n.toLocaleString('es-ES', { maximumFractionDigits: 1 });

  /* ===================== CABECERA Y MENÚ ===================== */
  const header = $('[data-header]');
  let ultimoY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    header.classList.toggle('is-solid', y > 40);
    header.classList.toggle('is-hidden', y > 500 && y > ultimoY && !document.body.classList.contains('menu-open'));
    ultimoY = y;
  }, { passive: true });

  const toggle = $('[data-menu-toggle]'), menu = $('[data-menu]');
  function cerrarMenu() {
    menu.hidden = true; toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('use').setAttribute('href', '#i-menu');
    document.body.classList.remove('menu-open'); document.body.style.overflow = '';
  }
  toggle.addEventListener('click', () => {
    if (!menu.hidden) return cerrarMenu();
    menu.hidden = false; toggle.setAttribute('aria-expanded', 'true');
    toggle.querySelector('use').setAttribute('href', '#i-close');
    document.body.classList.add('menu-open'); document.body.style.overflow = 'hidden';
    header.classList.add('is-solid');
  });
  $$('a', menu).forEach(a => a.addEventListener('click', cerrarMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { cerrarMenu(); toggle.focus(); } });

  /* ===================== SLAM DUNK: reacción al golpe ===================== */
  const hero = $('[data-hero]');
  // Parte el titular en letras: las más cercanas al golpe saltan antes
  $$('[data-slam]').forEach((linea, li) => {
    const txt = linea.textContent;
    linea.setAttribute('aria-label', txt);
    linea.textContent = '';
    [...txt].forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch'; s.textContent = c; s.setAttribute('aria-hidden', 'true');
      const dist = txt.length - i + li * 2;
      s.style.setProperty('--d', String(dist * 28));
      s.style.setProperty('--r', `${((i * 37) % 9) - 4}deg`);
      linea.appendChild(s);
    });
  });

  let contado = false;
  function impacto(e) {
    const fx = e && e.detail && typeof e.detail.x === 'number' ? e.detail.x : .7;
    hero.style.setProperty('--fx', `${Math.round(fx * 100)}%`);
    hero.classList.remove('is-impacto');
    void hero.offsetWidth; // reinicia las animaciones
    hero.classList.add('is-impacto');
    if (navigator.vibrate && e && e.detail && e.detail.usuario) navigator.vibrate(30);
    if (!contado) { contado = true; contar(); }
  }
  document.addEventListener('hierro:impacto', impacto);
  $('[data-again]').addEventListener('click', () => {
    if (document.documentElement.classList.contains('has-3d')) document.dispatchEvent(new CustomEvent('hierro:soltar'));
    else {
      const fb = $('.hero__fallback');
      fb.style.animation = 'none'; void fb.offsetWidth; fb.style.animation = '';
      setTimeout(() => impacto({ detail: { x: .7 } }), 700);
    }
  });
  // Si la escena 3D no arranca en 7 s, se usa la kettlebell dibujada
  setTimeout(() => {
    const root = document.documentElement;
    if (!root.classList.contains('has-3d')) {
      root.classList.add('no-3d');
      setTimeout(() => impacto({ detail: { x: .7 } }), reduce ? 0 : 700);
    }
  }, 7000);

  function contar() {
    $$('[data-count]').forEach(el => {
      const fin = +el.dataset.count;
      if (reduce) return;
      const t0 = performance.now(), dur = 1200;
      const paso = t => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
        el.textContent = String(Math.round(fin * e)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        if (k < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    });
  }

  /* ===================== APARICIONES ===================== */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: .2 });
  $$('[data-reveal]').forEach(el => {
    const hermanos = [...el.parentElement.children];
    el.style.setProperty('--i', hermanos.indexOf(el));
    io.observe(el);
  });

  /* ===================== VÍDEO INTERACTIVO ===================== */
  const player = $('[data-player]');
  const video = $('[data-video]');
  const DUR = 24;
  const fill = $('[data-fill]'), tl = $('[data-timeline]'), tiempo = $('[data-time]');
  const cuesBox = $('[data-cues]'), repsEl = $('[data-reps]'), capEl = $('[data-chapter-name]');
  const tip = $('[data-tip]');
  let bucle = null, pausadoPorTip = false, consejoActivo = -1, ultimasReps = -1, capActivo = -1;

  // Marcas de capítulo en la barra y botones de capítulo
  const marcas = $('[data-marks]'), capsBox = $('[data-chapters]');
  CAPITULOS.forEach((c, i) => {
    if (i > 0) { const m = document.createElement('span'); m.style.left = `${c.desde / DUR * 100}%`; marcas.appendChild(m); }
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = `${i + 1} · ${c.nombre}`;
    b.addEventListener('click', () => irCapitulo(i));
    capsBox.appendChild(b);
  });
  const capBtns = $$('button', capsBox);

  function irCapitulo(i) {
    video.currentTime = CAPITULOS[i].desde + .01;
    if (bucle) bucle = CAPITULOS[i];
    reproducir();
  }
  function reproducir() { cerrarTip(); const p = video.play(); if (p) p.catch(() => {}); }
  function pausar() { video.pause(); }
  function alternar() { video.paused ? reproducir() : pausar(); }

  // Coloca un consejo teniendo en cuenta el recorte del vídeo (en móvil es cuadrado)
  function posicion(x, y) {
    const r = video.getBoundingClientRect();
    const escala = Math.max(r.width / 16, r.height / 9);
    const w = 16 * escala, h = 9 * escala;
    let px = (x / 100 * w - (w - r.width) / 2) / r.width * 100;
    let py = (y / 100 * h - (h - r.height) / 2) / r.height * 100;
    if (player.classList.contains('is-mirror')) px = 100 - px;
    return [Math.min(84, Math.max(14, px)), Math.min(88, Math.max(10, py))];
  }

  function pintarConsejo(i) {
    if (i === consejoActivo) return;
    consejoActivo = i;
    cuesBox.textContent = '';
    if (i < 0) return;
    const c = CONSEJOS[i];
    const [x, y] = posicion(c.x, c.y);
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'cue';
    b.style.left = `${x}%`; b.style.top = `${y}%`;
    b.innerHTML = `<span class="cue__dot"></span><span class="cue__label"></span>`;
    b.querySelector('.cue__label').textContent = c.titulo;
    b.setAttribute('aria-label', `Consejo: ${c.titulo}. Pulsa para leerlo`);
    b.addEventListener('click', () => abrirTip(c));
    cuesBox.appendChild(b);
  }
  function abrirTip(c) {
    pausadoPorTip = !video.paused;
    pausar();
    $('[data-tip-title]').textContent = c.titulo;
    $('[data-tip-text]').textContent = c.texto;
    tip.hidden = false;
    $('[data-tip-close]').focus({ preventScroll: true });
  }
  function cerrarTip() {
    if (tip.hidden) return;
    tip.hidden = true;
    if (pausadoPorTip) { pausadoPorTip = false; video.play().catch(() => {}); }
  }
  $('[data-tip-close]').addEventListener('click', () => { pausadoPorTip = true; cerrarTip(); });

  function actualizar() {
    const t = video.currentTime || 0;
    if (bucle && t >= bucle.hasta - .05) { video.currentTime = bucle.desde + .01; }
    fill.style.width = `${t / DUR * 100}%`;
    tl.setAttribute('aria-valuenow', t.toFixed(1));
    tl.setAttribute('aria-valuetext', `${Math.floor(t)} segundos`);
    tiempo.textContent = `0:${String(Math.floor(t)).padStart(2, '0')}`;
    const ci = Math.max(0, CAPITULOS.findIndex(c => t < c.hasta));
    const c = CAPITULOS[ci];
    if (ci !== capActivo) {
      capActivo = ci;
      capEl.textContent = c.nombre;
      capBtns.forEach((b, i) => b.classList.toggle('is-on', i === ci));
    }
    const reps = Math.max(0, Math.floor((t - c.desde) / c.periodo + (1 - c.cima)));
    if (reps !== ultimasReps) {
      ultimasReps = reps; repsEl.textContent = reps;
      const box = repsEl.parentElement;
      box.classList.remove('is-pop'); void box.offsetWidth; box.classList.add('is-pop');
    }
    pintarConsejo(CONSEJOS.findIndex(k => t >= k.t[0] && t < k.t[1]));
  }
  // requestVideoFrameCallback va fino con cada fotograma; si no existe, timeupdate + rAF
  function bucleVideo() {
    actualizar();
    if (!video.paused) {
      if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(bucleVideo);
      else requestAnimationFrame(bucleVideo);
    }
  }
  video.addEventListener('play', () => {
    player.classList.add('is-playing');
    $('[data-play] use').setAttribute('href', '#i-pause');
    $('[data-play]').setAttribute('aria-label', 'Pausar');
    bucleVideo();
  });
  video.addEventListener('pause', () => {
    player.classList.remove('is-playing');
    $('[data-play] use').setAttribute('href', '#i-play');
    $('[data-play]').setAttribute('aria-label', 'Reproducir');
    actualizar();
  });
  video.addEventListener('seeked', actualizar);
  video.addEventListener('ended', () => { video.currentTime = 0; reproducir(); });
  $('[data-play]').addEventListener('click', alternar);
  $('[data-play-big]').addEventListener('click', reproducir);
  video.addEventListener('click', alternar);

  // Barra: arrastrar para buscar fotograma a fotograma
  let arrastrando = false, seguia = false;
  function buscar(e) {
    const r = tl.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    video.currentTime = k * DUR * .999;
    actualizar();
  }
  tl.addEventListener('pointerdown', e => { arrastrando = true; seguia = !video.paused; pausar(); tl.setPointerCapture(e.pointerId); buscar(e); });
  tl.addEventListener('pointermove', e => { if (arrastrando) buscar(e); });
  tl.addEventListener('pointerup', () => { arrastrando = false; if (seguia) reproducir(); });
  tl.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault(); e.stopPropagation();
      video.currentTime = Math.min(DUR - .05, Math.max(0, video.currentTime + (e.key === 'ArrowRight' ? 1 : -1)));
    }
  });

  $$('[data-speed]').forEach(b => b.addEventListener('click', () => {
    video.playbackRate = +b.dataset.speed;
    $$('[data-speed]').forEach(x => x.classList.toggle('is-on', x === b));
    if (video.paused) reproducir();
  }));
  const loopBtn = $('[data-loop]');
  loopBtn.addEventListener('click', () => {
    bucle = bucle ? null : CAPITULOS[Math.max(0, capActivo)];
    loopBtn.setAttribute('aria-pressed', String(!!bucle));
  });
  const mirrorBtn = $('[data-mirror]');
  mirrorBtn.addEventListener('click', () => {
    const on = player.classList.toggle('is-mirror');
    mirrorBtn.setAttribute('aria-pressed', String(on));
    consejoActivo = -2; actualizar();
  });
  $('[data-full]').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (player.requestFullscreen) player.requestFullscreen().catch(() => {});
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  });
  addEventListener('resize', () => { consejoActivo = -2; actualizar(); });

  // Atajos de teclado cuando el reproductor está a la vista
  let playerVisible = false;
  new IntersectionObserver(([en]) => {
    playerVisible = en.isIntersecting;
    // Se reproduce solo (sin sonido) al llegar; se pausa al salir
    if (en.isIntersecting && !reduce && video.currentTime === 0 && video.paused) reproducir();
    if (!en.isIntersecting && !video.paused) pausar();
  }, { threshold: .55 }).observe(player);
  addEventListener('keydown', e => {
    if (!playerVisible || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (e.key === ' ' && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); alternar(); }
    else if (e.key === 'ArrowRight' && document.activeElement !== tl) video.currentTime = Math.min(DUR - .05, video.currentTime + 2);
    else if (e.key === 'ArrowLeft' && document.activeElement !== tl) video.currentTime = Math.max(0, video.currentTime - 2);
    else if (['1', '2', '3'].includes(e.key)) irCapitulo(+e.key - 1);
  });
  actualizar();

  /* ===================== HORARIO ===================== */
  const hoy = new Date().getDay();
  let diaSel = hoy, tipoSel = 'Todas';
  const diasBox = $('[data-dias]'), tiposBox = $('[data-tipos]'), lista = $('[data-clases]');
  [1, 2, 3, 4, 5, 6, 0].forEach(d => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab');
    b.innerHTML = `<small>${d === hoy ? 'Hoy' : DIAS[d]}</small>${DIAS[d].slice(0, 1)}`;
    b.setAttribute('aria-label', DIAS_LARGO[d]);
    b.dataset.dia = d;
    b.addEventListener('click', () => { diaSel = d; pintarHorario(); });
    diasBox.appendChild(b);
  });
  ['Todas', ...Object.keys(TIPOS)].forEach(t => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = t; b.dataset.tipo = t;
    b.setAttribute('aria-pressed', String(t === tipoSel));
    b.addEventListener('click', () => { tipoSel = t; pintarHorario(); });
    tiposBox.appendChild(b);
  });
  function pintarHorario() {
    $$('button', diasBox).forEach(b => b.setAttribute('aria-selected', String(+b.dataset.dia === diaSel)));
    $$('button', tiposBox).forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.tipo === tipoSel)); b.classList.toggle('is-on', b.dataset.tipo === tipoSel); });
    const clases = (SEMANA[diaSel] || []).filter(c => tipoSel === 'Todas' || c[2] === tipoSel);
    lista.textContent = '';
    if (!clases.length) {
      const li = document.createElement('li'); li.className = 'clases__vacio';
      li.textContent = `No hay clases de ${tipoSel.toLowerCase()} el ${DIAS_LARGO[diaSel]}. Prueba otro día.`;
      lista.appendChild(li); return;
    }
    clases.forEach(([hora, nombre, tipo, coach, plazas], i) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'clase-card'; a.style.setProperty('--i', i); a.style.setProperty('--c', TIPOS[tipo]);
      a.href = wa(`Hola, quiero reservar plaza en «${nombre}» del ${DIAS_LARGO[diaSel]} a las ${hora} (HIERRO 06).`);
      a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = `<span class="clase-card__hora"></span><span class="clase-card__nombre"></span><span class="clase-card__meta"></span><span class="clase-card__plazas"></span>`;
      a.querySelector('.clase-card__hora').textContent = hora;
      a.querySelector('.clase-card__nombre').textContent = nombre;
      a.querySelector('.clase-card__meta').textContent = `${tipo} · con ${coach}`;
      const p = a.querySelector('.clase-card__plazas');
      p.textContent = plazas ? `${plazas} de 6 plazas libres` : 'Completa · lista de espera';
      p.classList.toggle('is-pocas', plazas <= 1);
      li.appendChild(a); lista.appendChild(li);
    });
  }
  pintarHorario();

  /* ===================== CALCULADORA 1RM ===================== */
  const rmForm = $('[data-rm]'), rmValor = $('[data-rm-valor]'), rmTabla = $('[data-rm-tabla]');
  const OBJETIVOS = [[95, 'Fuerza máx. · 2 reps'], [85, 'Fuerza · 5 reps'], [75, 'Músculo · 8–10 reps'], [65, 'Técnica · 12 reps'], [50, 'Calentamiento']];
  function calcular() {
    const peso = parseFloat(String(rmForm.peso.value).replace(',', '.')) || 0;
    const reps = Math.min(12, Math.max(1, parseInt(rmForm.reps.value, 10) || 1));
    const rm = reps === 1 ? peso : peso * (1 + reps / 30);
    const r = Math.round(rm * 2) / 2;
    if (rmValor.textContent !== fmt(r)) {
      rmValor.textContent = fmt(r);
      const p = rmValor.parentElement; p.classList.remove('is-golpe'); void p.offsetWidth; p.classList.add('is-golpe');
    }
    rmTabla.textContent = '';
    OBJETIVOS.forEach(([pct, txt]) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${pct} %</span><span><em></em><span class="barra"><i></i></span></span><b></b>`;
      li.querySelector('em').textContent = txt;
      li.querySelector('b').textContent = `${fmt(Math.round(rm * pct / 100 * 2) / 2)} kg`;
      rmTabla.appendChild(li);
      requestAnimationFrame(() => { li.querySelector('i').style.width = `${pct}%`; });
    });
  }
  rmForm.addEventListener('input', calcular);
  rmForm.addEventListener('submit', e => e.preventDefault());
  calcular();

  /* ===================== TARIFAS ===================== */
  const DESCUENTO = { 1: 0, 3: .1, 12: .2 };
  let meses = 1;
  function pintarTarifas() {
    $$('[data-periodo] button').forEach(b => b.setAttribute('aria-checked', String(+b.dataset.meses === meses)));
    $$('[data-plan]').forEach(plan => {
      const base = +plan.dataset.precio;
      const mes = Math.round(base * (1 - DESCUENTO[meses]) * 100) / 100;
      const span = $('[data-precio-mes]', plan);
      const nuevo = fmt(mes);
      if (span.textContent !== nuevo) { span.textContent = nuevo; span.classList.remove('is-golpe'); void span.offsetWidth; span.classList.add('is-golpe'); }
      $('[data-total]', plan).textContent = meses === 1 ? 'Pago mes a mes' : `${fmt(Math.round(mes * meses))} € cada ${meses === 3 ? 'trimestre' : 'año'}`;
      const cta = $('[data-plan-cta]', plan);
      const periodo = meses === 1 ? 'mensual' : meses === 3 ? 'trimestral' : 'anual';
      cta.href = wa(`Hola, quiero empezar la prueba de 7 días gratis con el plan ${plan.dataset.plan} (pago ${periodo}) en HIERRO 06.`);
      cta.target = '_blank'; cta.rel = 'noopener';
    });
  }
  $$('[data-periodo] button').forEach(b => b.addEventListener('click', () => { meses = +b.dataset.meses; pintarTarifas(); }));
  pintarTarifas();

  /* ===================== TIENDA ===================== */
  const tienda = $('#tienda');
  const pesosBox = $('[data-pesos]');
  const estadoKB = { kg: 16, acabado: 'competicion' };
  Object.keys(KB.colores).forEach(kg => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'peso'; b.setAttribute('role', 'radio');
    b.style.setProperty('--kb', KB.colores[kg][0]);
    b.textContent = kg; b.dataset.kg = kg;
    b.setAttribute('aria-label', `${kg} kilos`);
    b.addEventListener('click', () => { estadoKB.kg = +kg; pintarKB(true); });
    pesosBox.appendChild(b);
  });
  $$('[data-tipo]').forEach(b => b.addEventListener('click', () => { estadoKB.acabado = b.dataset.tipo; pintarKB(true); }));
  function pintarKB(avisar) {
    const { kg, acabado } = estadoKB;
    const [color, nombre] = KB.colores[kg];
    $$('.peso', pesosBox).forEach(b => b.setAttribute('aria-checked', String(+b.dataset.kg === kg)));
    $$('[data-tipo]').forEach(b => { const on = b.dataset.tipo === acabado; b.setAttribute('aria-checked', String(on)); b.classList.toggle('is-on', on); });
    tienda.classList.toggle('is-hierro', acabado === 'hierro');
    $('[data-kb-nombre]').textContent = acabado === 'hierro' ? `Hierro fundido ${kg} kg · número ${nombre}` : `Competición ${kg} kg · ${nombre}`;
    $('[data-kb-precio]').textContent = KB[acabado][kg];
    $('[data-kb-consejo]').textContent = KB.consejo(kg);
    const cta = $('[data-kb-cta]');
    cta.href = wa(`Hola, quiero reservar una kettlebell de ${acabado === 'hierro' ? 'hierro fundido' : 'competición'} de ${kg} kg (${KB[acabado][kg]} €) para recogerla en HIERRO 06.`);
    cta.target = '_blank'; cta.rel = 'noopener';
    $('[data-fb-kg]').textContent = kg;
    $('.tienda__fallback').style.setProperty('--kb', acabado === 'hierro' ? '#1b1c1f' : color);
    window.HIERRO_KB = { kg, color, acabado };
    if (avisar) document.dispatchEvent(new CustomEvent('hierro:kb', { detail: window.HIERRO_KB }));
  }
  pintarKB(false);

  /* ===================== CONTACTO ===================== */
  const estado = $('[data-estado]');
  function pintarEstado() {
    const ahora = new Date(), d = ahora.getDay(), h = ahora.getHours() + ahora.getMinutes() / 60;
    const tramo = (CONFIG.horario[d] || []).find(([a, c]) => h >= a && h < c);
    const hhmm = x => `${Math.floor(x)}:${String(Math.round((x % 1) * 60)).padStart(2, '0')}`;
    if (tramo) {
      estado.textContent = `Abierto ahora · hasta las ${hhmm(tramo[1])}`;
      estado.style.setProperty('--e', '#2d9a1f');
    } else {
      let txt = 'Cerrado ahora';
      for (let i = 0; i < 7; i++) {
        const dd = (d + i) % 7;
        const sig = (CONFIG.horario[dd] || []).find(([a]) => i > 0 || a > h);
        if (sig) { txt += ` · abrimos ${i === 0 ? 'hoy' : i === 1 ? 'mañana' : 'el ' + DIAS_LARGO[dd]} a las ${hhmm(sig[0])}`; break; }
      }
      estado.textContent = txt;
      estado.style.setProperty('--e', '#c41d28');
    }
  }
  pintarEstado(); setInterval(pintarEstado, 60000);

  $('[data-reserva]').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const nombre = f.nombre.value.trim();
    if (!nombre) { f.nombre.focus(); return; }
    open(wa(`Hola, soy ${nombre}. Quiero mi semana gratis en HIERRO 06. Objetivo: ${f.objetivo.value}. Franja: ${f.franja.value}.`), '_blank', 'noopener');
  });

  /* ===================== COOKIES Y MAPA ===================== */
  const banner = $('[data-cookies]'), mapa = $('[data-mapa]');
  function cargarMapa() {
    if ($('iframe', mapa)) return;
    const f = document.createElement('iframe');
    f.title = 'Mapa de HIERRO 06 en Mérida (OpenStreetMap)';
    f.loading = 'lazy';
    f.src = 'https://www.openstreetmap.org/export/embed.html?bbox=-6.3483%2C38.9076%2C-6.3283%2C38.9176&layer=mapnik&marker=38.9126%2C-6.3383';
    mapa.appendChild(f);
  }
  function decidir(v) { store.set('hierro06-consent', v); banner.hidden = true; if (v === 'si') cargarMapa(); }
  const consent = store.get('hierro06-consent');
  if (!consent) setTimeout(() => { banner.hidden = false; }, 2200);
  else if (consent === 'si') cargarMapa();
  $$('[data-cookies] [data-cookies]').forEach(b => b.addEventListener('click', () => decidir(b.dataset.cookies)));
  $('[data-cookies-open]').addEventListener('click', () => { banner.hidden = false; });
  $('[data-cargar-mapa]').addEventListener('click', () => decidir('si'));
})();
