/* =========================================================
   HIERRO 06 · escenas 3D (three.js r186)

   1. Inicio «Slam Dunk»: una kettlebell cae a plomo, golpea
      el suelo, lo agrieta, levanta polvo de tiza y una onda
      expansiva. Al tocarla (o con «Soltar otra vez») se
      levanta y vuelve a caer.
   2. Tienda: kettlebell de competición o de hierro fundido
      que se gira arrastrando y cambia de peso y color.

   No se descarga ningún modelo: todo se genera en kettlebell.js.
   Solo se dibuja lo que está en pantalla.
   ========================================================= */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { crearKettlebell, usarFuente } from './kettlebell.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const movil = matchMedia('(max-width: 860px)').matches || navigator.maxTouchPoints > 1 && innerWidth < 1100;
const DPR = Math.min(devicePixelRatio || 1, movil ? 1.6 : 2);
const VOLT = 0xc6f432;

function crearRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  r.setPixelRatio(DPR);
  r.toneMapping = THREE.NeutralToneMapping;
  r.toneMappingExposure = 1;
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFShadowMap;
  return r;
}
function entorno(renderer, scene, intensidad) {
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = intensidad;
  pm.dispose();
}
// Dibuja solo cuando el lienzo se ve y la pestaña está activa
function cuandoVisible(el, cb) {
  let visible = false;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; cb(visible && !document.hidden); }, { rootMargin: '80px' }).observe(el);
  document.addEventListener('visibilitychange', () => cb(visible && !document.hidden));
}
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* =====================================================
   1. INICIO · SLAM DUNK
   ===================================================== */
