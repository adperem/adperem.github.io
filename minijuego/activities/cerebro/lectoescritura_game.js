"use strict";

var PART_ID = "cerebro_lectoescritura";

/* ── Pool de sílabas con pistas ── */
var POOL = [
  { syl: "MA", hint: "MANO"    },
  { syl: "NA", hint: "NARANJA" },
  { syl: "PA", hint: "ZAPATO"  },
  { syl: "TA", hint: "TAZA"    },
  { syl: "LA", hint: "LAGO"    },
  { syl: "SA", hint: "MESA"    },
  { syl: "CA", hint: "CASA"    },
  { syl: "PE", hint: "PELOTA"  },
  { syl: "LE", hint: "LECHE"   },
  { syl: "MI", hint: "CAMINO"  },
  { syl: "SI", hint: "SILLA"   },
  { syl: "NO", hint: "NOCHE"   },
  { syl: "BO", hint: "GLOBO"   },
  { syl: "LO", hint: "LOBO"    },
  { syl: "RI", hint: "RICO"    },
  { syl: "TU", hint: "TULIPÁN" },
  { syl: "FU", hint: "FUEGO"   },
  { syl: "GU", hint: "AGUJA"   },
];

var ROUNDS_COUNT = 10;

/* ── Referencias DOM ── */
var syllableEl   = null;
var roundLabelEl = null;
var btnHint      = null;
var hintAreaEl   = null;
var btnClear     = null;
var btnNext      = null;
var counterEl    = null;
var toastEl      = null;
var finishEl     = null;
var btnReset     = null;
var btnAgain     = null;
var sndClap      = null;
var canvas       = null;
var ctx          = null;

/* ── Estado del juego ── */
var rounds       = [];
var currentRound = 0;
var completed    = 0;
var hintShown    = false;
var progressKey  = null;

/* ── Estado del dibujo ── */
var isDrawing = false;
var lastX     = 0;
var lastY     = 0;
var hasDrawn  = false;

