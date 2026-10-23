/* =========================================================
   HIERRO 06 · kettlebell 3D hecha con código (three.js)

   No descarga ningún modelo: el cuerpo es un torno (lathe),
   el asa un tubo y el número se dibuja en un lienzo que hace
   de color y de relieve a la vez. Lo usan la escena del
   inicio, la tienda y el render del vídeo de la clase.
   ========================================================= */
import * as THREE from 'three';

// Colores de competición (norma IKSFA): cada peso tiene su color y todas miden lo mismo.
export const PESOS = [
  { kg: 8,  color: '#F06AA7', nombre: 'Rosa' },
  { kg: 12, color: '#2F7DE1', nombre: 'Azul' },
  { kg: 16, color: '#F4C531', nombre: 'Amarillo' },
  { kg: 20, color: '#7B4FD8', nombre: 'Morado' },
  { kg: 24, color: '#2FA35C', nombre: 'Verde' },
  { kg: 28, color: '#F07A26', nombre: 'Naranja' },
  { kg: 32, color: '#E2363F', nombre: 'Rojo' }
];

// Perfil del cuerpo (radio, altura). Alto total con asa ≈ 1.2
const PERFIL = [
  [0, 0], [.27, 0], [.31, .008], [.36, .03], [.43, .09], [.48, .18], [.505, .29],
  [.5, .4], [.48, .5], [.44, .59], [.38, .67], [.3, .74], [.2, .79], [.1, .815], [0, .82]
];
const ASA = [
  [-.26, .7], [-.33, .84], [-.34, .98], [-.27, 1.1], [-.14, 1.17], [0, 1.185],
  [.14, 1.17], [.27, 1.1], [.34, .98], [.33, .84], [.26, .7]
];

let fuente = 'Unbounded, "Arial Black", sans-serif';
export function usarFuente(f) { fuente = f; }

// Dibuja la piel del cuerpo: color de fondo, número al frente y marca a los lados.
function pintar(canvas, { base, tinta, kg, marca, grano = true }) {
  const c = canvas.getContext('2d', { willReadFrequently: true });
  const W = canvas.width, H = canvas.height;
  c.fillStyle = base; c.fillRect(0, 0, W, H);
  // grano de pintura en polvo
  if (grano) {
  const img = c.getImageData(0, 0, W, H), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - .5) * 14;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  c.putImageData(img, 0, 0);
  }
  c.fillStyle = tinta;
  c.textAlign = 'center'; c.textBaseline = 'middle';
  // u = .5 es el frente; v sube desde la base (en el lienzo, y = H es la base)
  const y = H * (1 - .44);
  c.font = `900 ${H * .3}px ${fuente}`;
  c.fillText(String(kg), W * .5, y - H * .03);
  c.font = `700 ${H * .075}px ${fuente}`;
  c.fillText('KG', W * .5, y + H * .17);
  c.font = `800 ${H * .07}px ${fuente}`;
  for (const u of [.18, .82]) c.fillText(marca, W * u, y);
  c.fillRect(W * .32, H * .86, W * .36, H * .012);
}

function relieve(canvas, kg, marca) {
  // Mismo dibujo en blanco sobre negro: el número queda en relieve.
  pintar(canvas, { base: '#000', tinta: '#fff', kg, marca, grano: false });
  const c = canvas.getContext('2d');
  const img = c.getImageData(0, 0, canvas.width, canvas.height), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const v = d[i] > 128 ? 255 : 0; d[i] = d[i + 1] = d[i + 2] = v; }
  c.putImageData(img, 0, 0);
}

/**
 * Crea una kettlebell.
 * @param {object} o
 * @param {string} o.color  color de la pintura
 * @param {string} o.tinta  color del número
 * @param {number} o.kg
 * @param {string} o.acabado 'competicion' | 'hierro'
 * @param {number} o.lienzo  ancho del lienzo de la piel (1024 en móvil, 2048 en ordenador)
 */
export function crearKettlebell(o = {}) {
  const opt = { color: '#16171A', tinta: '#C6F432', kg: 16, acabado: 'hierro', lienzo: 1024, marca: 'HIERRO 06', ...o };
  const grupo = new THREE.Group();
  grupo.name = 'kettlebell';

  const puntos = PERFIL.map(([r, y]) => new THREE.Vector2(r, y));
  const cuerpoGeo = new THREE.LatheGeometry(puntos, 96, -Math.PI, Math.PI * 2);

  const piel = document.createElement('canvas');
  piel.width = opt.lienzo; piel.height = opt.lienzo / 2;
  const bump = document.createElement('canvas');
  bump.width = piel.width / 2; bump.height = piel.height / 2;

  const mapa = new THREE.CanvasTexture(piel);
  mapa.colorSpace = THREE.SRGBColorSpace;
  mapa.anisotropy = 8;
  const mapaRelieve = new THREE.CanvasTexture(bump);

  const pinturaMat = new THREE.MeshPhysicalMaterial({
    map: mapa, bumpMap: mapaRelieve, bumpScale: 1.4,
    roughness: .5, metalness: .15, clearcoat: .55, clearcoatRoughness: .35
  });
  const cuerpo = new THREE.Mesh(cuerpoGeo, pinturaMat);
  cuerpo.castShadow = true; cuerpo.receiveShadow = true;
  grupo.add(cuerpo);

  // Asa: tubo de acero con las puntas metidas en el cuerpo
  const curva = new THREE.CatmullRomCurve3(ASA.map(([x, y]) => new THREE.Vector3(x, y, 0)));
  const asaGeo = new THREE.TubeGeometry(curva, 96, .058, 24, false);
  const aceroMat = new THREE.MeshPhysicalMaterial({ color: 0xb9bdc0, metalness: .92, roughness: .32 });
  const asaMat = pinturaMat.clone();
  asaMat.map = null; asaMat.bumpMap = null;
  const asa = new THREE.Mesh(asaGeo, asaMat);
  asa.castShadow = true;
  grupo.add(asa);

  // Base: anillo plano de apoyo
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.27, .27, .012, 64), aceroMat);
  base.position.y = .004;
  grupo.add(base);

  const api = {
    grupo, cuerpo, asa,
    alto: 1.185,
    set({ color, tinta, kg, acabado } = {}) {
      if (color) opt.color = color;
      if (tinta) opt.tinta = tinta;
      if (kg) opt.kg = kg;
      if (acabado) opt.acabado = acabado;
      pintar(piel, { base: opt.color, tinta: opt.tinta, kg: opt.kg, marca: opt.marca });
      relieve(bump, opt.kg, opt.marca);
      mapa.needsUpdate = true; mapaRelieve.needsUpdate = true;
      const hierro = opt.acabado === 'hierro';
      // El hierro fundido es mate y con asa del mismo color; la competición lleva asa de acero.
      pinturaMat.roughness = hierro ? .72 : .42;
      pinturaMat.clearcoat = hierro ? .08 : .6;
      pinturaMat.metalness = hierro ? .35 : .1;
      asa.material = hierro ? asaMat : aceroMat;
      asaMat.color.set(opt.color);
      asaMat.roughness = .6; asaMat.metalness = .45;
      return api;
    },
    dispose() {
      grupo.traverse(m => { if (m.geometry) m.geometry.dispose(); });
      [pinturaMat, asaMat, aceroMat, mapa, mapaRelieve].forEach(x => x.dispose());
    }
  };
  return api.set();
}
