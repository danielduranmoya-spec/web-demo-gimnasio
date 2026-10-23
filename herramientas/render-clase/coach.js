// Vulcano, el coach 3D de HIERRO 06: maniquí articulado + kettlebell.
// render(t) dibuja el instante t (segundos) de la clase de 24 s.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { crearKettlebell, PESOS, usarFuente } from '../../kettlebell.js';

const D = THREE.MathUtils.degToRad;
const lerp = THREE.MathUtils.lerp;
const W = innerWidth, H = innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0e0c);
scene.fog = new THREE.Fog(0x0d0e0c, 6, 13);
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
scene.environmentIntensity = .35;

const camera = new THREE.PerspectiveCamera(34, W / H, .1, 50);

// Luces: clave cálida, contraluz volt y rojo a ras de suelo
const key = new THREE.DirectionalLight(0xfff3e0, 2.6);
key.position.set(2.5, 5, 3); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 });
key.shadow.radius = 6;
scene.add(key);
const rimV = new THREE.PointLight(0xc6f432, 22, 9); rimV.position.set(-2.4, 2.4, -2.2); scene.add(rimV);
const rimR = new THREE.PointLight(0xff3b47, 10, 8); rimR.position.set(2.6, .6, -2.4); scene.add(rimR);
scene.add(new THREE.HemisphereLight(0x9aa0a6, 0x0d0e0c, .5));

// Suelo de caucho con líneas y logo
function sueloTex() {
  const c = document.createElement('canvas'); c.width = c.height = 2048;
  const g = c.getContext('2d');
  g.fillStyle = '#17181a'; g.fillRect(0, 0, 2048, 2048);
  const img = g.getImageData(0, 0, 2048, 2048), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - .5) * 22; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
  g.strokeStyle = 'rgba(241,240,234,.18)'; g.lineWidth = 6;
  for (let i = 1; i < 8; i++) { g.beginPath(); g.moveTo(i * 256, 0); g.lineTo(i * 256, 2048); g.stroke(); }
  g.fillStyle = 'rgba(198,244,50,.9)';
  g.font = '900 150px Unbounded'; g.textAlign = 'center';
  g.fillText('HIERRO 06', 1024, 1640);
  g.fillRect(724, 1690, 600, 14);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ roughness: .85, metalness: 0 }));
suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true; scene.add(suelo);

// Atrezo: fila de kettlebells de competición y torre de discos
const atrezo = new THREE.Group(); scene.add(atrezo);
const discoMat = new THREE.MeshStandardMaterial({ color: 0x1b1c1e, roughness: .55, metalness: .3 });
for (let i = 0; i < 6; i++) {
  const d = new THREE.Mesh(new THREE.CylinderGeometry(.45 - i * .03, .45 - i * .03, .07, 48), discoMat);
  d.position.set(2.2, .035 + i * .075, -1.6); d.castShadow = d.receiveShadow = true; atrezo.add(d);
}
const filaKB = [];

// ---------- Maniquí ----------
const piel = new THREE.MeshStandardMaterial({ color: 0xe8e6df, roughness: .55, metalness: .05 });
const junta = new THREE.MeshStandardMaterial({ color: 0xc6f432, roughness: .35, emissive: 0x3a4a00, emissiveIntensity: .6 });
const oscuro = new THREE.MeshStandardMaterial({ color: 0x1e1f22, roughness: .4, metalness: .2 });
function hueso(len, r, mat = piel) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len - r * 2, 8, 24), mat);
  m.position.y = -len / 2; m.castShadow = true; g.add(m);
  const j = new THREE.Mesh(new THREE.SphereGeometry(r * 1.08, 24, 16), junta); j.castShadow = true; g.add(j);
  return g;
}
const L = { muslo: .45, pierna: .43, brazo: .3, antebrazo: .27, tobillo: .07 };
const raiz = new THREE.Group(); scene.add(raiz);
const pelvis = new THREE.Mesh(new THREE.CapsuleGeometry(.12, .14, 8, 24), oscuro);
pelvis.rotation.z = Math.PI / 2; pelvis.castShadow = true; raiz.add(pelvis);
const espalda = new THREE.Group(); raiz.add(espalda);
const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.15, .3, 8, 24), piel);
torso.scale.set(1.25, 1, .8); torso.position.y = .3; torso.castShadow = true; espalda.add(torso);
const cuello = new THREE.Mesh(new THREE.CylinderGeometry(.045, .05, .1, 16), piel); cuello.position.y = .6; espalda.add(cuello);
const cabeza = new THREE.Mesh(new THREE.SphereGeometry(.11, 32, 24), piel);
cabeza.scale.set(.9, 1.1, 1); cabeza.position.y = .73; cabeza.castShadow = true; espalda.add(cabeza);
const visera = new THREE.Mesh(new THREE.TorusGeometry(.1, .014, 8, 40, Math.PI * .9), junta);
visera.position.set(0, .745, .015); visera.rotation.set(0, 0, Math.PI * .05 + Math.PI * 1.05); visera.rotation.y = 0;
visera.rotation.x = Math.PI / 2; visera.rotation.z = Math.PI * 1.05; espalda.add(visera);