/* ════════════════════════════════════════
   INIT
═══════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {
  syllableEl   = document.getElementById("syllable");
  roundLabelEl = document.getElementById("roundLabel");
  btnHint      = document.getElementById("btnHint");
  hintAreaEl   = document.getElementById("hintArea");
  btnClear     = document.getElementById("btnClear");
  btnNext      = document.getElementById("btnNext");
  counterEl    = document.getElementById("counter");
  toastEl      = document.getElementById("toast");
  finishEl     = document.getElementById("finish");
  btnReset     = document.getElementById("btnReset");
  btnAgain     = document.getElementById("btnAgain");
  sndClap      = document.getElementById("sndClap");
  canvas       = document.getElementById("drawCanvas");
  ctx          = canvas.getContext("2d");

  btnHint.addEventListener("click",  revealHint);
  btnClear.addEventListener("click", clearCanvas);
  btnNext.addEventListener("click",  nextRound);
  btnReset.addEventListener("click", resetGame);
  btnAgain.addEventListener("click", resetGame);

  if (sndClap && sndClap.dataset.src) sndClap.src = sndClap.dataset.src;

  initCanvas();
  resetGame();
  showToast("¡ESCRIBE UNA PALABRA CON LA SÍLABA! ✏️", "good", 1500);
});

/* ════════════════════════════════════════
   CANVAS — dibujo a mano
═══════════════════════════════════════ */
function initCanvas() {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  canvas.addEventListener("pointerdown",   onPointerDown);
  canvas.addEventListener("pointermove",   onPointerMove);
  canvas.addEventListener("pointerup",     onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("pointerleave",  onPointerUp);
}

function resizeCanvas() {
  /* Preserva el dibujo si existe */
  var img = null;
  if (hasDrawn) {
    try { img = ctx.getImageData(0, 0, canvas.width, canvas.height); } catch (e) {}
  }

  var wrap = document.getElementById("canvasWrap");
  canvas.width  = wrap.clientWidth;
  canvas.height = wrap.clientHeight;

  /* Restaura los estilos de trazo (se pierden al redimensionar) */
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";
  ctx.lineWidth   = 5;
  ctx.strokeStyle = "#1e293b";
  ctx.fillStyle   = "#1e293b";

  if (img) {
    try { ctx.putImageData(img, 0, 0); } catch (e) {}
  }
}

function onPointerDown(ev) {
  ev.preventDefault();
  isDrawing = true;
  hasDrawn  = true;
  var pos = getPos(ev);
  lastX = pos.x;
  lastY = pos.y;

  /* Punto en el lugar del primer contacto */
  ctx.beginPath();
  ctx.arc(lastX, lastY, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();

  try { canvas.setPointerCapture(ev.pointerId); } catch (e) {}
}

function onPointerMove(ev) {
  if (!isDrawing) return;
  ev.preventDefault();
  var pos = getPos(ev);

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();

  lastX = pos.x;
  lastY = pos.y;
}

function onPointerUp(ev) {
  if (!isDrawing) return;
  isDrawing = false;
  try { canvas.releasePointerCapture(ev.pointerId); } catch (e) {}
}

function getPos(ev) {
  var rect   = canvas.getBoundingClientRect();
  var scaleX = canvas.width  / rect.width;
  var scaleY = canvas.height / rect.height;
  return {
    x: (ev.clientX - rect.left) * scaleX,
    y: (ev.clientY - rect.top)  * scaleY
  };
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasDrawn = false;
}

/* ════════════════════════════════════════
   JUEGO
═══════════════════════════════════════ */
function buildRounds() {
  var pool = POOL.slice();
  shuffleInPlace(pool);
  rounds = pool.slice(0, ROUNDS_COUNT);
}

function resetGame() {
  buildRounds();
  currentRound = 0;
  completed    = 0;
  hideFinish();
  updateCounter();
  showRound();
}

function showRound() {
  var r = rounds[currentRound];

  hintShown = false;
  hintAreaEl.textContent = "";
  hintAreaEl.classList.remove("visible");
  btnHint.disabled = false;
  clearCanvas();

  /* Anima la pastilla de la sílaba */
  syllableEl.style.animation = "none";
  void syllableEl.offsetWidth;
  syllableEl.style.animation = "";
  syllableEl.textContent      = r.syl;

  roundLabelEl.textContent = (currentRound + 1) + " DE " + rounds.length;
}

/* El profesor pulsa SIGUIENTE cuando considera válida la respuesta */
function nextRound() {
  if (!hasDrawn) {
    showToast("¡PRIMERO ESCRIBE UNA PALABRA! ✏️", "bad", 1000);
    return;
  }

  completed++;
  updateCounter();
  playSound(sndClap);
  spawnConfetti(7);
  showToast("¡MUY BIEN! 👏", "good", 1000);

  setTimeout(function () {
    currentRound++;
    if (currentRound >= rounds.length) {
      finishGame();
    } else {
      showRound();
    }
  }, 1100);
}

/* ── Pista ── */
function revealHint() {
  if (hintShown) return;
  hintShown        = true;
  btnHint.disabled = true;

  var r    = rounds[currentRound];
  var syl  = r.syl;
  var hint = r.hint;
  var idx  = normalize(hint).indexOf(normalize(syl));
  var html = hint;
  if (idx !== -1) {
    html =
      hint.slice(0, idx) +
      '<span class="hl">' + hint.slice(idx, idx + syl.length) + '</span>' +
      hint.slice(idx + syl.length);
  }
  hintAreaEl.innerHTML = "EJEMPLO:<br>" + html;
  hintAreaEl.classList.remove("visible");
  void hintAreaEl.offsetWidth;
  hintAreaEl.classList.add("visible");
}

/* ════════════════════════════════════════
   UI HELPERS
═══════════════════════════════════════ */
function updateCounter() {
  counterEl.textContent = completed + " DE " + rounds.length;
}

function finishGame() {
  markCompleted(PART_ID);
  showFinish();
  showToast("¡ACTIVIDAD COMPLETADA! 🌟", "good", 1800);
  playSound(sndClap);
  spawnConfettiBurst();
}

function showFinish() {
  finishEl.classList.add("on");
  finishEl.setAttribute("aria-hidden", "false");
}

function hideFinish() {
  finishEl.classList.remove("on");
  finishEl.setAttribute("aria-hidden", "true");
}

function showToast(text, kind, ms) {
  toastEl.textContent = text;
  toastEl.classList.remove("good", "bad");
  if (kind === "good") toastEl.classList.add("good");
  if (kind === "bad")  toastEl.classList.add("bad");
  toastEl.classList.add("on");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(function () {
    toastEl.classList.remove("on");
  }, ms || 900);
}

function playSound(audioEl) {
  if (!audioEl) return;
  try { audioEl.pause(); audioEl.currentTime = 0; } catch (e) {}
  var p = null;
  try { p = audioEl.play(); } catch (e) { p = null; }
  if (p && p.catch) p.catch(function () {});
}

/* ════════════════════════════════════════
   UTILIDADES
═══════════════════════════════════════ */
function normalize(str) {
  return str.toUpperCase()
    .replace(/[ÁÀÂ]/g, "A")
    .replace(/[ÉÈÊ]/g, "E")
    .replace(/[ÍÌÎ]/g, "I")
    .replace(/[ÓÒÔ]/g, "O")
    .replace(/[ÚÙÛÜ]/g, "U");
}

function shuffleInPlace(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
}

/* ── Progreso ── */
function guessProgressKey() {
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (!k) continue;
    var raw = localStorage.getItem(k);
    if (!raw) continue;
    var obj = null;
    try { obj = JSON.parse(raw); } catch (e) { obj = null; }
    if (!obj || typeof obj !== "object") continue;
    if (Array.isArray(obj.completed)) return k;
  }
  return "minijuego_salud_progress";
}

function loadProgress() {
  if (!progressKey) progressKey = guessProgressKey();
  var raw = localStorage.getItem(progressKey);
  if (!raw) return { completed: [] };
  try {
    var obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return { completed: [] };
    if (!Array.isArray(obj.completed)) obj.completed = [];
    return obj;
  } catch (e) { return { completed: [] }; }
}

function saveProgress(obj) {
  if (!progressKey) progressKey = guessProgressKey();
  try { localStorage.setItem(progressKey, JSON.stringify(obj)); } catch (e) {}
}

function markCompleted(partId) {
  var p = loadProgress();
  if (!Array.isArray(p.completed)) p.completed = [];
  if (p.completed.indexOf(partId) === -1) {
    p.completed.push(partId);
    saveProgress(p);
  }
}

/* ── Confeti ── */
var CONFETTI_COLORS = ["#fbbf24","#34d399","#60a5fa","#f472b6","#a78bfa","#fb923c"];

function spawnConfetti(n) {
  var container = document.getElementById("confettiContainer");
  if (!container) return;
  for (var i = 0; i < n; i++) {
    (function (delay) {
      setTimeout(function () {
        var el = document.createElement("div");
        el.className = "confetti-piece";
        el.style.left   = (20 + Math.random() * 60) + "%";
        el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        el.style.width  = (8 + Math.random() * 10) + "px";
        el.style.height = (8 + Math.random() * 10) + "px";
        el.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";
        el.style.animationDuration = (1.2 + Math.random() * 0.8) + "s";
        container.appendChild(el);
        setTimeout(function () { el.remove(); }, 2000);
      }, delay);
    })(i * 80);
  }
}

function spawnConfettiBurst() {
  for (var i = 0; i < 65; i++) {
    (function (delay) {
      setTimeout(function () {
        var container = document.getElementById("confettiContainer");
        if (!container) return;
        var el = document.createElement("div");
        el.className = "confetti-piece";
        el.style.left   = (3 + Math.random() * 94) + "%";
        el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        el.style.width  = (8  + Math.random() * 14) + "px";
        el.style.height = (8  + Math.random() * 14) + "px";
        el.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";
        el.style.animationDuration = (1.5 + Math.random() * 1.5) + "s";
        container.appendChild(el);
        setTimeout(function () { el.remove(); }, 3000);
      }, delay);
    })(i * 38);
  }
}
