"use strict";

var PART_ID = "cerebro";

var progressEl = null;
var imgEl = null;
var emojiEl = null;
var hintEl = null;
var optionsEl = null;

var toastEl = null;
var finishEl = null;

var btnReset = null;
var btnAgain = null;

var sndClap = null;
var sndOhh = null;

var rounds = [];
var allSyllables = [];

var idx = 0;
var locked = false;

var progressKey = null;

document.addEventListener("DOMContentLoaded", function () {
  progressEl = document.getElementById("progress");
  imgEl = document.getElementById("img");
  emojiEl = document.getElementById("emoji");
  hintEl = document.getElementById("hint");
  optionsEl = document.getElementById("options");

  toastEl = document.getElementById("toast");
  finishEl = document.getElementById("finish");

  btnReset = document.getElementById("btnReset");
  btnAgain = document.getElementById("btnAgain");

  sndClap = document.getElementById("sndClap");
  sndOhh = document.getElementById("sndOhh");

  btnReset.addEventListener("click", function () { resetGame(); });
  btnAgain.addEventListener("click", function () { resetGame(); });

  buildRounds();
  idx = 0;
  renderRound();
  showToast("TOCA LA SÍLABA", "good", 900);
});

function buildRounds() {
  rounds = [
    { id: "mano",      syllable: "MA", emoji: "✋",  img: "./assets/mano.png" },
    { id: "pelicano",  syllable: "PE", emoji: "🐦",  img: "./assets/pelicano.png" },
    { id: "nido",      syllable: "NI", emoji: "🪺",  img: "./assets/nido.png" },
    { id: "nandu",     syllable: "ÑA", emoji: "🐦",  img: "./assets/nandu.png" },
    { id: "lagarto",   syllable: "LA", emoji: "🦎",  img: "./assets/lagarto.png" },
    { id: "saturno",   syllable: "SA", emoji: "🪐",  img: "./assets/saturno.png" },
    { id: "melocoton", syllable: "ME", emoji: "🍑",  img: "./assets/melocoton.png" },
    { id: "parque",    syllable: "PA", emoji: "🛝",  img: "./assets/parque.png" },
    { id: "noria",     syllable: "NO", emoji: "🎡",  img: "./assets/noria.png" },
    { id: "gnu",       syllable: "ÑU", emoji: "🦬",  img: "./assets/gnu.png" },
    { id: "leon",      syllable: "LE", emoji: "🦁",  img: "./assets/leon.png" },
    { id: "siete",     syllable: "SI", emoji: "7️⃣", img: "./assets/7.png" }
  ];

  allSyllables = [];
  for (var i = 0; i < rounds.length; i++) {
    allSyllables.push(rounds[i].syllable);
  }
}

function resetGame() {
  idx = 0;
  locked = false;
  hideFinish();
  renderRound();
  showToast("EMPEZAMOS OTRA VEZ", "good", 900);
}

function renderRound() {
  if (idx >= rounds.length) {
    finishGame();
    return;
  }

  locked = false;

  var r = rounds[idx];
  updateProgress();

  hintEl.textContent = "TOCA LA SÍLABA";

  setPicture(r);

  var opts = buildOptions(r.syllable, 4);
  renderOptions(opts, r.syllable);
}

function updateProgress() {
  progressEl.textContent = (idx + 1) + " DE " + rounds.length;
}

function setPicture(r) {
  emojiEl.textContent = r.emoji;

  imgEl.style.display = "none";
  imgEl.src = "";
  imgEl.alt = "";

  imgEl.onerror = function () {
    imgEl.style.display = "none";
  };

  if (r.img) {
    imgEl.alt = r.id;
    imgEl.src = r.img;
    imgEl.onload = function () {
      imgEl.style.display = "block";
    };
  }
}

function buildOptions(correct, count) {
  var pool = [];
  for (var i = 0; i < allSyllables.length; i++) {
    if (allSyllables[i] !== correct) pool.push(allSyllables[i]);
  }

  shuffleInPlace(pool);

  var opts = [correct];
  for (var j = 0; j < pool.length && opts.length < count; j++) {
    opts.push(pool[j]);
  }

  while (opts.length < count) {
    opts.push(correct);
  }

  shuffleInPlace(opts);
  return opts;
}

function renderOptions(opts, correct) {
  optionsEl.innerHTML = "";

  for (var i = 0; i < opts.length; i++) {
    var s = opts[i];

    var b = document.createElement("button");
    b.type = "button";
    b.className = "opt";
    b.textContent = s;

    b.addEventListener("click", function (ev) {
      onPick(ev.currentTarget, correct);
    });

    optionsEl.appendChild(b);
  }
}

function onPick(btn, correct) {
  if (locked) return;

  var choice = btn.textContent;

  if (choice === correct) {
    locked = true;

    btn.classList.add("good");
    btn.classList.add("disabled");

    showToast("¡BIEN! 👏", "good", 800);
    playSound(sndClap);

    setTimeout(function () {
      idx++;
      renderRound();
    }, 650);

    return;
  }

  btn.classList.add("bad");
  shake(btn);

  showToast("OOOHHH...", "bad", 900);
  playSound(sndOhh);
}

function finishGame() {
  markCompleted(PART_ID);
  showFinish();
  showToast("¡ACTIVIDAD COMPLETADA! 👏", "good", 1400);
  playSound(sndClap);
}

function showFinish() {
  finishEl.classList.add("on");
  finishEl.setAttribute("aria-hidden", "false");
}

function hideFinish() {
  finishEl.classList.remove("on");
  finishEl.setAttribute("aria-hidden", "true");
}

/* TOAST */
function showToast(text, kind, ms) {
  toastEl.textContent = text;
  toastEl.classList.remove("good", "bad");
  if (kind === "good") toastEl.classList.add("good");
  if (kind === "bad") toastEl.classList.add("bad");
  toastEl.classList.add("on");

  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(function () {
    toastEl.classList.remove("on");
  }, ms || 900);
}

function shake(el) {
  try {
    el.animate(
      [
        { transform: "translateX(0px)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(0px)" }
      ],
      { duration: 220, iterations: 1 }
    );
  } catch (e) {}
}

/* SONIDOS DESDE ASSETS */
function playSound(audioEl) {
  if (!audioEl) return;

  try {
    audioEl.pause();
    audioEl.currentTime = 0;
  } catch (e) {}

  var p = null;
  try { p = audioEl.play(); } catch (e) { p = null; }
  if (p && p.catch) p.catch(function () {});
}

/* UTIL */
function shuffleInPlace(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
}

/* PROGRESO */
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
