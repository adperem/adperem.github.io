"use strict";

var PART_ID = "cerebro_bolsas_na_ne_ni_no_nu";

var wordsEl = null;
var counterEl = null;
var toastEl = null;
var finishEl = null;

var btnReset = null;
var btnAgain = null;

var sndClap = null;
var sndOhh = null;

var drops = {};
var total = 0;
var placed = 0;

var items = [];

var active = null;
var activePointerId = null;
var startParent = null;
var placeholder = null;
var offsetX = 0;
var offsetY = 0;

var progressKey = null;

document.addEventListener("DOMContentLoaded", function () {
  wordsEl = document.getElementById("words");
  counterEl = document.getElementById("counter");
  toastEl = document.getElementById("toast");
  finishEl = document.getElementById("finish");

  btnReset = document.getElementById("btnReset");
  btnAgain = document.getElementById("btnAgain");

  sndClap = document.getElementById("sndClap");
  sndOhh = document.getElementById("sndOhh");

  drops.NA = document.getElementById("dropNA");
  drops.NE = document.getElementById("dropNE");
  drops.NI = document.getElementById("dropNI");
  drops.NO = document.getElementById("dropNO");
  drops.NU = document.getElementById("dropNU");

  btnReset.addEventListener("click", function () { resetGame(); });
  btnAgain.addEventListener("click", function () { resetGame(); });

  buildItems();
  resetGame();
  showToast("ARRASTRA LAS PALABRAS A SU BOLSA", "good", 1100);
});

function buildItems() {
  items = [
    { word: "LIMONERO",   bag: "NE" },
    { word: "CONEJO",     bag: "NE" },
    { word: "CARNE",      bag: "NE" },
    { word: "PANADERO",   bag: "NA" },
    { word: "NOCHE",      bag: "NO" },
    { word: "CAMINO",     bag: "NO" },
    { word: "NARANJA",    bag: "NA" },
    { word: "CARNAVAL",   bag: "NA" },
    { word: "NATURALEZA", bag: "NA" },
    { word: "NOTA",       bag: "NO" },
    { word: "TENEDOR",    bag: "NE" },
    { word: "CENIZA",     bag: "NI" }
  ];
  total = items.length;
}

function resetGame() {
  wordsEl.innerHTML = "";
  drops.NA.innerHTML = "";
  drops.NE.innerHTML = "";
  drops.NI.innerHTML = "";
  drops.NO.innerHTML = "";
  drops.NU.innerHTML = "";

  placed = 0;
  hideFinish();
  updateCounter();

  var shuffled = items.slice();
  shuffleInPlace(shuffled);

  for (var i = 0; i < shuffled.length; i++) {
    var el = makeWordCard(shuffled[i]);
    wordsEl.appendChild(el);
  }
}

function makeWordCard(item) {
  var el = document.createElement("div");
  el.className = "word";
  el.textContent = item.word;
  el.dataset.bag = item.bag;
  el.dataset.locked = "0";

  el.addEventListener("pointerdown", onPointerDown);

  return el;
}

function onPointerDown(ev) {
  var el = ev.currentTarget;
  if (el.dataset.locked === "1") return;

  active = el;
  activePointerId = ev.pointerId;
  startParent = el.parentElement;

  placeholder = document.createElement("div");
  placeholder.style.width = el.offsetWidth + "px";
  placeholder.style.height = el.offsetHeight + "px";
  placeholder.style.borderRadius = "20px";
  placeholder.style.border = "3px dashed rgba(0,0,0,0.18)";
  placeholder.style.background = "rgba(255,255,255,0.55)";

  startParent.insertBefore(placeholder, el);

  var rect = el.getBoundingClientRect();
  offsetX = ev.clientX - rect.left;
  offsetY = ev.clientY - rect.top;

  el.classList.add("dragging");
  el.style.left = rect.left + "px";
  el.style.top = rect.top + "px";
  el.style.width = rect.width + "px";

  document.body.appendChild(el);

  try { el.setPointerCapture(ev.pointerId); } catch (e) {}

  el.addEventListener("pointermove", onPointerMove);
  el.addEventListener("pointerup", onPointerUp);
  el.addEventListener("pointercancel", onPointerUp);

  ev.preventDefault();
}

