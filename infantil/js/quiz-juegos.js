// Juegos de "escucha y toca": cada uno genera rondas nuevas (aleatorias) en cada partida.
// Ronda: { voz, escena?, opciones: [{ html, ok }], criterio?, audio? }
import { E, COLORES, caja, mesa, arbol, plato, forma, bola, hueco, arbolEstacion, grupo, numero } from './dibujos.js';
import { shuffle, pick, sample } from './comun.js';

const op = (html, ok = false) => ({ html, ok });
// Botón con el nombre de la emoción (emoji dibujado, sin foto, para no confundirlo con la foto del enunciado).
const emocionBoton = (emoji, texto) => `<span class="emo">${emoji}</span><b class="palabra">${texto}</b>`;

export const JUEGOS_QUIZ = {
  emociones: {
    titulo: 'Contento o triste', icono: '😀', criterio: 'ca7',
    intro: 'A veces sentimos alegría y a veces sentimos tristeza. Mira bien su cara.',
    rondas: () => {
      const fotos = {
        alegria: [['cumpleanos', 'este bebé'], ['cara-contenta', 'este niño'], ['nina-sonrie', 'esta niña'],
          ['nino-rie', 'este niño'], ['nino-sonrie', 'este niño'], ['nina-contenta', 'esta niña']],
        tristeza: [['cara-triste', 'esta niña'], ['nina-llora', 'esta niña'], ['nina-lagrima', 'esta niña'],
          ['nino-llora', 'este niño'], ['bebe-pucheros', 'este bebé'], ['bebe-llora', 'este bebé']]
      };
      const quedan = { alegria: shuffle(fotos.alegria), tristeza: shuffle(fotos.tristeza) };
      return shuffle(['alegria', 'alegria', 'tristeza', 'tristeza', pick(['alegria', 'tristeza'])]).map(emocion => {
        const [foto, quien] = quedan[emocion].pop();
        return {
          voz: `¿Qué siente ${quien}? ¿Alegría o tristeza?`,
          escena: `<span class="emocion">${E(foto)}</span>`,
          opciones: [op(emocionBoton('😀', 'Alegría'), emocion === 'alegria'), op(emocionBoton('😢', 'Tristeza'), emocion === 'tristeza')]
        };
      });
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
