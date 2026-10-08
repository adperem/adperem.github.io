// Ilustraciones de los juegos: fotos reales (ver fotos.js) y algún dibujo SVG sencillo.
import { fotoDe } from './fotos.js';

export const COLORES = {
  rojo: '#e53935',
  azul: '#1e88e5',
  amarillo: '#fdd835',
  verde: '#43a047',
  morado: '#8e24aa'
};

// Pinta un emoji o clave como foto real; si no hay foto, deja el emoji.
export function E(emoji, tam = '', estilo = '') {
  const est = tam || estilo ? ` style="${tam ? `font-size:${tam};` : ''}${estilo}"` : '';
  const f = fotoDe(emoji);
  if (!f) return `<span class="emo"${est}>${emoji}</span>`;
  return `<img class="${f.recorte ? 'recorte' : 'foto'}" src="${f.src}" alt="" draggable="false"${est}>`;
}

const svg = (vb, contenido, etiqueta = '') =>
  `<svg viewBox="${vb}" class="dibujo" role="img" aria-label="${etiqueta}">${contenido}</svg>`;

function T(emoji, x, y, tam) {
  const f = fotoDe(emoji);
  if (f) return `<image href="${f.src}" x="${x - tam * 0.6}" y="${y - tam * 0.6}" width="${tam * 1.2}" height="${tam * 1.2}" preserveAspectRatio="xMidYMid meet"/>`;
  return `<text x="${x}" y="${y}" font-size="${tam}" text-anchor="middle" dominant-baseline="central" class="emo-svg">${emoji}</text>`;
}

const sombra = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="7" fill="#000" opacity=".08"/>`;

// Caja abierta con un objeto dentro (asomando) o fuera, al lado.
export function caja(obj, dentro) {
  return svg('0 0 230 160', `
    ${sombra(115, 150, 105)}
    ${dentro ? '' : T(obj, 188, 118, 54)}
    <polygon points="35,70 58,52 158,52 135,70" fill="#7a4a22"/>
    ${dentro ? T(obj, 92, 60, 54) : ''}
    <polygon points="135,70 158,52 158,128 135,146" fill="#b0743e"/>
    <rect x="35" y="70" width="100" height="76" rx="3" fill="#cf8e52"/>
    <rect x="35" y="70" width="100" height="10" fill="#e0a56c"/>
  `, dentro ? 'dentro de la caja' : 'fuera de la caja');
}

// Mesa con un objeto encima (arriba) o debajo (abajo).
export function mesa(obj, arriba) {
  return svg('0 0 230 160', `
    ${sombra(115, 152, 100)}
    <rect x="42" y="88" width="11" height="62" rx="3" fill="#9a5f2c"/>
    <rect x="177" y="88" width="11" height="62" rx="3" fill="#9a5f2c"/>
    <rect x="25" y="76" width="180" height="14" rx="5" fill="#c27c3e"/>
    ${arriba ? T(obj, 115, 48, 52) : T(obj, 115, 124, 46)}
  `, arriba ? 'arriba de la mesa' : 'abajo, debajo de la mesa');
}

// Árbol (foto) con un objeto arriba (en la copa) o abajo (en el suelo).
export function arbol(obj, arriba) {
  return svg('0 0 230 170', `
    <rect x="0" y="158" width="230" height="12" rx="4" fill="#8bc34a" opacity=".45"/>
    <image href="img/arbol.webp" x="35" y="0" width="150" height="164" preserveAspectRatio="xMidYMax meet"/>
    ${arriba ? T(obj, 110, 38, 40) : T(obj, 196, 140, 40)}
  `, arriba ? 'arriba en el árbol' : 'abajo en el suelo');
}

// Plato con `n` objetos.
export function plato(n, obj) {
  const pos = { 0: [], 1: [[115, 82]], 2: [[88, 84], [142, 84]], 3: [[80, 88], [115, 74], [150, 88]] }[n];
  return svg('0 0 230 150', `
    ${sombra(115, 132, 95)}
    <ellipse cx="115" cy="90" rx="100" ry="46" fill="#fff" stroke="#d9d4cc" stroke-width="3"/>
    <ellipse cx="115" cy="90" rx="66" ry="28" fill="none" stroke="#ece7df" stroke-width="3"/>
    ${pos.map(([x, y]) => T(obj, x, y, n > 1 ? 42 : 52)).join('')}
  `, n === 0 ? 'plato vacío' : `plato con ${n}`);
}

export function forma(tipo, color, etiqueta = tipo) {
  const f = {
    circulo: `<circle cx="60" cy="60" r="48" fill="${color}"/>`,
    cuadrado: `<rect x="14" y="14" width="92" height="92" rx="4" fill="${color}"/>`,
    triangulo: `<polygon points="60,10 112,104 8,104" fill="${color}"/>`,
    rectangulo: `<rect x="6" y="30" width="108" height="60" rx="4" fill="${color}"/>`
  }[tipo];
  return svg('0 0 120 120', f.replace('/>', ' stroke="rgba(0,0,0,.15)" stroke-width="3"/>'), etiqueta);
}

export const bola = color =>
  `<svg viewBox="0 0 40 40" class="bola" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="${color}" stroke="rgba(0,0,0,.18)" stroke-width="2"/><circle cx="14" cy="13" r="4" fill="#fff" opacity=".45"/></svg>`;

export const hueco = '<span class="hueco" aria-label="¿cuál va aquí?">?</span>';

// Foto de un árbol en otoño, verano o invierno.
export const arbolEstacion = estacion => E(`arbol-${estacion}`);

export const grupo = (obj, n) => `<span class="grupo">${E(obj).repeat(n)}</span>`;
export const numero = n => `<span class="num">${n}</span>`;
