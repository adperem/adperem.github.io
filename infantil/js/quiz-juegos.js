// Juegos de "mira y toca": cada uno genera rondas nuevas (aleatorias) en cada partida.
// Ronda: { enunciado, escena?, opciones: [{ html, ok }], criterio? }
import { E, COLORES, caja, mesa, arbol, plato, forma, bola, hueco, grupo, numero } from './dibujos.js';
import { shuffle, pick, sample } from './comun.js';

const op = (html, ok = false) => ({ html, ok });
const un = g => (g === 'a' ? 'una' : 'un');
// Botón con el nombre de la emoción (emoji dibujado, sin foto, para no confundirlo con la foto del enunciado).
const emocionBoton = (emoji, texto) => `<span class="emo">${emoji}</span><b class="palabra">${texto}</b>`;

export const JUEGOS_QUIZ = {
  emociones: {
    titulo: 'Contento o triste', icono: '😀', criterio: 'ca7',
    intro: 'A veces sentimos alegría y a veces sentimos tristeza. Mira bien su cara.',
    rondas: () => {
      const fotos = {
        alegria: [['cumpleanos', 'este bebé'], ['cara-contenta', 'este niño'], ['nina-sonrie', 'esta niña'],
          ['nino-rie', 'este niño'], ['nino-sonrie', 'este niño'], ['nina-contenta', 'esta niña'], ['nino-gorro', 'este niño'],
          ['nino-alegre', 'este niño'], ['nino-columpio', 'este niño'], ['nina-rie', 'esta niña']],
        tristeza: [['cara-triste', 'esta niña'], ['nina-llora', 'esta niña'], ['nina-lagrima', 'esta niña'],
          ['nino-llora', 'este niño'], ['bebe-pucheros', 'este bebé'], ['bebe-llora', 'este bebé'], ['bebe-triste', 'este bebé'],
          ['nino-triste', 'este niño'], ['nino-cabizbajo', 'este niño']]
      };
      const quedan = { alegria: shuffle(fotos.alegria), tristeza: shuffle(fotos.tristeza) };
      return shuffle(['alegria', 'alegria', 'tristeza', 'tristeza', pick(['alegria', 'tristeza'])]).map(emocion => {
        const [foto, quien] = quedan[emocion].pop();
        return {
          enunciado: `¿Qué siente ${quien}? ¿Alegría o tristeza?`,
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
      const rojos = sample(['🍎', '🍓', '🍒', '🍅', '🚒', '🌹', '🎈', '🚗', 'pimiento', 'sandia', 'calcetin', 'gafas-sol'], 3);
      const otros = ['🍌', '🥦', '🍋', '🐸', '🌻', '🍇', '🐳', '🌽', '🍐', '🐧', '🐢', '🐘', 'zapatilla', 'paraguas', 'pato-goma'];
      const conObjetos = rojos.map(r => ({ enunciado: 'Toca lo que es de color rojo.', opciones: [op(E(r), true), ...sample(otros, 2).map(o => op(E(o)))] }));
      const conPelotas = [0, 1].map(() => ({
        enunciado: 'Toca la pelota roja.',
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
      const cosas = shuffle([
        ['🍎', 'manzana', 'a'], ['🍓', 'fresa', 'a'], ['🍪', 'galleta', 'a'], ['🍐', 'pera', 'a'], ['🍊', 'naranja', 'a'],
        ['🍩', 'donut', 'o'], ['zanahoria', 'zanahoria', 'a'], ['magdalena', 'magdalena', 'a'], ['pimiento', 'pimiento', 'o']
      ]);
      const tipos = shuffle(['uno', 'uno', 'ninguno', 'ninguno', pick(['uno', 'ninguno'])]);
      return tipos.map((t, i) => {
        const [e, nombre, g] = cosas[i];
        return {
          enunciado: t === 'uno'
            ? `Toca el plato que tiene ${un(g)} ${nombre}.`
            : `Toca el plato que no tiene ${g === 'a' ? 'ninguna' : 'ningún'} ${nombre}.`,
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
        ['🍎', 'la manzana', 'a'], ['🌳', 'el árbol', 'o'], ['🚗', 'el coche', 'o'], ['🦒', 'la jirafa', 'a'],
        ['🐻', 'el oso', 'o'], ['🦆', 'el pato', 'o'], ['🐰', 'el conejo', 'o'], ['🐢', 'la tortuga', 'a'], ['🐴', 'el caballo', 'o'],
        ['🐮', 'la vaca', 'a'], ['🧸', 'el osito', 'o'], ['⚽', 'la pelota', 'a'], ['raton', 'el ratón', 'o'], ['caracol', 'el caracol', 'o'],
        ['🐧', 'el pingüino', 'o'], ['muneca', 'la muñeca', 'a']
      ], 5);
      const tipos = shuffle(['grande', 'grande', 'pequeño', 'pequeño', pick(['grande', 'pequeño'])]);
      return cosas.map(([e, nombre, g], i) => {
        const grande = tipos[i] === 'grande';
        return {
          enunciado: `Toca ${nombre} ${grande ? 'grande' : `pequeñ${g}`}.`,
          opciones: [op(E(e, '1em'), grande), op(E(e, '.38em'), !grande)]
        };
      });
    }
  },

  numero1: {
    titulo: 'El número 1', icono: '1️⃣', criterio: 'de4',
    intro: 'Vamos a buscar el número uno.',
    rondas: () => {
      const cosas = sample([
        ['🦆', 'pato', 'o'], ['🐟', 'pez', 'o'], ['⚽', 'balón', 'o'], ['🎈', 'globo', 'o'], ['🚗', 'coche', 'o'], ['🐰', 'conejo', 'o'],
        ['🐱', 'gato', 'o'], ['🐶', 'perro', 'o'], ['🐢', 'tortuga', 'a'], ['🍎', 'manzana', 'a'], ['🦋', 'mariposa', 'a'],
        ['🍐', 'pera', 'a'], ['🧸', 'osito', 'o'], ['pato-goma', 'patito de goma', 'o'], ['raton', 'ratón', 'o']
      ], 3);
      const grafia = [0, 1].map(() => ({
        enunciado: 'Toca el número uno.',
        opciones: [op(numero(1), true), ...sample(['3', '5', '7', '4', '8'], 2).map(n => op(numero(n)))]
      }));
      const cantidad = cosas.slice(0, 2).map(([e, nombre, g]) => ({
        enunciado: `¿Dónde hay ${un(g)} sol${g} ${nombre}?`,
        opciones: [op(grupo(e, 1), true), op(grupo(e, 3)), op(grupo(e, 2))]
      }));
      const [e, nombre, g] = cosas[2];
      const asociar = {
        enunciado: `Mira: hay ${un(g)} ${nombre}. Toca el número uno.`,
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
      // Series de bolas de colores y series de cosas de dos colores (fresa roja, plátano amarillo…).
      const conBolas = sample([['rojo', 'azul'], ['amarillo', 'verde'], ['rojo', 'amarillo'], ['azul', 'amarillo'], ['verde', 'rojo']], 3)
        .map(([a, b]) => [bola(COLORES[a]), bola(COLORES[b])]);
      const conFotos = sample([['🍓', '🍌'], ['🍎', '🥦'], ['🍒', '🍋'], ['pimiento', '🌽'], ['🌻', '🥦'], ['🍇', '🍋']], 2)
        .map(([a, b]) => [E(a), E(b)]);
      const largos = shuffle([3, 4, 4, 5, 5]);
      return shuffle([...conBolas, ...conFotos]).map(([a, b], i) => {
        const serie = Array.from({ length: largos[i] }, (_, k) => (k % 2 === 0 ? a : b));
        const sigue = largos[i] % 2 === 0 ? a : b;
        return {
          enunciado: 'Mira la serie. ¿Qué color va ahora?',
          escena: `<span class="serie">${serie.join('')}${hueco}</span>`,
          opciones: [op(a, sigue === a), op(b, sigue === b)]
        };
      });
    }
  },

  dentro: {
    titulo: 'Dentro y fuera', icono: '📦', criterio: 'de6',
    intro: 'Vamos a jugar con la caja.',
    rondas: () => {
      const cosas = sample([
        ['🐱', 'el gato'], ['🐶', 'el perro'], ['⚽', 'la pelota'], ['🧸', 'el osito'], ['🐰', 'el conejo'], ['🦆', 'el pato'],
        ['🐢', 'la tortuga'], ['raton', 'el ratón'], ['coche-juguete', 'el coche'], ['🦖', 'el dinosaurio'], ['pato-goma', 'el patito'],
        ['muneca', 'la muñeca'], ['🐷', 'el cerdito']
      ], 5);
      const tipos = shuffle(['dentro', 'dentro', 'fuera', 'fuera', pick(['dentro', 'fuera'])]);
      return cosas.map(([e, nombre], i) => ({
        enunciado: `Toca ${nombre} que está ${tipos[i]} de la caja.`,
        opciones: [op(caja(e, true), tipos[i] === 'dentro'), op(caja(e, false), tipos[i] === 'fuera')]
      }));
    }
  },

  arriba: {
    titulo: 'Arriba y abajo', icono: '⬆️', criterio: 'de7',
    intro: '¿Está arriba o está abajo? ¡Fíjate bien!',
    rondas: () => {
      const enMesa = sample([
        ['⚽', 'la pelota'], ['🐱', 'el gato'], ['🧸', 'el osito'], ['📕', 'el libro'], ['🍎', 'la manzana'], ['🐶', 'el perro'],
        ['🐰', 'el conejo'], ['pato-goma', 'el patito'], ['muneca', 'la muñeca'], ['dado', 'el dado']
      ], 3);
      const enArbol = sample([['🐦', 'el pájaro'], ['🐿️', 'la ardilla'], ['🦉', 'el búho'], ['🦋', 'la mariposa'], ['🐨', 'el koala']], 2);
      const tipos = shuffle(['arriba', 'arriba', 'abajo', 'abajo', pick(['arriba', 'abajo'])]);
      const rondas = [
        ...enMesa.map(([e, n]) => ({ e, n, dibujo: mesa, donde: { arriba: 'arriba, encima de la mesa', abajo: 'abajo, debajo de la mesa' } })),
        ...enArbol.map(([e, n]) => ({ e, n, dibujo: arbol, donde: { arriba: 'arriba, en el árbol', abajo: 'abajo, en el suelo' } }))
      ];
      return shuffle(rondas.map((r, i) => ({
        enunciado: `Toca ${r.n} que está ${r.donde[tipos[i]]}.`,
        opciones: [op(r.dibujo(r.e, true), tipos[i] === 'arriba'), op(r.dibujo(r.e, false), tipos[i] === 'abajo')]
      })));
    }
  },

  circulo: {
    titulo: 'El círculo', icono: '⭕', criterio: 'de8',
    intro: 'Vamos a buscar círculos.',
    rondas: () => {
      const colores = sample(Object.values(COLORES), 2);
      const formas = colores.map(color => ({
        enunciado: 'Toca el círculo.',
        opciones: [op(forma('circulo', color), true), ...sample(['cuadrado', 'triangulo', 'rectangulo'], 2).map(f => op(forma(f, color)))]
      }));
      const objetos = sample(['🕒', '🍩', '⚽', '🍊', 'plato', 'boton', 'pizza', 'luna'], 3).map(r => ({
        enunciado: '¿Qué tiene forma de círculo?',
        opciones: [op(E(r), true), ...sample(['📕', '📦', 'porcion-pizza', '🧀', '🖼️', '📄', 'dado', '✏️', 'sobre'], 2).map(o => op(E(o)))]
      }));
      return shuffle([...formas, ...objetos]);
    }
  }
};