function escenaInicio() {
  const canvas = document.querySelector('[data-hero-canvas]');
  const hero = document.querySelector('[data-hero]');
  const renderer = crearRenderer(canvas);
  const scene = new THREE.Scene();
  entorno(renderer, scene, .45);
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);

  // Luces
  const key = new THREE.DirectionalLight(0xfff4e2, 2.4);
  key.position.set(3, 7, 4); key.castShadow = true;
  key.shadow.mapSize.setScalar(movil ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 20 });
  key.shadow.radius = 4; key.shadow.bias = -.0005;
  scene.add(key, key.target);
  const rim = new THREE.SpotLight(VOLT, 60, 12, .7, .6);
  rim.position.set(-2.5, 3.2, -2.5); scene.add(rim, rim.target);
  const rojo = new THREE.PointLight(0xff3b47, 6, 6); rojo.position.set(2.2, .4, -1.2); scene.add(rojo);

  // Suelo: sombra + rejilla de tiza que se desvanece + grieta del golpe
  const suelo = new THREE.Group(); scene.add(suelo);
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: .55 }));
  sombra.rotation.x = -Math.PI / 2; sombra.receiveShadow = true; suelo.add(sombra);

  function texRejilla() {
    const c = document.createElement('canvas'); c.width = c.height = 1024;
    const g = c.getContext('2d');
    g.strokeStyle = 'rgba(241,240,234,.15)'; g.lineWidth = 2;
    for (let i = 0; i <= 16; i++) {
      const p = i * 64;
      g.beginPath(); g.moveTo(p, 0); g.lineTo(p, 1024); g.stroke();
      g.beginPath(); g.moveTo(0, p); g.lineTo(1024, p); g.stroke();
    }
    // desvanecido radial
    g.globalCompositeOperation = 'destination-in';
    const r = g.createRadialGradient(512, 512, 60, 512, 512, 512);
    r.addColorStop(0, 'rgba(0,0,0,1)'); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(0, 0, 1024, 1024);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8; return t;
  }
  const rejilla = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: texRejilla(), transparent: true, depthWrite: false }));
  rejilla.rotation.x = -Math.PI / 2; rejilla.position.y = .002; suelo.add(rejilla);

  const grietaCanvas = document.createElement('canvas'); grietaCanvas.width = grietaCanvas.height = 1024;
  const grietaTex = new THREE.CanvasTexture(grietaCanvas);
  const grieta = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: grietaTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  grieta.rotation.x = -Math.PI / 2; grieta.position.y = .004; suelo.add(grieta);
  function dibujarGrieta() {
    const g = grietaCanvas.getContext('2d');
    g.clearRect(0, 0, 1024, 1024);
    g.lineCap = 'round'; g.lineJoin = 'round';
    const rama = (x, y, ang, largo, grosor, n) => {
      g.beginPath(); g.moveTo(x, y);
      let px = x, py = y;
      const pasos = 6 + Math.random() * 5 | 0;
      for (let i = 0; i < pasos; i++) {
        ang += (Math.random() - .5) * .7;
        px += Math.cos(ang) * largo / pasos; py += Math.sin(ang) * largo / pasos;
        g.lineTo(px, py);
      }
      g.lineWidth = grosor; g.stroke();
      if (n > 0 && Math.random() < .8) rama(px, py, ang + (Math.random() - .5) * 1.4, largo * .55, grosor * .6, n - 1);
    };
    g.shadowColor = 'rgba(198,244,50,.9)'; g.shadowBlur = 18;
    g.strokeStyle = 'rgba(214,255,90,.95)';
    const n = 9 + Math.random() * 4 | 0;
    for (let i = 0; i < n; i++) rama(512, 512, i / n * Math.PI * 2 + Math.random() * .4, 170 + Math.random() * 240, 7, 2);
    grietaTex.needsUpdate = true;
  }

  // Ondas expansivas
  const ondas = [0, 1].map(() => {
    const m = new THREE.Mesh(new THREE.RingGeometry(.94, 1, 128), new THREE.MeshBasicMaterial({ color: VOLT, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2; m.position.y = .01; suelo.add(m); return m;
  });

  // Polvo de tiza
  const N = movil ? 160 : 280;
  const pos = new Float32Array(N * 3), vel = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const polvoGeo = new THREE.BufferGeometry();
  polvoGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  polvoGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const punto = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  const polvoMat = new THREE.PointsMaterial({ size: .07, map: punto, vertexColors: true, transparent: true, depthWrite: false, opacity: 0, blending: THREE.AdditiveBlending });
  const polvo = new THREE.Points(polvoGeo, polvoMat); polvo.frustumCulled = false; suelo.add(polvo);
  const cVolt = new THREE.Color(VOLT), cTiza = new THREE.Color(0xf1f0ea);
  function soltarPolvo() {
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2, r = .35 + Math.random() * .2, v = 1.2 + Math.random() * 3.2;
      pos.set([Math.cos(a) * r, .02 + Math.random() * .1, Math.sin(a) * r], i * 3);
      vel.set([Math.cos(a) * v, .6 + Math.random() * 2.6, Math.sin(a) * v], i * 3);
      const c = Math.random() < .55 ? cVolt : cTiza;
      col.set([c.r, c.g, c.b], i * 3);
    }
    polvoGeo.attributes.position.needsUpdate = true; polvoGeo.attributes.color.needsUpdate = true;
  }

  // Kettlebell negra de 24 kg con el número en volt
  const kb = crearKettlebell({ color: '#141518', tinta: '#C6F432', kg: 24, acabado: 'hierro', lienzo: movil ? 1024 : 2048 });
  const pivote = new THREE.Group(); pivote.add(kb.grupo); scene.add(pivote);
  kb.grupo.traverse(m => { if (m.isMesh) m.castShadow = true; });

  // Encaje: en ordenador la kettlebell va a la derecha; en móvil, abajo y centrada
  let ancho = 1, alto = 1, visW = 1, visH = 1;
  const MIRA = new THREE.Vector3();
  function encajar() {
    const r = canvas.getBoundingClientRect();
    ancho = Math.max(1, r.width); alto = Math.max(1, r.height);
    renderer.setSize(ancho, alto, false);
    camera.aspect = ancho / alto;
    const vertical = camera.aspect < .95;
    const tan = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    // En vertical la distancia depende del ancho: la kettlebell ocupa ~1/2 de la pantalla
    const dist = vertical ? 2.5 / camera.aspect / tan : camera.aspect < 1.35 ? 6.8 : 6.2;
    visH = tan * dist;
    visW = visH * camera.aspect;
    // En móvil se coloca en el hueco reservado entre los botones y las cifras
    const spot = document.querySelector('[data-hero-spot]');
    const sr = spot && spot.getBoundingClientRect();
    const frac = sr && sr.height ? (sr.top + sr.height * .55 - r.top) / alto : .67;
    if (vertical) MIRA.set(0, .6 + (frac - .5) * visH, 0);
    else MIRA.set(-visW * (camera.aspect < 1.35 ? .2 : .25), .72, 0);
    camera.position.set(MIRA.x + .2, MIRA.y + 1.5, dist);
    camera.lookAt(MIRA);
    camera.updateProjectionMatrix();
    base.copy(camera.position);
  }
  const base = new THREE.Vector3();

  // ---------- Animación ----------
  const ALTURA = 5.2, CAIDA = .62;
  let fase = reduce ? 'reposo' : 'espera', t0 = 0, golpe = -10, usuario = false;
  let reposoT = 0;
  const raton = { x: 0, y: 0, tx: 0, ty: 0 };

  function impactar(ahora) {
    golpe = ahora;
    dibujarGrieta();
    soltarPolvo();
    // Posición del golpe en pantalla, para el destello del HTML
    const p = new THREE.Vector3(0, 0, 0).project(camera);
    document.dispatchEvent(new CustomEvent('hierro:impacto', { detail: { x: (p.x + 1) / 2, usuario } }));
  }
  function soltar(desdeUsuario) {
    if (fase === 'caida' || fase === 'subida') return;
    usuario = !!desdeUsuario;
    if (reduce) { impactar(performance.now() / 1000); return; }
    fase = 'subida'; t0 = performance.now() / 1000;
    if (!activo) { activo = true; requestAnimationFrame(frame); }
  }
  document.addEventListener('hierro:soltar', () => soltar(true));

  // Tocar la kettlebell la vuelve a soltar
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  canvas.addEventListener('pointerdown', e => {
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.intersectObject(kb.grupo, true).length) soltar(true);
  });
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    raton.tx = (e.clientX - r.left) / r.width * 2 - 1;
    raton.ty = (e.clientY - r.top) / r.height * 2 - 1;
    ndc.set(raton.tx, -raton.ty); ray.setFromCamera(ndc, camera);
    canvas.style.cursor = ray.intersectObject(kb.grupo, true).length ? 'pointer' : '';
  });
  // En el inicio, el ratón sobre el texto también mueve la cámara
  hero.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    raton.tx = e.clientX / innerWidth * 2 - 1; raton.ty = e.clientY / innerHeight * 2 - 1;
  });

  let activo = false, visible = true;
  function frame(ms) {
    if (!visible && fase === 'reposo') { activo = false; return; }
    const ahora = ms / 1000;
    let y = 0, giro = 0, inclina = 0;

    if (fase === 'espera') { y = ALTURA + 2; if (!t0) t0 = ahora; if (ahora - t0 > .35) { fase = 'caida'; t0 = ahora; } }
    else if (fase === 'subida') {
      const k = Math.min(1, (ahora - t0) / .55);
      y = ALTURA * easeInOut(k) * .9; giro = k * Math.PI * .5; inclina = Math.sin(k * Math.PI) * .25;
      if (k >= 1) { fase = 'caida'; t0 = ahora; }
    }
    if (fase === 'caida') {
      const k = Math.min(1, (ahora - t0) / CAIDA);
      y = ALTURA * (1 - k * k); giro = (1 - k) * -1.6 + .35; inclina = (1 - k) * .22;
      if (k >= 1) { fase = 'rebote'; t0 = ahora; impactar(ahora); }
    } else if (fase === 'rebote') {
      const k = (ahora - t0) / .34;
      y = k < 1 ? Math.sin(k * Math.PI) * .16 : 0; giro = .35;
      if (k >= 1) { fase = 'reposo'; reposoT = ahora; }
    } else if (fase === 'reposo') {
      giro = .35 + Math.sin((ahora - reposoT) * .5) * .25;
    }

    // Aplastamiento al golpear (muelle amortiguado)
    const dt = ahora - golpe;
    const muelle = dt >= 0 && dt < 1.2 ? Math.exp(-dt * 7) * Math.cos(dt * 34) : 0;
    const sy = 1 - .14 * muelle, sxz = 1 / Math.sqrt(sy);
    pivote.position.y = Math.max(0, y);
    pivote.scale.set(sxz, sy, sxz);
    raton.x += (raton.tx - raton.x) * .06; raton.y += (raton.ty - raton.y) * .06;
    pivote.rotation.set(inclina + raton.y * .06, giro + raton.x * .35, inclina * .5);

    // Sombra más pequeña cuanto más alta va la kettlebell
    sombra.material.opacity = .55 * (1 - Math.min(1, pivote.position.y / ALTURA) * .7);

    // Ondas, polvo y grieta
    ondas.forEach((o, i) => {
      const k = (dt - i * .12) / .9;
      if (k > 0 && k < 1) { o.scale.setScalar(.5 + easeOut(k) * (4.2 - i * 1.2)); o.material.opacity = (1 - k) * .9; }
      else o.material.opacity = 0;
    });
    if (dt >= 0 && dt < 2.2) {
      const paso = Math.min(.033, ahora - (frame.ultimo || ahora));
      for (let i = 0; i < N; i++) {
        vel[i * 3 + 1] -= 7.5 * paso;
        vel[i * 3] *= .985; vel[i * 3 + 2] *= .985;
        pos[i * 3] += vel[i * 3] * paso; pos[i * 3 + 1] = Math.max(.01, pos[i * 3 + 1] + vel[i * 3 + 1] * paso); pos[i * 3 + 2] += vel[i * 3 + 2] * paso;
      }
      polvoGeo.attributes.position.needsUpdate = true;
      polvoMat.opacity = Math.max(0, 1 - dt / 2.2);
    } else polvoMat.opacity = 0;
    grieta.material.opacity = dt >= 0 ? (dt < .1 ? 1 : .28 + .72 * Math.exp(-(dt - .1) * 2.2)) : 0;
    frame.ultimo = ahora;

    // Sacudida de cámara
    const sac = dt >= 0 && dt < .7 ? .14 * Math.exp(-dt * 7) : 0;
    camera.position.set(
      base.x + raton.x * .35 + (Math.random() - .5) * sac,
      base.y - raton.y * .2 + (Math.random() - .5) * sac,
      base.z + (Math.random() - .5) * sac * .5
    );
    camera.lookAt(MIRA);

    renderer.render(scene, camera);
    if (activo) requestAnimationFrame(frame);
  }
  const easeOut = k => 1 - Math.pow(1 - k, 3);

  encajar();
  new ResizeObserver(() => { encajar(); if (!activo) renderer.render(scene, camera); }).observe(canvas);
  cuandoVisible(canvas, v => {
    visible = v;
    if (v && !activo) { activo = true; requestAnimationFrame(frame); }
  });
  if (reduce) { pivote.rotation.y = .35; dibujarGrieta(); grieta.material.opacity = .28; renderer.render(scene, camera); impactar(0); }
  activo = true; requestAnimationFrame(frame);
}

