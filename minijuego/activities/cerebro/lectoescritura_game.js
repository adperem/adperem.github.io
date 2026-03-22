"use strict";

var PART_ID = "cerebro_lectoescritura";

/* ── Pool de sílabas con pistas ── */
var POOL = [
  { syl: "MA", hint: "MANO"     },
  { syl: "NA", hint: "NARANJA"  },
  { syl: "PA", hint: "ZAPATO"   },
  { syl: "TA", hint: "TAZA"     },
  { syl: "LA", hint: "LUNA"     },
  { syl: "SA", hint: "MESA"     },
  { syl: "CA", hint: "CASA"     },
  { syl: "PE", hint: "PELOTA"   },
  { syl: "LE", hint: "LECHE"    },
  { syl: "MI", hint: "CAMINO"   },
  { syl: "SI", hint: "SILLA"    },
  { syl: "NO", hint: "NOCHE"    },
  { syl: "BO", hint: "GLOBO"    },
  { syl: "LO", hint: "LOBO"     },
  { syl: "RI", hint: "RICO"     },
  { syl: "TU", hint: "TULIPAN"  },
  { syl: "FU", hint: "FUEGO"    },
  { syl: "GU", hint: "AGUJA"    },
];

var ROUNDS_COUNT = 10;

/* ── Referencias DOM ── */
var syllableEl  = null;
var roundLabelEl = null;
var wordInputEl = null;
var btnCheck    = null;
var btnHint     = null;
var hintAreaEl  = null;
var counterEl   = null;
var toastEl     = null;
var finishEl    = null;
var btnReset    = null;
var btnAgain    = null;
var sndClap     = null;
var sndOhh      = null;

/* ── Estado ── */
var rounds       = [];
var currentRound = 0;
var completed    = 0;
var hintShown    = false;
var progressKey  = null;

/* ── Init ── */
document.addEventListener("DOMContentLoaded", function () {
  syllableEl   = document.getElementById("syllable");
  roundLabelEl = document.getElementById("roundLabel");
  wordInputEl  = document.getElementById("wordInput");
  btnCheck     = document.getElementById("btnCheck");
  btnHint      = document.getElementById("btnHint");
  hintAreaEl   = document.getElementById("hintArea");
  counterEl    = document.getElementById("counter");
  toastEl      = document.getElementById("toast");
  finishEl     = document.getElementById("finish");
  btnReset     = document.getElementById("btnReset");
  btnAgain     = document.getElementById("btnAgain");
  sndClap      = document.getElementById("sndClap");
  sndOhh       = document.getElementById("sndOhh");

  btnCheck.addEventListener("click", checkAnswer);
  btnHint.addEventListener("click", revealHint);
  btnReset.addEventListener("click", resetGame);
  btnAgain.addEventListener("click", resetGame);
  wordInputEl.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter") checkAnswer();
  });

  /* Carga de audio diferida */
  [sndClap, sndOhh].forEach(function (el) {
    if (el && el.dataset.src) el.src = el.dataset.src;
  });

  resetGame();
  showToast("ESCRIBE UNA PALABRA CON LA SÍLABA 💬", "good", 1500);
});

/* ── Construcción de rondas ── */
function buildRounds() {
  var pool = POOL.slice();
  shuffleInPlace(pool);
  rounds = pool.slice(0, ROUNDS_COUNT);
}

/* ── Reset ── */
function resetGame() {
  buildRounds();
  currentRound = 0;
  completed    = 0;
  hideFinish();
  updateCounter();
  showRound();
}

/* ── Mostrar ronda ── */
function showRound() {
  var r = rounds[currentRound];

  hintShown           = false;
  hintAreaEl.textContent = "";
  hintAreaEl.classList.remove("visible");
  wordInputEl.value   = "";
  wordInputEl.disabled = false;
  btnCheck.disabled   = false;
  btnHint.disabled    = false;

  /* Reanima la pastilla */
  syllableEl.style.animation = "none";
  void syllableEl.offsetWidth; /* reflow */
  syllableEl.style.animation  = "";
  syllableEl.textContent       = r.syl;

  roundLabelEl.textContent = (currentRound + 1) + " DE " + rounds.length;

  setTimeout(function () {
    try { wordInputEl.focus(); } catch (e) {}
  }, 300);
}

