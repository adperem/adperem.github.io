// Fotos reales (ver creditos.html) que sustituyen a los emojis de contenido.
// Los juegos siguen usando emojis (o claves) como identificadores; aquí se traducen a imágenes.
// Las fotos están en img/<clave>.webp. Si falta alguna, se muestra el emoji como reserva.
import { RECORTES, FOTOS_COMPLETAS } from './fotos-lista.js';

const EMOJI = {
  '🍎': 'manzana', '🍌': 'platano', '🚗': 'coche', '✏': 'lapiz', '🔨': 'martillo', '🍩': 'donut', '📕': 'libro',
  '🧽': 'esponja', '🐇': 'conejo', '🐰': 'conejo', '🐢': 'tortuga', '🐎': 'caballo', '🐴': 'caballo', '🦄': 'caballo',
  '🧸': 'osito', '👙': 'banador', '🩱': 'banador', '🗑': 'papelera', '👂': 'oreja', '😀': 'cara-contenta',
  '😢': 'cara-triste', '🎂': 'cumpleanos', '🍓': 'fresa', '🍒': 'cerezas', '🍅': 'tomate', '🚒': 'camion-bomberos',
  '🌹': 'rosa', '🎈': 'globo', '🥦': 'brocoli', '🍋': 'limon', '🐸': 'rana', '🌻': 'girasol', '🍇': 'uvas', '🐳': 'ballena',
  '🌽': 'maiz', '🍪': 'galleta', '🍐': 'pera', '🍊': 'naranja', '🐘': 'elefante', '🐶': 'perro', '🐱': 'gato',
  '🌳': 'arbol', '🦒': 'jirafa', '🦆': 'pato', '🐟': 'pez', '⚽': 'balon', '🐦': 'pajaro', '🐿': 'ardilla', '🕒': 'reloj',
  '📦': 'caja', '🧀': 'queso', '🖼': 'cuadro', '🌧': 'lluvia', '☁': 'nube', '🧱': 'bloques', '🪀': 'yoyo',
  '🚂': 'tren-juguete', '🦖': 'dinosaurio-juguete', '🪁': 'cometa', '📄': 'folio', '🗞': 'periodico',
  '📃': 'papel-arrugado', '🧺': 'cesta', '🌷': 'tulipan', '🏠': 'casa', '🐝': 'abeja', '🐥': 'pollito', '🐤': 'pollito',
  '🐔': 'gallina', '🌾': 'trigo', '🍽': 'plato-comida', '🐨': 'koala', '🦊': 'zorro', '🐻': 'oso', '🐼': 'panda',
  '🐯': 'tigre', '🦁': 'leon', '🐮': 'vaca', '🐷': 'cerdo', '🐵': 'mono', '🐧': 'pinguino', '🐞': 'mariquita',
  '🦋': 'mariposa', '🐙': 'pulpo', '🐬': 'delfin', '🦉': 'buho', '🦔': 'erizo'
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
