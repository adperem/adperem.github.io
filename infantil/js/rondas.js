// Motor de rondas "mira y toca". El enunciado sale escrito para que el profe lo lea en voz alta.
// Solo cuenta el PRIMER toque de cada ronda para la evaluación; después el niño puede
// seguir probando hasta acertar, para que nunca se quede atascado ni sienta que falla.
import { sonidoAcierto, sonidoFallo, shuffle, el, Progreso } from './comun.js';
import { registrarRonda } from './storage.js';

export function ejecutarRondas({ contenedor, rondas, criterio, onFin, conProgreso = true }) {
  const zona = el('<div class="rondas"></div>');
  contenedor.append(zona);
  const progreso = conProgreso ? new Progreso(zona, rondas.length) : null;
  const cuerpo = el('<div class="ronda"></div>');
  zona.append(cuerpo);

  let i = 0;
  let aciertos = 0;
  let primerToque = true;
  let bloqueado = false;

  function mostrar() {
    const r = rondas[i];
    primerToque = true;
    bloqueado = false;
    const opciones = shuffle(r.opciones);
    cuerpo.innerHTML = '';
    cuerpo.append(el(`<p class="enunciado">${r.enunciado}</p>`));
    if (r.escena) cuerpo.append(el(`<div class="escena">${r.escena}</div>`));
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
      setTimeout(siguiente, 1700);
    } else {
      boton.classList.add('mal');
      boton.disabled = true;
      sonidoFallo();
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
}
