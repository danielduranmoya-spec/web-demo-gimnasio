# HIERRO 06 · web interactiva 3D (concepto)

Web de un gimnasio **ficticio** en Mérida (Badajoz): un club de fuerza con kettlebells, halterofilia y clases en grupos de seis. Es una demo de la tarifa *Web interactiva 3D (desde 1.690 €)* del portfolio de Daniel Durán. Nombres, dirección, teléfono, coaches y precios son inventados.

Web publicada (cuando se active GitHub Pages): https://danielduranmoya-spec.github.io/web-demo-gimnasio/

```
web-demo-gimnasio/
├── index.html          ← estructura, textos, SEO (metadatos, Open Graph y datos estructurados)
├── style.css           ← estilos: colores, tipografías y medidas al principio, en :root
├── script.js           ← menú, golpe del titular, vídeo interactivo, horario, 1RM, tarifas, tienda, cookies
├── escena.js           ← escenas 3D con three.js: kettlebell que cae (inicio) y kettlebell configurable (tienda)
├── kettlebell.js       ← la kettlebell 3D hecha con código (sin modelos descargados)
├── media/
│   ├── clase-vulcano.mp4   ← vídeo de 24 s con el coach 3D Vulcano (swing, sentadilla goblet y press)
│   ├── clase-poster.jpg
│   ├── og.jpg              ← imagen para compartir en redes (1200 × 630)
│   └── icono-180.png
├── herramientas/render-clase/  ← cómo se generó el vídeo (Playwright + ffmpeg)
├── aviso-legal.html · privacidad.html · cookies.html   ← plantillas: completa los campos [PENDIENTE]
├── robots.txt · sitemap.xml
└── favicon.svg
```

## Lo que tiene

- **Inicio «Slam Dunk»** (inspirado en la plantilla *Slam Dunk* de motionsites.ai): una kettlebell 3D de 24 kg cae a plomo, aplasta un poco, agrieta el suelo con luz volt, levanta polvo de tiza y lanza dos ondas expansivas. La cámara tiembla y las letras del titular saltan en orden desde el punto del golpe. Se vuelve a soltar tocando la kettlebell o con «Soltar otra vez».
- **Vídeo interactivo** con Vulcano, un maniquí 3D articulado: capítulos, contador de repeticiones, consejos que aparecen sobre el cuerpo y pausan el vídeo al tocarlos, cámara lenta, bucle de un ejercicio, modo espejo, pantalla completa y atajos de teclado.
- **Tienda 3D**: kettlebell de competición (mismo tamaño, color por peso) o de hierro fundido (crece con el peso). Se gira arrastrando; al cambiar de peso salta, gira y cae. Reserva por WhatsApp.
- **Horario** por día y tipo de clase con reserva por WhatsApp, **calculadora 1RM**, **tarifas** mensual/trimestral/anual, coaches, preguntas frecuentes, estado «abierto ahora» y formulario de semana gratis.
- **Todas las pantallas**: móvil, tableta y ordenador. Con *movimiento reducido* no hay caída ni temblores. Sin WebGL, una kettlebell dibujada cae con CSS.
- **SEO**: título y descripción, canonical, Open Graph con imagen, datos estructurados `ExerciseGym` y `FAQPage`, sitemap y robots. La demo lleva `noindex` para no aparecer en Google como si fuera un gimnasio real: bórralo en `index.html` para un cliente.

## Abrirla en local

```bash
git clone https://github.com/danielduranmoya-spec/web-demo-gimnasio.git
cd web-demo-gimnasio && npx serve .
```

Las escenas 3D son módulos de JavaScript: no funcionan abriendo el archivo con doble clic.

## Qué cambiar para un cliente real

- **Teléfono, WhatsApp, horario, clases, consejos del vídeo y precios de la tienda**: `CONFIG`, `SEMANA`, `CONSEJOS` y `KB` al principio de `script.js`. Cambia también el teléfono y la dirección del JSON-LD en `index.html`.
- **Colores y tipografías**: variables de `:root` en `style.css` (Unbounded + Familjen Grotesk; volt `#C6F432` sobre carbón `#0D0E0C`).
- **La kettlebell del inicio**: color, número y acabado en `escenaInicio()` de `escena.js`.
- **Barra «Concepto»** y nota de nombres ficticios: bórralas.
- **Vídeo**: sustituye `media/clase-vulcano.mp4` por un vídeo real del gimnasio (16:9) y ajusta `CAPITULOS` y `CONSEJOS`.

## Servicios externos

three.js 0.186.1 desde jsDelivr y fuentes de Google Fonts. El mapa de OpenStreetMap solo se carga si se acepta. No hay analítica ni cookies de seguimiento.

## Publicar

GitHub Pages desde la rama `main`, carpeta raíz.
