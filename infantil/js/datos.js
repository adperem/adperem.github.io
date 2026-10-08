// Criterios de evaluación del 1er trimestre (1º de Infantil) y actividades que los trabajan.
// tipo: 'juego'       -> el juego da una evaluación objetiva (aciertos a la primera)
//       'mixto'       -> el juego aporta evidencias, pero el profe debe confirmarlo observando
//       'observacion' -> la actividad sirve de apoyo; la evaluación la hace el profe

export const AREAS = [
  {
    id: 'ca',
    nombre: 'Crecimiento en armonía',
    color: 'var(--ca)',
    criterios: [
      { id: 'ca1', n: 1, texto: 'Adquiere autonomía en actividades de higiene y alimentación.', tipo: 'mixto' },
      { id: 'ca2', n: 2, texto: 'Colabora en mantener el aula limpia y ordenada.', tipo: 'mixto' },
      { id: 'ca3', n: 3, texto: 'Desarrolla movimientos corporales: deprisa / despacio.', tipo: 'mixto' },
      { id: 'ca4', n: 4, texto: 'Diferencia entre movimiento y reposo.', tipo: 'juego' },
      { id: 'ca5', n: 5, texto: 'Aprende a trabajar de forma cooperativa.', tipo: 'observacion' },
      { id: 'ca6', n: 6, texto: 'Se pone y se quita el abrigo solo.', tipo: 'mixto' },
      { id: 'ca7', n: 7, texto: 'Identifica las emociones de alegría y tristeza.', tipo: 'juego' }
    ]
  },
  {
    id: 'de',
    nombre: 'Descubrimiento y exploración del entorno',
    color: 'var(--de)',
    criterios: [
      { id: 'de1', n: 1, texto: 'Reconoce el color rojo.', tipo: 'juego' },
      { id: 'de2', n: 2, texto: 'Diferencia y aplica los cuantificadores: uno / ninguno.', tipo: 'juego' },
      { id: 'de3', n: 3, texto: 'Discrimina los tamaños: grande / pequeño.', tipo: 'juego' },
      { id: 'de4', n: 4, texto: 'Reconoce el número 1 y asocia su cantidad y grafía.', tipo: 'juego' },
      { id: 'de5', n: 5, texto: 'Realiza series de dos colores.', tipo: 'juego' },
      { id: 'de6', n: 6, texto: 'Diferencia la situación de los objetos: dentro / fuera.', tipo: 'juego' },
      { id: 'de7', n: 7, texto: 'Identifica la posición de los objetos: arriba / abajo.', tipo: 'juego' },
      { id: 'de8', n: 8, texto: 'Reconoce e identifica el círculo.', tipo: 'juego' },
      { id: 'de9', n: 9, texto: 'Identifica los cambios en el entorno que se producen en el otoño.', tipo: 'juego' }
    ]
  },
  {
    id: 'cr',
    nombre: 'Comunicación y representación de la realidad',
    color: 'var(--cr)',
    criterios: [
      { id: 'cr1', n: 1, texto: 'Utiliza el vocabulario trabajado.', tipo: 'juego' },
      { id: 'cr2', n: 2, texto: 'Realiza la grafía del número 1.', tipo: 'juego' },
      { id: 'cr3', n: 3, texto: 'Realiza trazos verticales y horizontales.', tipo: 'juego' },
      { id: 'cr4', n: 4, texto: 'Sabe escuchar en silencio un cuento.', tipo: 'mixto' },
      { id: 'cr5', n: 5, texto: 'Experimenta con las técnicas plásticas.', tipo: 'observacion' },
      { id: 'cr6', n: 6, texto: 'Aprende una canción y la canta con gestos y movimientos.', tipo: 'observacion' },
      { id: 'cr7', n: 7, texto: 'Desarrolla el gusto por las audiciones musicales y piezas clásicas.', tipo: 'observacion' },
      { id: 'cr8', n: 8, texto: 'Disfruta del uso de las TIC.', tipo: 'observacion' }
    ]
  }
];

export const CRITERIOS = Object.fromEntries(
  AREAS.flatMap(a => a.criterios.map(c => [c.id, { ...c, area: a.id, codigo: `${a.id.toUpperCase()}${c.n}` }]))
);