// 1. En onPointerMove: detectar bolsa bajo el cursor y añadir clase drag-over
function onPointerMove(ev) {
  if (!active || ev.pointerId !== activePointerId) return;
  active.style.left = (ev.clientX - offsetX) + "px";
  active.style.top  = (ev.clientY - offsetY) + "px";

  // highlight bolsa bajo cursor
  var keys = ["NA","NE","NI","NO","NU"];
  keys.forEach(function(k) {
    var bagEl  = drops[k].parentElement;
    var dropEl = drops[k];
    var r = bagEl.getBoundingClientRect();
    var over = ev.clientX>=r.left && ev.clientX<=r.right && ev.clientY>=r.top && ev.clientY<=r.bottom;
    bagEl.classList.toggle("drag-over", over);
    dropEl.classList.toggle("drag-over", over);
  });
}

// 2. En onPointerUp: limpiar drag-over
function onPointerUp(ev) {
  if (!active || ev.pointerId !== activePointerId) return;
  var el = active;
  try { el.releasePointerCapture(ev.pointerId); } catch(e) {}
  el.removeEventListener("pointermove", onPointerMove);
  el.removeEventListener("pointerup",   onPointerUp);
  el.removeEventListener("pointercancel", onPointerUp);

  // limpiar highlights
  ["NA","NE","NI","NO","NU"].forEach(function(k){
    drops[k].parentElement.classList.remove("drag-over");
    drops[k].classList.remove("drag-over");
  });

  var bag = detectBag(ev.clientX, ev.clientY);
  if (!bag) { returnToPlace(el); return; }
  applyDrop(el, bag);
}

function detectBag(x, y) {
  var keys = ["NA","NE","NI","NO","NU"];
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var bagEl = drops[k].parentElement;
    var r = bagEl.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return k;
  }
  return "";
}

function applyDrop(el, bag) {
  var correct = el.dataset.bag;

  if (bag === correct) {
    lockIntoBag(el, drops[bag]);
    placed++;
    updateCounter();
    showToast("¡BIEN! 👏", "good", 900);
    playSound(sndClap);

    if (placed >= total) {
      finishGame();
    }
    return;
  }

  showToast("OOOHHH...", "bad", 900);
  playSound(sndOhh);
  shake(el);
  returnToPlace(el);
}

function lockIntoBag(el, dropEl) {
  cleanupDrag(el);

  el.dataset.locked = "1";
  el.classList.add("locked");

  removePlaceholder();
  dropEl.appendChild(el);

  clearActive();
}

function returnToPlace(el) {
  cleanupDrag(el);

  if (placeholder && placeholder.parentElement) {
    placeholder.parentElement.replaceChild(el, placeholder);
  } else if (startParent) {
    startParent.appendChild(el);
  }

  placeholder = null;
  clearActive();
}

function cleanupDrag(el) {
  el.classList.remove("dragging");
  el.style.left = "";
  el.style.top = "";
  el.style.width = "";
}

function removePlaceholder() {
  if (placeholder && placeholder.parentElement) {
    placeholder.parentElement.removeChild(placeholder);
  }
  placeholder = null;
}

function clearActive() {
  active = null;
  activePointerId = null;
  startParent = null;
}

function updateCounter() {
  counterEl.textContent = placed + " DE " + total;
}

/* FIN */
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

/* SONIDOS */
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

var CONFETTI_COLORS = ["#fbbf24","#34d399","#60a5fa","#f472b6","#a78bfa","#fb923c"];
function spawnConfetti(n) {
  var container = document.getElementById("confettiContainer");
  if (!container) return;
  for (var i=0; i<n; i++) {
    (function(delay) {
      setTimeout(function() {
        var el = document.createElement("div");
        el.className = "confetti-piece";
        el.style.left = (20 + Math.random()*60) + "%";
        el.style.background = CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)];
        el.style.width  = (8 + Math.random()*10) + "px";
        el.style.height = (8 + Math.random()*10) + "px";
        el.style.borderRadius = Math.random()>0.5 ? "50%" : "3px";
        el.style.animationDuration = (1.2 + Math.random()*0.8) + "s";
        container.appendChild(el);
        setTimeout(function(){ el.remove(); }, 2000);
      }, delay);
    })(i * 80);
  }
}

function spawnConfettiBurst() {
  for (var i=0; i<65; i++) {
    (function(delay) {
      setTimeout(function() {
        var container = document.getElementById("confettiContainer");
        if (!container) return;
        var el = document.createElement("div");
        el.className = "confetti-piece";
        el.style.left = (3 + Math.random()*94) + "%";
        el.style.background = CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)];
        el.style.width  = (8 + Math.random()*14) + "px";
        el.style.height = (8 + Math.random()*14) + "px";
        el.style.borderRadius = Math.random()>0.5 ? "50%" : "3px";
        el.style.animationDuration = (1.5 + Math.random()*1.5) + "s";
        container.appendChild(el);
        setTimeout(function(){ el.remove(); }, 3000);
      }, delay);
    })(i * 38);
  }
}