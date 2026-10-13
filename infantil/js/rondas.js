// Motor de rondas "mira y toca". El enunciado sale escrito para que el profe lo lea en voz alta.
// Solo cuenta el PRIMER toque de cada ronda para la evaluación; después el niño puede
// seguir probando hasta acertar, para que nunca se quede atascado ni sienta que falla.
import { sonidoAcierto, sonidoFallo, shuffle, pick, el, Progreso } from './comun.js';
import { registrarRonda } from './storage.js';

// Sitio de la respuesta correcta en cada ronda: al azar, pero repartido entre los huecos
// (primero los menos usados) y sin repetir sitio más de dos veces seguidas (con 3 o más
// opciones, nunca dos veces seguidas), para que no se pueda acertar por la posición.
function sitiosCorrectos(rondas) {
  const usos = [];
  const sitios = [];
  for (const r of rondas) {
    let libres = [...r.opciones.keys()];
    const seguidas = r.opciones.length > 2 ? 1 : 2;
    const ultimos = sitios.slice(-seguidas);
    if (ultimos.length === seguidas && ultimos.every(p => p === ultimos[0])) libres = libres.filter(p => p !== ultimos[0]);
    const menos = Math.min(...libres.map(p => usos[p] || 0));
    const sitio = pick(libres.filter(p => (usos[p] || 0) === menos));
    usos[sitio] = (usos[sitio] || 0) + 1;
    sitios.push(sitio);
  }
  return sitios;
}

export function ejecutarRondas({ contenedor, rondas, criterio, onFin, conProgreso = true }) {
  const zona = el('<div class="rondas"></div>');
  contenedor.append(zona);
  const progreso = conProgreso ? new Progreso(zona, rondas.length) : null;
  const cuerpo = el('<div class="ronda"></div>');
  zona.append(cuerpo);

  const sitios = sitiosCorrectos(rondas);
  let i = 0;
  let aciertos = 0;
  let primerToque = true;
  let bloqueado = false;

  function mostrar() {
    const r = rondas[i];
    primerToque = true;
    bloqueado = false;
    const correcta = r.opciones.find(o => o.ok);
    const opciones = shuffle(r.opciones.filter(o => o !== correcta));
    opciones.splice(sitios[i], 0, correcta);
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