function brazo(lado) {
  const hombro = new THREE.Group(); hombro.position.set(lado * .23, .5, 0); espalda.add(hombro);
  const sup = hueso(L.brazo, .05); hombro.add(sup);
  const codo = new THREE.Group(); codo.position.y = -L.brazo; sup.add(codo);
  const inf = hueso(L.antebrazo, .042); codo.add(inf);
  const mano = new THREE.Group(); mano.position.y = -L.antebrazo; inf.add(mano);
  const puño = new THREE.Mesh(new THREE.SphereGeometry(.05, 16, 12), piel); puño.position.y = -.03; puño.castShadow = true; mano.add(puño);
  return { hombro, codo, mano };
}
function pierna(lado) {
  const cadera = new THREE.Group(); cadera.position.set(lado * .1, 0, 0); raiz.add(cadera);
  const mus = hueso(L.muslo, .07); cadera.add(mus);
  const rodilla = new THREE.Group(); rodilla.position.y = -L.muslo; mus.add(rodilla);
  const pie = hueso(L.pierna, .055); rodilla.add(pie);
  const tobillo = new THREE.Group(); tobillo.position.y = -L.pierna; pie.add(tobillo);
  const zap = new THREE.Mesh(new THREE.BoxGeometry(.1, .07, .26), oscuro); zap.position.set(0, -.035, .06); zap.castShadow = true; tobillo.add(zap);
  return { cadera, rodilla, tobillo };
}
const BD = brazo(-1), BI = brazo(1), PD = pierna(-1), PI = pierna(1);

let kb;
const ESC = .27;

// ---------- Poses ----------
// lean: inclinación del tronco (+ adelante). caderaF: muslo hacia delante. rodilla: flexión.
// hombroF: brazo hacia delante respecto al tronco. codo: flexión. abre: separación lateral de brazos (+ hacia fuera)
function swing(t) {
  const p = (t % 1.6) / 1.6;
  const s = (1 - Math.cos(2 * Math.PI * p)) / 2;
  const sa = (1 - Math.cos(2 * Math.PI * (p - .07))) / 2;
  const a = { lean: lerp(62, -4, s), caderaF: lerp(20, 0, s), rodilla: lerp(28, 2, s), apertura: 9 };
  const hf = lerp(30, 94 - 4, sa) + (a.lean - lerp(62, -4, sa));
  const brazos = { hombroF: hf, codo: 2, abre: -15 };
  return { ...a, d: brazos, i: brazos, kb: 'swing' };
}
function goblet(t) {
  const p = (t % 2.4) / 2.4;
  const s = (1 - Math.cos(2 * Math.PI * p)) / 2;
  const lean = lerp(4, 32, s);
  const brazos = { hombroF: lerp(40, 30, s), codo: 132, abre: -24 };
  return { lean, caderaF: lerp(0, 98, s), rodilla: lerp(2, 116, s), apertura: lerp(12, 22, s), d: brazos, i: brazos, kb: 'goblet' };
}
function press(t) {
  const p = (t % 2.6) / 2.6;
  const s = Math.pow((1 - Math.cos(2 * Math.PI * p)) / 2, .85);
  return {
    lean: lerp(0, -3, s), caderaF: 0, rodilla: 3, apertura: 10,
    d: { hombroF: lerp(22, 172, s), codo: lerp(140, 4, s), abre: lerp(-12, 6, s) },
    i: { hombroF: 6, codo: 28, abre: 14 },
    kb: 'press'
  };
}
export const CAPITULOS = [
  { desde: 0, hasta: 8, fn: swing, cam: { ang: 70, alt: 1.1, r: 3.7, mira: .78 } },
  { desde: 8, hasta: 16, fn: goblet, cam: { ang: 24, alt: 1.0, r: 3.5, mira: .72 } },
  { desde: 16, hasta: 24, fn: press, cam: { ang: -30, alt: 1.25, r: 4.3, mira: 1.0 } }
];

function mezcla(a, b, k) {
  if (typeof a === 'number') return lerp(a, b, k);
  if (typeof a === 'string') return k < .5 ? a : b;
  const o = {};
  for (const key in a) o[key] = mezcla(a[key], b[key], k);
  return o;
}