/* =====================================================
   2. TIENDA · kettlebell configurable
   ===================================================== */
function escenaTienda() {
  const canvas = document.querySelector('[data-tienda-canvas]');
  const renderer = crearRenderer(canvas);
  const scene = new THREE.Scene();
  entorno(renderer, scene, .8);
  const camera = new THREE.PerspectiveCamera(28, 1, .1, 50);
  camera.position.set(0, 1.1, 4.6);
  const key = new THREE.DirectionalLight(0xffffff, 2); key.position.set(2.5, 4, 3); key.castShadow = true;
  key.shadow.mapSize.setScalar(1024); Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2 });
  scene.add(key);
  const rim = new THREE.PointLight(VOLT, 10, 8); rim.position.set(-2, 1.8, -2); scene.add(rim);
  const sombra = new THREE.Mesh(new THREE.CircleGeometry(1.4, 64), new THREE.ShadowMaterial({ opacity: .5 }));
  sombra.rotation.x = -Math.PI / 2; sombra.receiveShadow = true; scene.add(sombra);
  const onda = new THREE.Mesh(new THREE.RingGeometry(.95, 1, 96), new THREE.MeshBasicMaterial({ color: VOLT, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
  onda.rotation.x = -Math.PI / 2; onda.position.y = .01; scene.add(onda);

  const st = window.HIERRO_KB || { kg: 16, color: '#F4C531', acabado: 'competicion' };
  const ajustes = s => s.acabado === 'hierro'
    ? { color: '#1b1c1f', tinta: s.color, kg: s.kg, acabado: 'hierro' }
    : { color: s.color, tinta: '#ffffff', kg: s.kg, acabado: 'competicion' };
  const kb = crearKettlebell({ ...ajustes(st), lienzo: movil ? 1024 : 2048 });
  kb.grupo.traverse(m => { if (m.isMesh) m.castShadow = true; });
  const pivote = new THREE.Group(); pivote.add(kb.grupo); scene.add(pivote);
  const escala = s => s.acabado === 'hierro' ? Math.cbrt(s.kg / 16) * .95 : 1;
  let escalaObj = escala(st), escalaAct = escalaObj;

  function encajar() {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
    camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix();
    camera.lookAt(0, .62, 0);
  }

  // Arrastrar para girar, con inercia
  let rotY = -.5, vel = .004, arr = false, lx = 0, salto = -10, cambioPend = null;
  canvas.addEventListener('pointerdown', e => { arr = true; lx = e.clientX; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!arr) return; const dx = e.clientX - lx; lx = e.clientX; vel = dx * .006; rotY += vel; });
  canvas.addEventListener('pointerup', () => { arr = false; });
  canvas.addEventListener('pointercancel', () => { arr = false; });

  document.addEventListener('hierro:kb', e => {
    cambioPend = e.detail; salto = performance.now() / 1000;
    if (reduce) { kb.set(ajustes(cambioPend)); escalaObj = escalaAct = escala(cambioPend); cambioPend = null; dibujar(); }
    else despertar();
  });

  let activo = false, visible = false;
  function frame(ms) {
    const ahora = ms / 1000;
    if (!arr) { vel += (.004 - vel) * .02; rotY += vel; }
    // Cambio de peso: salta, gira y cae con una onda pequeña
    const k = (ahora - salto) / .7;
    let y = 0, giro = 0;
    if (k >= 0 && k < 1) {
      y = Math.sin(Math.min(1, k / .8) * Math.PI) * .45; giro = easeInOut(Math.min(1, k / .8)) * Math.PI * 2;
      if (cambioPend && k > .4) { kb.set(ajustes(cambioPend)); escalaObj = escala(cambioPend); cambioPend = null; }
      const ko = (k - .8) / .2;
      onda.material.opacity = ko > 0 ? (1 - ko) * .8 : 0; onda.scale.setScalar(.6 + Math.max(0, ko) * 1.2);
    } else onda.material.opacity = 0;
    escalaAct += (escalaObj - escalaAct) * .12;
    pivote.position.y = y;
    pivote.scale.setScalar(escalaAct);
    pivote.rotation.y = rotY + giro;
    renderer.render(scene, camera);
    if (visible || (k >= 0 && k < 1)) requestAnimationFrame(frame); else activo = false;
  }
  function despertar() { if (!activo) { activo = true; requestAnimationFrame(frame); } }
  function dibujar() { renderer.render(scene, camera); }
  encajar();
  new ResizeObserver(() => { encajar(); dibujar(); }).observe(canvas);
  cuandoVisible(canvas, v => { visible = v; if (v) despertar(); });
  dibujar();
}

/* ===================== ARRANQUE ===================== */
async function iniciar() {
  const prueba = document.createElement('canvas');
  if (!(prueba.getContext('webgl2') || prueba.getContext('webgl'))) throw new Error('Sin WebGL');
  try { await Promise.race([document.fonts.load('900 100px Unbounded'), new Promise(r => setTimeout(r, 2500))]); } catch { /* fuente de reserva */ }
  usarFuente('Unbounded, "Arial Black", sans-serif');
  escenaInicio();
  escenaTienda();
  document.documentElement.classList.add('has-3d');
}
iniciar().catch(err => {
  console.warn('Escena 3D no disponible:', err);
  document.documentElement.classList.add('no-3d');
});
