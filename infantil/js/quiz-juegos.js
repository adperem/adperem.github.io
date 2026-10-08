// Juegos de "escucha y toca": cada uno genera rondas nuevas (aleatorias) en cada partida.
// Ronda: { voz, escena?, opciones: [{ html, ok }], criterio?, audio? }
import { E, COLORES, caja, mesa, arbol, plato, forma, bola, hueco, arbolEstacion, grupo, numero } from './dibujos.js';
import { shuffle, pick, sample, tambor } from './comun.js';

const op = (html, ok = false) => ({ html, ok });
const conTexto = (emoji, texto) => `${E(emoji)}<small>${texto}</small>`;

export const JUEGOS_QUIZ = {
  higiene: {
    titulo: 'Limpios y sanos', icono: '🧼', criterio: 'ca1',
    intro: 'Vamos a cuidarnos. Escucha y toca la respuesta.',
    rondas: () => sample([
      { voz: '¿Con qué nos lavamos las manos?', escena: E('🙌'), opciones: [op(E('🧼'), true), op(E('🍌')), op(E('🚗'))] },
      { voz: '¿Con qué nos lavamos los dientes?', escena: E('😁'), opciones: [op(E('🪥'), true), op(E('✏️')), op(E('🥕'))] },
      { voz: '¿Con qué comemos la sopa?', escena: E('🍲'), opciones: [op(E('🥄'), true), op(E('🧦')), op(E('🎲'))] },
      { voz: '¿Qué alimento es más sano?', opciones: [op(E('🍎'), true), op(E('🍭')), op(E('🍩'))] },
      { voz: 'Tenemos mocos. ¿Qué usamos para limpiarnos la nariz?', escena: E('🤧'), opciones: [op(E('🧻'), true), op(E('📕')), op(E('🍕'))] },
      { voz: 'Tenemos sed. ¿Qué bebemos?', opciones: [op(E('💧'), true), op(E('🧽')), op(E('👟'))] }
    ], 5)
  },

  deprisa: {
    titulo: 'Deprisa y despacio', icono: '🐇', criterio: 'ca3',
    intro: 'Unos van deprisa y otros van despacio. ¡Escucha bien!',
    rondas: () => {
      const visuales = sample([
        ['deprisa', '🐇', '🐢'], ['despacio', '🐌', '🐆'], ['deprisa', '🚀', '🐌'],
        ['despacio', '🐢', '🐎'], ['deprisa', '🏎️', '🚜']
      ], 3).map(([p, bien, mal]) => ({ voz: `¿Quién va ${p}?`, opciones: [op(E(bien), true), op(E(mal))] }));
      const auditivas = shuffle(['deprisa', 'despacio']).map(p => ({
        voz: 'Escucha el tambor. ¿Va deprisa o despacio?',
        escena: E('🥁'),
        audio: () => (p === 'deprisa' ? tambor(220, 14) : tambor(52, 5)),
        opciones: [op(conTexto('🐇', 'deprisa'), p === 'deprisa'), op(conTexto('🐢', 'despacio'), p === 'despacio')]
      }));
      return shuffle([...visuales, ...auditivas]);
    }
  },

  reposo: {
    titulo: '¿Quién se mueve?', icono: '🏃', criterio: 'ca4',
    intro: 'Unos niños se mueven y otros están quietos, descansando.',
    rondas: () => {
      const mueven = ['🏃', '🚴', '🤸', '💃', '🏊', '⛹️'];
      const quietos = ['🛌', '😴', '🧘'];
      return shuffle(['quieto', 'quieto', 'mueve', 'mueve', pick(['quieto', 'mueve'])]).map(t => t === 'quieto'
        ? { voz: 'Toca al que está quieto, descansando.', opciones: [op(E(pick(quietos)), true), ...sample(mueven, 2).map(m => op(E(m)))] }
        : { voz: 'Toca al que se está moviendo.', opciones: [op(E(pick(mueven)), true), ...sample(quietos, 2).map(q => op(E(q)))] });
    }
  },

  abrigo: {
    titulo: 'Viste al osito', icono: '🧥', criterio: 'ca6',
    intro: 'Vamos a ayudar al osito a vestirse.',
    rondas: () => shuffle([
      { voz: 'Hace frío y el osito sale al patio. ¿Qué se pone?', escena: `${E('🧸')}${E('nieve')}`, opciones: [op(E('🧥'), true), op(E('🩳')), op(E('🩴'))] },
      { voz: 'Al osito se le enfrían las manos. ¿Qué se pone?', escena: `${E('🧸')}${E('✋')}`, opciones: [op(E('🧤'), true), op(E('👒')), op(E('🩴'))] },
      { voz: 'Al osito le duele el cuello del frío. ¿Qué se pone?', escena: E('🧸'), opciones: [op(E('🧣'), true), op(E('🕶️')), op(E('👟'))] },
      { voz: 'Ya está en clase. ¿Dónde cuelga el abrigo?', escena: `${E('🧸')}${E('🧥')}`, opciones: [op(E('🪝'), true), op(E('🗑️')), op(E('🛁'))] },
      { voz: 'Hace calor. ¿Qué se quita el osito?', escena: `${E('🧸')}${E('☀️')}`, opciones: [op(E('🧥'), true), op(E('🦶')), op(E('👂'))] }
    ])
  },

  emociones: {
    titulo: 'Contento o triste', icono: '😀', criterio: 'ca7',
    intro: 'A veces estamos contentos y a veces estamos tristes.',
    rondas: () => {
      const caras = () => [op(E('😀'), true), op(E('😢'))];
      const triste = () => [op(E('😢'), true), op(E('😀'))];
      const situaciones = sample([
        { voz: '¡Es su cumpleaños! ¿Cómo está?', escena: E('cumpleanos'), opciones: caras() },
        { voz: 'Se le ha caído el helado al suelo. ¿Cómo está?', escena: E('helado-caido'), opciones: triste() },
        { voz: 'Su juguete se ha roto. ¿Cómo está?', escena: E('juguete-roto'), opciones: triste() },
        { voz: 'Juega con sus amigos a la pelota. ¿Cómo está?', escena: E('jugar-pelota'), opciones: caras() },
        { voz: 'Se ha caído y se ha hecho daño en la rodilla. ¿Cómo está?', escena: E('rodilla'), opciones: triste() },
        { voz: 'Su abuela le da un abrazo muy grande. ¿Cómo está?', escena: E('abrazo-abuela'), opciones: caras() }
      ], 3);
      return shuffle([
        { voz: 'Toca la cara contenta.', opciones: caras() },
        { voz: 'Toca la cara triste.', opciones: triste() },
        ...situaciones
      ]);
    }
  },

  rojo: {
    titulo: 'El color rojo', icono: '🍎', criterio: 'de1',
    intro: 'Vamos a buscar el color rojo.',
    rondas: () => {
      const rojos = sample(['🍎', '🍓', '🍒', '🍅', '🚒', '🌹', '🎈'], 3);
      const otros = ['🍌', '🥦', '🍋', '🐸', '🌻', '🍇', '🐳', '🌽'];
      const conObjetos = rojos.map(r => ({ voz: 'Toca lo que es de color rojo.', opciones: [op(E(r), true), ...sample(otros, 2).map(o => op(E(o)))] }));
      const conPelotas = [0, 1].map(() => ({
        voz: 'Toca la pelota roja.',
        opciones: [op(forma('circulo', COLORES.rojo, 'pelota')), ...sample(['azul', 'amarillo', 'verde', 'morado'], 2)
          .map(c => op(forma('circulo', COLORES[c], 'pelota')))].map((o, i) => ({ ...o, ok: i === 0 }))
      }));
      return shuffle([...conObjetos, ...conPelotas]);
    }
  },

  'uno-ninguno': {
    titulo: 'Uno o ninguno', icono: '🍽️', criterio: 'de2',
    intro: 'Vamos a mirar los platos.',
    rondas: () => {
      const cosas = shuffle([['🍎', 'manzana'], ['🍓', 'fresa'], ['🍪', 'galleta'], ['🍐', 'pera'], ['🍊', 'naranja']]);
      const tipos = shuffle(['uno', 'uno', 'ninguno', 'ninguno', pick(['uno', 'ninguno'])]);
      return tipos.map((t, i) => {
        const [e, nombre] = cosas[i];
        return {
          voz: t === 'uno' ? `Toca el plato que tiene una ${nombre}.` : `Toca el plato que no tiene ninguna ${nombre}.`,
          opciones: [op(plato(1, e), t === 'uno'), op(plato(0, e), t === 'ninguno'), op(plato(3, e))]
        };
      });
    }
  },

  tamanos: {
    titulo: 'Grande y pequeño', icono: '🐘', criterio: 'de3',
    intro: 'Unas cosas son grandes y otras son pequeñas.',
    rondas: () => {
      const cosas = sample([
        ['🐘', 'el elefante', 'o'], ['🐶', 'el perro', 'o'], ['🐱', 'el gato', 'o'], ['🎈', 'el globo', 'o'],
        ['🍎', 'la manzana', 'a'], ['🌳', 'el árbol', 'o'], ['🚗', 'el coche', 'o'], ['🦒', 'la jirafa', 'a']
      ], 5);
      const tipos = shuffle(['grande', 'grande', 'pequeño', 'pequeño', pick(['grande', 'pequeño'])]);
      return cosas.map(([e, nombre, g], i) => {
        const grande = tipos[i] === 'grande';
        return {
          voz: `Toca ${nombre} ${grande ? 'grande' : `pequeñ${g}`}.`,
          opciones: [op(E(e, '1em'), grande), op(E(e, '.38em'), !grande)]
        };
      });
    }
  },

  numero1: {
    titulo: 'El número 1', icono: '1️⃣', criterio: 'de4',
    intro: 'Vamos a buscar el número uno.',
    rondas: () => {
      const cosas = shuffle([['🦆', 'pato'], ['🐟', 'pez'], ['⚽', 'balón'], ['🎈', 'globo'], ['🚗', 'coche']]);
      const grafia = [0, 1].map(() => ({
        voz: 'Toca el número uno.',
        opciones: [op(numero(1), true), ...sample(['3', '5', '7', '4', '8'], 2).map(n => op(numero(n)))]
      }));
      const cantidad = cosas.slice(0, 2).map(([e, nombre]) => ({
        voz: `¿Dónde hay un solo ${nombre}?`,
        opciones: [op(grupo(e, 1), true), op(grupo(e, 3)), op(grupo(e, 2))]
      }));
      const [e, nombre] = cosas[2];
      const asociar = {
        voz: `Mira: hay un ${nombre}. Toca el número uno.`,
        escena: grupo(e, 1),
        opciones: [op(numero(1), true), ...sample(['3', '5', '4'], 2).map(n => op(numero(n)))]
      };
      return shuffle([...grafia, ...cantidad, asociar]);
    }
  },

  series: {
    titulo: 'Series de colores', icono: '🔴', criterio: 'de5',
    intro: 'Mira los colores. ¿Cuál viene ahora?',
    rondas: () => {
      const parejas = shuffle([['rojo', 'azul'], ['amarillo', 'verde'], ['rojo', 'amarillo'], ['azul', 'amarillo'], ['verde', 'rojo']]);
      return parejas.map(([a, b], i) => {
        const largo = [4, 5, 4, 3, 5][i];
        const serie = Array.from({ length: largo }, (_, k) => (k % 2 === 0 ? a : b));
        const sigue = largo % 2 === 0 ? a : b;
        return {
          voz: 'Mira la serie. ¿Qué color va ahora?',
          escena: `<span class="serie">${serie.map(c => bola(COLORES[c])).join('')}${hueco}</span>`,
          opciones: [op(bola(COLORES[a]), sigue === a), op(bola(COLORES[b]), sigue === b)]
        };
      });
    }
  },

  dentro: {
    titulo: 'Dentro y fuera', icono: '📦', criterio: 'de6',
    intro: 'Vamos a jugar con la caja.',
    rondas: () => {
      const cosas = shuffle([['🐱', 'el gato'], ['🐶', 'el perro'], ['⚽', 'la pelota'], ['🧸', 'el osito'], ['🐰', 'el conejo']]);
      const tipos = shuffle(['dentro', 'dentro', 'fuera', 'fuera', pick(['dentro', 'fuera'])]);
      return cosas.map(([e, nombre], i) => ({
        voz: `Toca ${nombre} que está ${tipos[i]} de la caja.`,
        opciones: [op(caja(e, true), tipos[i] === 'dentro'), op(caja(e, false), tipos[i] === 'fuera')]
      }));
    }
  },

  arriba: {
    titulo: 'Arriba y abajo', icono: '⬆️', criterio: 'de7',
    intro: '¿Está arriba o está abajo? ¡Fíjate bien!',
    rondas: () => {
      const enMesa = shuffle([['⚽', 'la pelota'], ['🐱', 'el gato'], ['🧸', 'el osito']]);
      const enArbol = shuffle([['🐦', 'el pájaro'], ['🐿️', 'la ardilla']]);
      const tipos = shuffle(['arriba', 'arriba', 'abajo', 'abajo', pick(['arriba', 'abajo'])]);
      const rondas = [
        ...enMesa.map(([e, n]) => ({ e, n, dibujo: mesa, donde: { arriba: 'arriba, encima de la mesa', abajo: 'abajo, debajo de la mesa' } })),
        ...enArbol.map(([e, n]) => ({ e, n, dibujo: arbol, donde: { arriba: 'arriba, en el árbol', abajo: 'abajo, en el suelo' } }))
      ];
      return shuffle(rondas.map((r, i) => ({
        voz: `Toca ${r.n} que está ${r.donde[tipos[i]]}.`,
        opciones: [op(r.dibujo(r.e, true), tipos[i] === 'arriba'), op(r.dibujo(r.e, false), tipos[i] === 'abajo')]
      })));
    }
  },

  circulo: {
    titulo: 'El círculo', icono: '⭕', criterio: 'de8',
    intro: 'Vamos a buscar círculos.',
    rondas: () => {
      const colores = sample(Object.values(COLORES), 3);
      const formas = colores.map(color => ({
        voz: 'Toca el círculo.',
        opciones: [op(forma('circulo', color), true), ...sample(['cuadrado', 'triangulo', 'rectangulo'], 2).map(f => op(forma(f, color)))]
      }));
      const objetos = sample(['🍪', '🕒', '🍩', '⚽'], 2).map(r => ({
        voz: '¿Qué tiene forma de círculo?',
        opciones: [op(E(r), true), ...sample(['📕', '📦', 'porcion-pizza', '🧀', '🖼️'], 2).map(o => op(E(o)))]
      }));
      return shuffle([...formas, ...objetos]);
    }
  },

  otono: {
    titulo: 'Llega el otoño', icono: '🍂', criterio: 'de9',
    intro: 'Ha llegado el otoño. ¿Qué cambia?',
    rondas: () => shuffle([
      { voz: '¿Qué árbol es de otoño?', opciones: [op(arbolEstacion('otono'), true), op(arbolEstacion('verano')), op(arbolEstacion('invierno'))] },
      { voz: '¿Qué cae de los árboles en otoño?', escena: E('🌳'), opciones: [op(E('🍂'), true), op(E('❄️')), op(E('🍉'))] },
      { voz: 'En otoño llueve. ¿Qué usamos?', escena: E('🌧️'), opciones: [op(E('☂️'), true), op(E('🕶️')), op(E('🩴'))] },
      { voz: '¿Qué encontramos en el bosque en otoño?', opciones: [op(E(pick(['🌰', '🍄'])), true), op(E('⛄')), op(E('🏖️'))] },
      { voz: 'En otoño hace fresquito. ¿Qué ropa nos ponemos?', opciones: [op(E('🧥'), true), op(E('🕶️')), op(E('🩳'))] }
    ])
  },

  vocabulario: {
    titulo: '¿Dónde está?', icono: '🗣️', criterio: 'cr1',
    intro: 'Escucha la palabra y toca el dibujo.',
    rondas: () => {
      const palabras = [
        ['🍂', 'la hoja'], ['🌰', 'la castaña'], ['🍄', 'la seta'], ['☂️', 'el paraguas'], ['🎒', 'la mochila'],
        ['✏️', 'el lápiz'], ['📕', 'el libro'], ['🍎', 'la manzana'], ['🐿️', 'la ardilla'], ['✋', 'la mano'],
        ['👁️', 'el ojo'], ['👃', 'la nariz'], ['👂', 'la oreja'], ['🦶', 'el pie'], ['🌳', 'el árbol'],
        ['☁️', 'la nube'], ['🧥', 'el abrigo'], ['🪥', 'el cepillo de dientes']
      ];
      const objetivos = sample(palabras, 6);
      return objetivos.map(([e, nombre]) => ({
        voz: `¿Dónde está ${nombre}?`,
        opciones: [op(E(e), true), ...sample(palabras.filter(p => p[0] !== e), 2).map(([o]) => op(E(o)))]
      }));
    }
  }
};
