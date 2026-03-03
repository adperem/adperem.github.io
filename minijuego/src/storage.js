const KEYS = [
  "minijuego_progress_v1",
  "minijuego_salud_progress",
  "minijuego_progress",
  "minijuego_salud_progress_v1"
];

function looksLikeProgress(obj) {
  return obj && typeof obj === "object" && Array.isArray(obj.completed);
}

function guessKey() {
  // 1) Si ya existe alguno con formato correcto, usarlo
  for (const k of KEYS) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const obj = JSON.parse(raw);
      if (looksLikeProgress(obj)) return k;
    } catch { /* ignore */ }
  }

  // 2) Buscar entre claves existentes por compatibilidad (actividades antiguas)
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      let obj = null;
      try { obj = JSON.parse(raw); } catch { obj = null; }
      if (looksLikeProgress(obj)) return k;
    }
  } catch { /* ignore */ }

  // 3) Por defecto
  return KEYS[0];
}

let ACTIVE_KEY = null;

export function loadProgress() {
  try {
    if (!ACTIVE_KEY) ACTIVE_KEY = guessKey();
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) return { completed: [] };
    const parsed = JSON.parse(raw);
    if (!looksLikeProgress(parsed)) return { completed: [] };
    return parsed;
  } catch {
    return { completed: [] };
  }
}

export function saveProgress(progress) {
  if (!ACTIVE_KEY) ACTIVE_KEY = guessKey();
  // Guardar en la clave activa y en las conocidas para compatibilidad
  for (const k of new Set([ACTIVE_KEY, ...KEYS])) {
    try { localStorage.setItem(k, JSON.stringify(progress)); } catch { /* ignore */ }
  }
}

export function markCompleted(partId) {
  const p = loadProgress();
  if (!Array.isArray(p.completed)) p.completed = [];
  if (!p.completed.includes(partId)) {
    p.completed.push(partId);
    saveProgress(p);
  }
  return p;
}

export function resetProgress() {
  const empty = { completed: [] };
  for (const k of KEYS) {
    try { localStorage.setItem(k, JSON.stringify(empty)); } catch { /* ignore */ }
  }
  // También limpiar la clave activa si era otra
  try {
    if (ACTIVE_KEY && !KEYS.includes(ACTIVE_KEY)) localStorage.setItem(ACTIVE_KEY, JSON.stringify(empty));
  } catch { /* ignore */ }
}