function aplicar(p) {
  espalda.rotation.x = D(p.lean);
  for (const [B, q, lado] of [[BD, p.d, -1], [BI, p.i, 1]]) {
    B.hombro.rotation.set(-D(q.hombroF), 0, lado * D(q.abre) * -1 * -1);
    B.hombro.rotation.z = D(q.abre) * lado;
    B.codo.rotation.x = -D(q.codo);
  }
  const hf = p.caderaF, kf = p.rodilla;
  for (const [P, lado] of [[PD, -1], [PI, 1]]) {
    P.cadera.rotation.set(-D(hf), 0, D(p.apertura) * lado * .5);
    P.rodilla.rotation.x = D(kf);
    P.tobillo.rotation.x = D(hf - kf);
  }
  const a = D(hf), b = D(hf - kf);
  const cosZ = Math.cos(D(p.apertura * .5));
  raiz.position.y = (L.muslo * Math.cos(a) + L.pierna * Math.cos(b)) * cosZ + L.tobillo;
  raiz.position.z = -(L.muslo * Math.sin(a) + L.pierna * Math.sin(b));
}

const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), q = new THREE.Quaternion();
const ARRIBA = new THREE.Vector3(0, 1, 0);
// Dónde va la kettlebell según el ejercicio (posición del punto de agarre y hacia dónde apunta el asa)
function agarre(modo) {
  scene.updateMatrixWorld(true);
  const md = BD.mano.getWorldPosition(new THREE.Vector3()), mi = BI.mano.getWorldPosition(new THREE.Vector3());
  if (modo === 'swing') {
    const m = md.clone().add(mi).multiplyScalar(.5);
    const h = BD.hombro.getWorldPosition(tmp).add(BI.hombro.getWorldPosition(tmp2)).multiplyScalar(.5);
    const dir = h.sub(m).normalize(); // del peso hacia los hombros
    return { pos: m, up: dir, y: 1.1 };
  }
  if (modo === 'goblet') {
    const m = md.clone().add(mi).multiplyScalar(.5);
    return { pos: m.add(new THREE.Vector3(0, .02, .02)), up: new THREE.Vector3(0, 1, .12).normalize(), y: 1.0 };
  }
  // press: asa en la mano derecha, bola apoyada detrás del antebrazo
  const ante = BD.mano.getWorldPosition(new THREE.Vector3()).sub(BD.codo.getWorldPosition(tmp)).normalize();
  const up = new THREE.Vector3(0, 0, 1).addScaledVector(ante, -.35).normalize();
  return { pos: md, up, y: 1.12 };
}

let listo = false;
export async function preparar() {
  await document.fonts.load('900 100px Unbounded');
  usarFuente('Unbounded');
  suelo.material.map = sueloTex(); suelo.material.needsUpdate = true;
  kb = crearKettlebell({ color: '#16171A', tinta: '#C6F432', kg: 16, acabado: 'hierro', lienzo: 2048 });
  kb.grupo.scale.setScalar(ESC); scene.add(kb.grupo);
  kb.grupo.traverse(m => { if (m.isMesh) m.castShadow = true; });
  PESOS.forEach((p, i) => {
    const k = crearKettlebell({ color: p.color, tinta: '#ffffff', kg: p.kg, acabado: 'competicion' });
    k.grupo.scale.setScalar(.3); k.grupo.position.set(-2.6 + i * .42, 0, -2.3); k.grupo.rotation.y = .3;
    k.grupo.traverse(m => { if (m.isMesh) m.castShadow = m.receiveShadow = true; });
    scene.add(k.grupo); filaKB.push(k);
  });
  listo = true;
}

const TR = .55; // segundos de transición entre ejercicios
export function render(t) {
  if (!listo) return;
  let i = CAPITULOS.findIndex(c => t < c.hasta); if (i < 0) i = CAPITULOS.length - 1;
  const C = CAPITULOS[i];
  let pose = C.fn(t - C.desde), cam = C.cam, modoB = null, k = 0;
  if (i > 0 && t - C.desde < TR) {
    const P = CAPITULOS[i - 1];
    k = (t - C.desde) / TR; k = k * k * (3 - 2 * k);
    const pa = P.fn(P.hasta - P.desde);
    modoB = pa.kb;
    pose = mezcla(pa, pose, k);
    cam = mezcla(P.cam, C.cam, k);
  }
  aplicar(pose);
  let g = agarre(pose.kb);
  if (modoB && modoB !== pose.kb) {
    aplicar(pose); const gb = agarre(modoB);
    g = { pos: gb.pos.lerp(g.pos, k), up: gb.up.lerp(g.up, k).normalize(), y: lerp(gb.y, g.y, k) };
  }
  q.setFromUnitVectors(ARRIBA, g.up);
  kb.grupo.quaternion.copy(q);
  kb.grupo.position.copy(g.pos).sub(new THREE.Vector3(0, g.y * ESC, 0).applyQuaternion(q));

  // Cámara: órbita lenta dentro de cada capítulo
  const ang = D(cam.ang + Math.sin(t * .35) * 6);
  camera.position.set(Math.sin(ang) * cam.r, cam.alt + .25, Math.cos(ang) * cam.r);
  camera.lookAt(0, cam.mira, -.1);
  renderer.render(scene, camera);
}
export const lienzo = renderer.domElement;
