// Persistencia en localStorage: alumnos, resultados de los juegos y evaluación del profe.
// Todo queda en ESTE dispositivo; desde el panel del profe se puede exportar/importar.

const CLAVE = 'infantil-eval-v1';
const CLAVE_ACTUAL = 'infantil-alumno-actual';

const AVATARES = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🐧', '🐤', '🐴', '🐝', '🐞', '🦋', '🐢', '🐙', '🐳', '🐬', '🦉', '🦒', '🐘', '🦔'];

export const NIVELES = {
  C: { texto: 'Conseguido', corto: 'C' },
  EP: { texto: 'En proceso', corto: 'EP' },
  NC: { texto: 'No conseguido', corto: 'NC' }
};

const vacio = () => ({ alumnos: [], resultados: {}, evaluacion: {}, partidas: {}, completados: {} });

function leer() {
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE));
    return d && typeof d === 'object' ? { ...vacio(), ...d } : vacio();
  } catch {
    return vacio();
  }
}

function guardar(d) {
  try { localStorage.setItem(CLAVE, JSON.stringify(d)); } catch { /* almacenamiento no disponible */ }
}

export const datos = () => leer();
export const alumnos = () => leer().alumnos;
export const avatares = () => AVATARES;

export function anadirAlumno(nombre) {
  const d = leer();
  const usados = new Set(d.alumnos.map(a => a.avatar));
  const avatar = AVATARES.find(a => !usados.has(a)) || AVATARES[d.alumnos.length % AVATARES.length];
  const alumno = { id: 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), nombre: nombre.trim(), avatar };
  d.alumnos.push(alumno);
  guardar(d);
  return alumno;
}

export function editarAlumno(id, cambios) {
  const d = leer();
  const a = d.alumnos.find(x => x.id === id);
  if (a) Object.assign(a, cambios);
  guardar(d);
}

export function borrarAlumno(id) {
  const d = leer();
  d.alumnos = d.alumnos.filter(a => a.id !== id);
  for (const k of ['resultados', 'evaluacion', 'partidas', 'completados']) delete d[k][id];
  guardar(d);
  if (localStorage.getItem(CLAVE_ACTUAL) === id) fijarAlumnoActual(null);
}

export function alumnoActual() {
  let id = null;
  try { id = localStorage.getItem(CLAVE_ACTUAL); } catch { /* sin almacenamiento */ }
  return alumnos().find(a => a.id === id) || null;
}

export function fijarAlumnoActual(id) {
  try {
    if (id) localStorage.setItem(CLAVE_ACTUAL, id);
    else localStorage.removeItem(CLAVE_ACTUAL);
  } catch { /* sin almacenamiento */ }
}

// --- Sesiones de juego ---

let sesion = null;

export function empezarSesion(juego) {
  sesion = { id: Date.now().toString(36), juego, fecha: new Date().toISOString() };
  const a = alumnoActual();
  if (!a) return;
  const d = leer();
  d.partidas[a.id] = (d.partidas[a.id] || 0) + 1;
  guardar(d);
}

// Se llama UNA vez por ronda, con el resultado del primer intento.
export function registrarRonda(criterio, acierto) {
  const a = alumnoActual();
  if (!a || !sesion) return;
  const d = leer();
  const porAlumno = (d.resultados[a.id] ??= {});
  const c = (porAlumno[criterio] ??= { sesiones: [] });
  let s = c.sesiones.find(x => x.id === sesion.id);
  if (!s) {
    s = { id: sesion.id, fecha: sesion.fecha, juego: sesion.juego, aciertos: 0, total: 0 };
    c.sesiones.push(s);
    if (c.sesiones.length > 30) c.sesiones.shift();
  }
  s.total++;
  if (acierto) s.aciertos++;
  guardar(d);
}

export function terminarSesion() {
  const a = alumnoActual();
  if (!a || !sesion) return;
  const d = leer();
  const lista = new Set(d.completados[a.id] || []);
  lista.add(sesion.juego);
  d.completados[a.id] = [...lista];
  guardar(d);
}

export const completados = id => new Set(leer().completados[id] || []);

// Sugerencia a partir de las últimas sesiones (al menos 4 respuestas si las hay).
export function sugerirNivel(sesiones) {
  if (!sesiones?.length) return null;
  let aciertos = 0;
  let total = 0;
  let ultima = null;
  for (let i = sesiones.length - 1; i >= 0 && total < 4; i--) {
    aciertos += sesiones[i].aciertos;
    total += sesiones[i].total;
    ultima ??= sesiones[i].fecha;
  }
  if (!total) return null;
  const pct = aciertos / total;
  return { nivel: pct >= 0.8 ? 'C' : pct >= 0.5 ? 'EP' : 'NC', aciertos, total, pct, fecha: ultima };
}

export function evaluacion(alumnoId, criterio) {
  return leer().evaluacion[alumnoId]?.[criterio] || {};
}

export function fijarEvaluacion(alumnoId, criterio, cambios) {
  const d = leer();
  const porAlumno = (d.evaluacion[alumnoId] ??= {});
  porAlumno[criterio] = { ...porAlumno[criterio], ...cambios, fecha: new Date().toISOString() };
  guardar(d);
}

// --- Copia de seguridad ---

export const exportarJSON = () => JSON.stringify(leer(), null, 2);

export function importarJSON(texto) {
  const d = JSON.parse(texto);
  if (!d || !Array.isArray(d.alumnos)) throw new Error('El archivo no es una copia válida.');
  guardar({ ...vacio(), ...d });
}

export function borrarTodo() {
  try {
    localStorage.removeItem(CLAVE);
    localStorage.removeItem(CLAVE_ACTUAL);
  } catch { /* sin almacenamiento */ }
}
