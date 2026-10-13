// Utilidades compartidas: voz, sonidos, azar y piezas de interfaz.
import { alumnos, alumnoActual, evaluacion, fijarEvaluacion, NIVELES } from './storage.js';
import { CRITERIOS } from './datos.js';
import { E } from './dibujos.js';

// ---------- Voz (los niños de 3 años no leen: todas las consignas se dicen en voz alta) ----------

let vozES = null;
function elegirVoz() {
  const voces = speechSynthesis.getVoices();
  vozES = voces.find(v => v.lang === 'es-ES' && /Helena|Laura|Elvira|Monica|Lucia|female|mujer/i.test(v.name))
    || voces.find(v => v.lang === 'es-ES')
    || voces.find(v => v.lang?.startsWith('es'))
    || null;
}
if ('speechSynthesis' in window) {
  elegirVoz();
  speechSynthesis.addEventListener?.('voiceschanged', elegirVoz);
}

export function hablar(texto) {
  return new Promise(resolve => {
    if (!texto || !('speechSynthesis' in window)) { resolve(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-ES';
    if (vozES) u.voice = vozES;
    u.rate = 0.88;
    u.pitch = 1.1;
    let hecho = false;
    // Algunos navegadores no disparan onend: plan B por tiempo.
    const plazo = setTimeout(() => fin(), 1500 + texto.length * 95);
    function fin() {
      if (hecho) return;
      hecho = true;
      clearTimeout(plazo);
      resolve();
    }
    u.onend = fin;
    u.onerror = fin;
    speechSynthesis.speak(u);
  });
}

export const ELOGIOS = ['¡Muy bien!', '¡Genial!', '¡Eso es!', '¡Fantástico!', '¡Bravo!', '¡Lo has conseguido!'];
export const ANIMOS = ['¡Uy! Prueba otra vez.', 'Casi. Inténtalo otra vez.', 'Mira bien y prueba otra vez.'];

// ---------- Sonido (Web Audio, sin archivos) ----------

let ctx = null;
export function audio() {
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function nota(freq, inicio, dur, { tipo = 'triangle', vol = 0.18, destino = null } = {}) {
  const c = audio();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = tipo;
  o.frequency.value = freq;
  o.connect(g).connect(destino || c.destination);
  const t = c.currentTime + inicio;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sonidoAcierto = () => [523, 659, 784].forEach((f, i) => nota(f, i * 0.09, 0.3));
export const sonidoFallo = () => { nota(330, 0, 0.18, { tipo: 'sine', vol: 0.12 }); nota(262, 0.15, 0.28, { tipo: 'sine', vol: 0.12 }); };
export const sonidoFin = () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => nota(f, i * 0.12, 0.35));
export const sonidoPop = () => nota(880, 0, 0.12, { tipo: 'sine', vol: 0.12 });

// ---------- Azar ----------

export const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const sample = (arr, n, excluir = []) => shuffle(arr.filter(x => !excluir.includes(x))).slice(0, n);
export const params = () => new URLSearchParams(location.search);

// ---------- Interfaz ----------

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function cabecera({ titulo, onRepetir = null, volver = 'index.html' }) {
  const a = alumnoActual();
  const header = el(`
    <header class="barra">
      <a class="btn-redondo" href="${volver}" aria-label="Volver al menú">🏠</a>
      <h1>${titulo}</h1>
      ${a ? `<span class="quien" title="${a.nombre}">${E(a.avatar)}</span>` : ''}
      ${onRepetir ? '<button class="btn-redondo" type="button" aria-label="Repetir la pregunta">🔊</button>' : ''}
    </header>`);
  header.querySelector('button')?.addEventListener('click', onRepetir);
  document.body.prepend(header);
  return header;
}

export class Progreso {
  constructor(contenedor, total) {
    this.el = el(`<div class="estrellas" aria-label="Progreso">${'<span class="estrella emo">⭐</span>'.repeat(total)}</div>`);
    contenedor.prepend(this.el);
  }
  marcar(i) {
    this.el.children[i]?.classList.add('on');
  }
}

export function confeti() {
  const colores = ['#e53935', '#1e88e5', '#fdd835', '#43a047', '#8e24aa', '#fb8c00'];
  const capa = el('<div class="confeti" aria-hidden="true"></div>');
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.background = pick(colores);
    p.style.animationDelay = Math.random() * 0.6 + 's';
    p.style.animationDuration = 2 + Math.random() * 1.5 + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    capa.append(p);
  }
  document.body.append(capa);
  setTimeout(() => capa.remove(), 4000);
}

// Pantalla final. `detalle` es un texto discreto para el profe (p. ej. aciertos a la primera).
export function pantallaFinal({ mensaje = '¡Lo has conseguido!', detalle = '', criterios = [], onOtraVez = () => location.reload() } = {}) {
  sonidoFin();
  confeti();
  hablar(mensaje);
  const capa = el(`
    <div class="final" role="dialog" aria-label="${mensaje}">
      <div class="final-tarjeta">
        <div class="trofeo emo">🏆</div>
        <h2>${mensaje}</h2>
        <div class="final-botones">
          <button class="btn-grande otra" type="button" aria-label="Jugar otra vez">🔁</button>
          <a class="btn-grande menu" href="index.html" aria-label="Volver al menú">🏠</a>
        </div>
        ${detalle ? `<p class="detalle-profe">${detalle}</p>` : ''}
      </div>
    </div>`);
  capa.querySelector('.otra').addEventListener('click', onOtraVez);
  if (criterios.length) cajaProfe(capa.querySelector('.final-tarjeta'), criterios);
  document.body.append(capa);
  return capa;
}

// Caja plegable para que el profe registre su observación sin salir de la actividad.
export function cajaProfe(contenedor, criterios, { abierta = false } = {}) {
  const lista = alumnos();
  const actual = alumnoActual();
  const caja = el(`
    <details class="profe"${abierta ? ' open' : ''}>
      <summary>👩‍🏫 Para el profe: anotar observación</summary>
      ${lista.length ? `
        <label>Alumno/a
          <select class="profe-alumno">
            ${lista.map(a => `<option value="${a.id}"${actual?.id === a.id ? ' selected' : ''}>${a.avatar} ${a.nombre}</option>`).join('')}
          </select>
        </label>
        <div class="profe-criterios"></div>
        <p class="profe-ok" aria-live="polite"></p>
      ` : '<p>Añade alumnos en el <a href="profesor.html">panel del profe</a> para guardar observaciones.</p>'}
    </details>`);
  contenedor.append(caja);
  if (!lista.length) return caja;

  const select = caja.querySelector('.profe-alumno');
  const zona = caja.querySelector('.profe-criterios');
  const aviso = caja.querySelector('.profe-ok');

  function pintar() {
    const id = select.value;
    zona.innerHTML = criterios.map(c => {
      const crit = CRITERIOS[c];
      const actualNivel = evaluacion(id, c).nivel;
      return `
        <div class="profe-fila" data-c="${c}">
          <p><b>${crit.codigo}.</b> ${crit.texto}</p>
          <div class="segmentos">
            ${Object.entries(NIVELES).map(([k, v]) =>
              `<button type="button" data-n="${k}" class="nivel-${k}${actualNivel === k ? ' activo' : ''}" title="${v.texto}">${v.texto}</button>`).join('')}
          </div>
        </div>`;
    }).join('');
  }
  zona.addEventListener('click', e => {
    const b = e.target.closest('button[data-n]');
    if (!b) return;
    const c = b.closest('.profe-fila').dataset.c;
    fijarEvaluacion(select.value, c, { nivel: b.dataset.n });
    pintar();
    const a = lista.find(x => x.id === select.value);
    aviso.textContent = `Guardado: ${a.nombre} · ${CRITERIOS[c].codigo} · ${NIVELES[b.dataset.n].texto}`;
  });
  select.addEventListener('change', () => { aviso.textContent = ''; pintar(); });
  pintar();
  return caja;
}

// Pantalla de inicio común: icono grande + botón de jugar (necesario para activar audio y voz).
export function pantallaInicio(contenedor, { icono, titulo, onEmpezar }) {
  const s = el(`
    <section class="inicio">
      <div class="icono-grande">${E(icono)}</div>
      <h2>${titulo}</h2>
      <button class="btn-jugar" type="button" aria-label="Empezar">▶</button>
    </section>`);
  s.querySelector('button').addEventListener('click', () => {
    audio();
    s.remove();
    onEmpezar();
  });
  contenedor.append(s);
  return s;
}