export const TIPOS = {
  juego: { icono: '🎮', texto: 'Lo evalúa el juego' },
  mixto: { icono: '🎮👀', texto: 'Juego + observación del profe' },
  observacion: { icono: '👀', texto: 'Observación del profe' }
};

const q = id => `juego.html?j=${id}`;

export const ACTIVIDADES = [
  { id: 'higiene', titulo: 'Limpios y sanos', icono: '🧼', area: 'ca', criterios: ['ca1'], url: q('higiene') },
  { id: 'recoger', titulo: 'Recogemos la clase', icono: '🧸', area: 'ca', criterios: ['ca2'], url: 'recoger.html' },
  { id: 'deprisa', titulo: 'Deprisa y despacio', icono: '🐇', area: 'ca', criterios: ['ca3'], url: q('deprisa') },
  { id: 'tambor', titulo: 'El tambor mágico', icono: '🥁', area: 'ca', criterios: ['ca3', 'ca4'], url: 'tambor.html', grupo: true },
  { id: 'reposo', titulo: '¿Quién se mueve?', icono: '🏃', area: 'ca', criterios: ['ca4'], url: q('reposo') },
  { id: 'juntos', titulo: 'Crecemos juntos', icono: '🤝', area: 'ca', criterios: ['ca5'], url: 'juntos.html', grupo: true },
  { id: 'abrigo', titulo: 'Viste al osito', icono: '🧥', area: 'ca', criterios: ['ca6'], url: q('abrigo') },
  { id: 'emociones', titulo: 'Contento o triste', icono: '😀', area: 'ca', criterios: ['ca7'], url: q('emociones') },

  { id: 'rojo', titulo: 'El color rojo', icono: '🍎', area: 'de', criterios: ['de1'], url: q('rojo') },
  { id: 'uno-ninguno', titulo: 'Uno o ninguno', icono: 'plato-comida', area: 'de', criterios: ['de2'], url: q('uno-ninguno') },
  { id: 'tamanos', titulo: 'Grande y pequeño', icono: '🐘', area: 'de', criterios: ['de3'], url: q('tamanos') },
  { id: 'numero1', titulo: 'El número 1', icono: '1️⃣', area: 'de', criterios: ['de4'], url: q('numero1') },
  { id: 'series', titulo: 'Series de colores', icono: '🔴', area: 'de', criterios: ['de5'], url: q('series') },
  { id: 'dentro', titulo: 'Dentro y fuera', icono: '📦', area: 'de', criterios: ['de6'], url: q('dentro') },
  { id: 'arriba', titulo: 'Arriba y abajo', icono: '⬆️', area: 'de', criterios: ['de7'], url: q('arriba') },
  { id: 'circulo', titulo: 'El círculo', icono: '⭕', area: 'de', criterios: ['de8'], url: q('circulo') },
  { id: 'otono', titulo: 'Llega el otoño', icono: '🍂', area: 'de', criterios: ['de9'], url: q('otono') },

  { id: 'vocabulario', titulo: '¿Dónde está?', icono: '🗣️', area: 'cr', criterios: ['cr1'], url: q('vocabulario') },
  { id: 'trazo-uno', titulo: 'Escribo el 1', icono: '✏️', area: 'cr', criterios: ['cr2'], url: 'trazar.html?modo=uno' },
  { id: 'trazos', titulo: 'Lluvia y caminos', icono: '🌧️', area: 'cr', criterios: ['cr3'], url: 'trazar.html?modo=lineas' },
  { id: 'cuento', titulo: 'El cuento de Otoñita', icono: '📖', area: 'cr', criterios: ['cr4'], url: 'cuento.html' },
  { id: 'pintar', titulo: 'Pintamos', icono: '🎨', area: 'cr', criterios: ['cr5'], url: 'pintar.html' },
  { id: 'cancion', titulo: 'Cantamos', icono: '🎤', area: 'cr', criterios: ['cr6'], url: 'cancion.html', grupo: true },
  { id: 'musica', titulo: 'Música clásica', icono: '🎻', area: 'cr', criterios: ['cr7'], url: 'musica.html' }
];

export const actividadesDe = criterio => ACTIVIDADES.filter(a => a.criterios.includes(criterio));