/* ── Comprobar respuesta ── */
function checkAnswer() {
  var raw = wordInputEl.value.trim();

  if (!raw) {
    showToast("ESCRIBE UNA PALABRA 📝", "bad", 900);
    shakeEl(wordInputEl);
    return;
  }

  var word = normalize(raw);
  var syl  = normalize(rounds[currentRound].syl);

  /* La palabra debe tener al menos la sílaba + 2 letras más */
  if (word.length < syl.length + 2) {
    showToast("ESCRIBE UNA PALABRA MÁS LARGA 📏", "bad", 1000);
    shakeEl(wordInputEl);
    return;
  }

  if (!word.includes(syl)) {
    showToast("ESA PALABRA NO TIENE «" + rounds[currentRound].syl + "» 🤔", "bad", 1200);
    shakeEl(wordInputEl);
    playSound(sndOhh);
    return;
  }

  /* ¡Correcto! */
  wordInputEl.disabled = true;
  btnCheck.disabled    = true;
  btnHint.disabled     = true;

  completed++;
  updateCounter();
  showToast("¡MUY BIEN! " + raw.toUpperCase() + " 👏", "good", 1200);
  playSound(sndClap);
  spawnConfetti(7);

  setTimeout(function () {
    currentRound++;
    if (currentRound >= rounds.length) {
      finishGame();
    } else {
      showRound();
    }
  }, 1300);
}

/* ── Pista ── */
function revealHint() {
  if (hintShown) return;
  hintShown = true;
  btnHint.disabled = true;

  var r   = rounds[currentRound];
  var syl = r.syl;
  var hint = r.hint;

  /* Resalta la sílaba dentro de la palabra de ejemplo */
  var normHint = normalize(hint);
  var normSyl  = normalize(syl);
  var idx      = normHint.indexOf(normSyl);
  var html     = hint;
  if (idx !== -1) {
    html =
      hint.slice(0, idx) +
      '<span class="hl">' + hint.slice(idx, idx + syl.length) + '</span>' +
      hint.slice(idx + syl.length);
  }

  hintAreaEl.innerHTML = "EJEMPLO: " + html;
  hintAreaEl.classList.remove("visible");
  void hintAreaEl.offsetWidth;
  hintAreaEl.classList.add("visible");
}

/* ── Normaliza: mayúsculas + quita tildes en vocales (Ñ se conserva) ── */
function normalize(str) {
  return str.toUpperCase()
    .replace(/[ÁÀÂ]/g, "A")
    .replace(/[ÉÈÊ]/g, "E")
    .replace(/[ÍÌÎ]/g, "I")
    .replace(/[ÓÒÔ]/g, "O")
    .replace(/[ÚÙÛÜ]/g, "U");
}

/* ── UI helpers ── */
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

function shakeEl(el) {
  try {
    el.animate(
      [
        { transform: "translateX(0px)"  },
        { transform: "translateX(-9px)" },
        { transform: "translateX(9px)"  },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)"  },
        { transform: "translateX(0px)"  }
      ],
      { duration: 240, iterations: 1 }
    );
  } catch (e) {}
}

/* ── Audio ── */
function playSound(audioEl) {
  if (!audioEl) return;
  try { audioEl.pause(); audioEl.currentTime = 0; } catch (e) {}
  var p = null;
  try { p = audioEl.play(); } catch (e) { p = null; }
  if (p && p.catch) p.catch(function () {});
}

/* ── Utilidades ── */
function shuffleInPlace(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
}

/* ── Progreso (localStorage) ── */
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
  } catch (e) {
    return { completed: [] };
  }
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
        el.style.width  = (8  + Math.random() * 10) + "px";
        el.style.height = (8  + Math.random() * 10) + "px";
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
        el.style.left   = (3  + Math.random() * 94) + "%";
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
