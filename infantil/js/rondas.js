// Motor de rondas "escucha y toca".
// Solo cuenta el PRIMER toque de cada ronda para la evaluación; después el niño puede
// seguir probando hasta acertar, para que nunca se quede atascado ni sienta que falla.
import { hablar, sonidoAcierto, sonidoFallo, pick, shuffle, el, ELOGIOS, ANIMOS, Progreso } from './comun.js';
import { registrarRonda } from './storage.js';

export function ejecutarRondas({ contenedor, rondas, criterio, onFin, conProgreso = true, esperar = null }) {
  const zona = el('<div class="rondas"></div>');
  contenedor.append(zona);
  const progreso = conProgreso ? new Progreso(zona, rondas.length) : null;
  const cuerpo = el('<div class="ronda"></div>');
  zona.append(cuerpo);

  let i = 0;
  let aciertos = 0;
  let primerToque = true;
  let bloqueado = false;

  async function decir() {
    const r = rondas[i];
    if (!r) return;
    // La primera pregunta espera a que termine la explicación inicial (si la hay).
    if (esperar) { const e = esperar; esperar = null; await e; if (rondas[i] !== r || !primerToque) return; }
    await hablar(r.voz);
    if (r.audio && rondas[i] === r) r.audio();
  }

  function mostrar() {
    const r = rondas[i];
    primerToque = true;
    bloqueado = false;
    const opciones = shuffle(r.opciones);
    cuerpo.innerHTML = '';
    if (r.escena || r.audio) {
      const escena = el(`<div class="escena">${r.escena || ''}</div>`);
      if (r.audio) {
        const b = el('<button class="btn-redondo escuchar" type="button" aria-label="Escuchar otra vez">👂</button>');
        b.addEventListener('click', () => r.audio());
        escena.append(b);
      }
      cuerpo.append(escena);
    }
    const lista = el(`<div class="opciones" style="--n:${opciones.length}"></div>`);
    opciones.forEach(o => {
      const b = el(`<button class="opcion" type="button">${o.html}</button>`);
      b.addEventListener('click', () => tocar(b, o, r));
      lista.append(b);
    });
    cuerpo.append(lista);
    cuerpo.classList.remove('entra');
    void cuerpo.offsetWidth;
    cuerpo.classList.add('entra');
    decir();
  }

  function tocar(boton, opcion, r) {
    if (bloqueado || boton.disabled) return;
    if (primerToque) {
      primerToque = false;
      registrarRonda(r.criterio || criterio, opcion.ok);
      if (opcion.ok) aciertos++;
    }
    if (opcion.ok) {
      bloqueado = true;
      boton.classList.add('bien');
      sonidoAcierto();
      progreso?.marcar(i);
      hablar(pick(ELOGIOS));
      setTimeout(siguiente, 1700);
    } else {
      boton.classList.add('mal');
      boton.disabled = true;
      sonidoFallo();
      hablar(pick(ANIMOS));
    }
  }

  function siguiente() {
    i++;
    if (i < rondas.length) mostrar();
    else {
      zona.remove();
      onFin?.({ aciertos, total: rondas.length });
    }
  }

  mostrar();
  return { repetir: decir };
}
