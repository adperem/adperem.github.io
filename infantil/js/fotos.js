// Fotos reales (Pixabay) que sustituyen a los emojis de contenido.
// Los juegos siguen usando emojis (o claves) como identificadores; aquí se traducen a imágenes.
// Las fotos están en img/<clave>.webp. Si falta alguna, se muestra el emoji como reserva.
import { RECORTES, FOTOS_COMPLETAS } from './fotos-lista.js';

const EMOJI = {
  '🍎': 'manzana', '🍌': 'platano', '🚗': 'coche', '🧼': 'jabon', '🙌': 'lavar-manos', '😁': 'dientes',
  '🪥': 'cepillo-dientes', '✏': 'lapiz', '🥕': 'zanahoria', '🍲': 'sopa', '🥄': 'cuchara', '🧦': 'calcetin',
  '🔨': 'martillo', '🍭': 'piruleta', '🍩': 'donut', '🤧': 'sonar-nariz', '🧻': 'panuelo', '📕': 'libro',
  '🍕': 'pizza', '💧': 'vaso-agua', '🧽': 'esponja', '👟': 'zapatilla',
  '🐇': 'conejo', '🐰': 'conejo', '🐢': 'tortuga', '🐌': 'caracol', '🐆': 'guepardo', '🚀': 'cohete',
  '🐎': 'caballo', '🐴': 'caballo', '🦄': 'caballo', '🏎': 'coche-carreras', '🚜': 'tractor', '🥁': 'tambor',
  '🏃': 'nino-corriendo', '🚴': 'nino-bici', '🤸': 'nino-voltereta', '💃': 'nina-bailando', '🏊': 'nino-nadando',
  '⛹': 'nino-saltando', '🛌': 'nino-cama', '😴': 'nino-dormido', '🧘': 'nino-sentado',
  '🧸': 'osito', '🥶': 'nino-frio', '🧥': 'abrigo', '🩳': 'pantalon-corto', '👙': 'banador', '🩱': 'banador',
  '✋': 'mano', '🖐': 'mano', '👐': 'mano', '🤏': 'raton', '🧤': 'guantes', '👒': 'sombrero-paja', '🩴': 'chanclas',
  '🧣': 'bufanda', '🕶': 'gafas-sol', '🪝': 'perchero', '🗑': 'papelera', '🛁': 'banera', '☀': 'sol', '🦶': 'pie',
  '👂': 'oreja', '👁': 'ojo', '👃': 'nariz',
  '😀': 'cara-contenta', '😢': 'cara-triste', '🎂': 'cumpleanos', '🤗': 'abrazo', '👦': 'nino', '🧒': 'nino',
  '🍓': 'fresa', '🍒': 'cerezas', '🍅': 'tomate', '🚒': 'camion-bomberos', '🌹': 'rosa', '🎈': 'globo',
  '🥦': 'brocoli', '🍋': 'limon', '🐸': 'rana', '🌻': 'girasol', '🍇': 'uvas', '🐳': 'ballena', '🌽': 'maiz',
  '🍪': 'galleta', '🍐': 'pera', '🍊': 'naranja', '🐘': 'elefante', '🐶': 'perro', '🐱': 'gato', '🌳': 'arbol',
  '🦒': 'jirafa', '🦆': 'pato', '🐟': 'pez', '⚽': 'balon', '🐦': 'pajaro', '🐿': 'ardilla',
  '🕒': 'reloj', '📦': 'caja', '🧀': 'queso', '🖼': 'cuadro',
  '🍂': 'hoja-seca', '🍁': 'hoja-roja', '🍃': 'hoja-verde', '❄': 'copo-nieve', '🍉': 'sandia', '🌧': 'lluvia',
  '☂': 'paraguas', '🌰': 'castana', '🍄': 'seta', '⛄': 'muneco-nieve', '🏖': 'playa', '🎒': 'mochila', '☁': 'nube',
  '🌬': 'viento', '🧱': 'bloques', '🪀': 'yoyo', '🚂': 'tren-juguete', '🦖': 'dinosaurio-juguete', '🪁': 'cometa',
  '📄': 'folio', '🗞': 'periodico', '📃': 'papel-arrugado', '🧺': 'cesta', '🌷': 'tulipan', '🏠': 'casa', '🐝': 'abeja',
  '🐥': 'pollito', '🐤': 'pollito', '😋': 'nino-comiendo', '🐔': 'gallina', '🌾': 'trigo', '🍽': 'plato-comida',
  '🐺': 'lobo', '🧹': 'escoba', '🍼': 'biberon', '🔘': 'boton', '🐭': 'raton', '🎻': 'violin', '🌙': 'luna',
  '🌟': 'noche-estrellas', '🐨': 'koala', '🗿': 'estatua', '🎲': 'dado', '🌱': 'brote', '🌿': 'planta', '🪴': 'maceta',
  '🤝': 'manos-juntas', '🗣': 'nino-hablando', '📖': 'libro-abierto', '🎨': 'paleta', '🎤': 'microfono',
  '🦊': 'zorro', '🐻': 'oso', '🐼': 'panda', '🐯': 'tigre', '🦁': 'leon', '🐮': 'vaca', '🐷': 'cerdo', '🐵': 'mono',
  '🐧': 'pinguino', '🐞': 'mariquita', '🦋': 'mariposa', '🐙': 'pulpo', '🐬': 'delfin', '🦉': 'buho', '🦔': 'erizo'
};

const RECORTE = new Set(RECORTES);
const COMPLETA = new Set(FOTOS_COMPLETAS);

// Devuelve { clave, recorte } si hay foto para ese emoji o clave; si no, null.
export function fotoDe(x) {
  const clave = RECORTE.has(x) || COMPLETA.has(x) ? x : EMOJI[String(x).replace(/️/g, '')];
  if (!clave || !(RECORTE.has(clave) || COMPLETA.has(clave))) return null;
  return { clave, recorte: RECORTE.has(clave), src: `img/${clave}.webp` };
}

const cache = new Map();
export function cargarFoto(x) {
  const f = fotoDe(x);
  if (!f) return Promise.resolve(null);
  if (!cache.has(f.clave)) {
    cache.set(f.clave, new Promise(resolve => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () => resolve(null);
      im.src = f.src;
    }));
  }
  return cache.get(f.clave);
}
