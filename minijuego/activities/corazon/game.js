"use strict";

var PART_ID = "corazon";
var COLORS = ["#fbbf24","#34d399","#60a5fa","#f472b6","#a78bfa","#fb923c","#4ade80","#38bdf8","#f97316"];

var cardsEl, goodZone, badZone, goodDrop, badDrop;
var toastEl, counterEl, progressBarEl, finishEl, confettiEl;
var btnReset, btnAgain, sndClap, sndOhh;

var items = [];
var totalGood = 0, goodPlaced = 0, totalPlaced = 0;

var activeCard = null, activePointerId = null;
var startParent = null, placeholder = null;
var offsetX = 0, offsetY = 0;
var progressKey = null;

document.addEventListener("DOMContentLoaded", function () {
  cardsEl       = document.getElementById("cards");
  goodZone      = document.getElementById("goodZone");
  badZone       = document.getElementById("badZone");
  goodDrop      = document.getElementById("goodDrop");
  badDrop       = document.getElementById("badDrop");
  toastEl       = document.getElementById("toast");
  counterEl     = document.getElementById("counter");
  progressBarEl = document.getElementById("progressBar");
  finishEl      = document.getElementById("finish");
  confettiEl    = document.getElementById("confettiLayer");
  btnReset      = document.getElementById("btnReset");
  btnAgain      = document.getElementById("btnAgain");
  sndClap       = document.getElementById("sndClap");
  sndOhh        = document.getElementById("sndOhh");

  btnReset.addEventListener("click", function () { resetGame(); });
  btnAgain.addEventListener("click", function () { resetGame(); });

  buildItems();
  renderAll();
  showToast("💪 LAS BUENAS A BIEN, LAS MALAS A MAL", "good", 1600);
});

/* ── DATOS ── */
function buildItems() {
  items = [
    { id:"correr",  emoji:"🏃", text:"CORRER",         mini:"MOVERSE",       good:true  },
    { id:"bailar",  emoji:"💃", text:"BAILAR",         mini:"MOVERSE",       good:true  },
    { id:"saltar",  emoji:"🤸", text:"SALTAR",         mini:"JUGAR",         good:true  },
    { id:"agua",    emoji:"💧", text:"BEBER AGUA",     mini:"HIDRATARSE",    good:true  },
    { id:"dormir",  emoji:"😴", text:"DORMIR BIEN",    mini:"DESCANSAR",     good:true  },
    { id:"jugar",   emoji:"⚽", text:"JUGAR FUERA",    mini:"AIRE Y JUEGO",  good:true  },
    { id:"chuches", emoji:"🍭", text:"MUCHAS CHUCHES", mini:"AZÚCAR",        good:false },
    { id:"tele",    emoji:"📺", text:"PANTALLAS",      mini:"TODO EL DÍA",   good:false },
    { id:"sofa",    emoji:"🛋️", text:"MUCHO SOFÁ",     mini:"SIN MOVERSE",   good:false },
    { id:"noSleep", emoji:"🌙", text:"NO DORMIR",      mini:"SIN DESCANSO",  good:false }
  ];
  totalGood = items.filter(function(i){ return i.good; }).length;
}

/* ── RENDER ── */
function renderAll() {
  cardsEl.innerHTML = "";
  goodDrop.innerHTML = "";
  badDrop.innerHTML = "";
  goodPlaced = 0;
  totalPlaced = 0;
  hideFinish();
  updateCounter();

  // Mezclar
  var shuffled = items.slice();
  shuffleInPlace(shuffled);

  shuffled.forEach(function (item, i) {
    var card = makeCard(item);
    card.style.animationDelay = (i * 0.055) + "s";
    cardsEl.appendChild(card);
  });
}

function makeCard(item) {
  var card = document.createElement("div");
  card.className = "card";
  card.dataset.good   = item.good ? "1" : "0";
  card.dataset.locked = "0";

  card.innerHTML =
    '<div class="card-emoji">' + item.emoji + '</div>' +
    '<div class="card-text">'  + item.text  + '</div>' +
    '<div class="card-mini">'  + item.mini  + '</div>';

  card.addEventListener("pointerdown", onPointerDownCard);
  return card;
}

/* ── DRAG ── */
function onPointerDownCard(ev) {
  var card = ev.currentTarget;
  if (card.dataset.locked === "1") return;

  activeCard      = card;
  activePointerId = ev.pointerId;
  startParent     = card.parentElement;

  // Placeholder
  placeholder = document.createElement("div");
  placeholder.style.cssText =
    "width:" + card.offsetWidth + "px;" +
    "height:" + card.offsetHeight + "px;" +
    "border-radius:18px;" +
    "border:3px dashed rgba(0,0,0,0.15);" +
    "background:rgba(255,255,255,0.45);";
  startParent.insertBefore(placeholder, card);

  var rect = card.getBoundingClientRect();
  offsetX = ev.clientX - rect.left;
  offsetY = ev.clientY - rect.top;

  card.classList.add("dragging");
  card.style.left  = rect.left  + "px";
  card.style.top   = rect.top   + "px";
  card.style.width = rect.width + "px";
  document.body.appendChild(card);

  try { card.setPointerCapture(ev.pointerId); } catch(e) {}

  card.addEventListener("pointermove",   onPointerMoveCard);
  card.addEventListener("pointerup",     onPointerUpCard);
  card.addEventListener("pointercancel", onPointerUpCard);

  ev.preventDefault();
}

function onPointerMoveCard(ev) {
  if (!activeCard || ev.pointerId !== activePointerId) return;

  activeCard.style.left = (ev.clientX - offsetX) + "px";
  activeCard.style.top  = (ev.clientY - offsetY) + "px";

  // Highlight zonas
  var gRect = goodZone.getBoundingClientRect();
  var bRect = badZone.getBoundingClientRect();
  var overGood = inRect(ev.clientX, ev.clientY, gRect);
  var overBad  = inRect(ev.clientX, ev.clientY, bRect);

  goodZone.classList.toggle("drag-over", overGood);
  badZone.classList.toggle("drag-over",  overBad);
  goodDrop.classList.toggle("drag-over", overGood);
  badDrop.classList.toggle("drag-over",  overBad);
}

function onPointerUpCard(ev) {
  if (!activeCard || ev.pointerId !== activePointerId) return;

  var card = activeCard;
  try { card.releasePointerCapture(ev.pointerId); } catch(e) {}

  card.removeEventListener("pointermove",   onPointerMoveCard);
  card.removeEventListener("pointerup",     onPointerUpCard);
  card.removeEventListener("pointercancel", onPointerUpCard);

  // Quitar highlights
  goodZone.classList.remove("drag-over");
  badZone.classList.remove("drag-over");
  goodDrop.classList.remove("drag-over");
  badDrop.classList.remove("drag-over");

  var zone = detectZone(ev.clientX, ev.clientY);
  if (!zone) { returnToPlace(card); return; }
  applyDrop(card, zone);
}

/* ── LÓGICA DE DROP ── */
function detectZone(x, y) {
  if (inRect(x, y, goodZone.getBoundingClientRect())) return "good";
  if (inRect(x, y, badZone.getBoundingClientRect()))  return "bad";
  return "";
}

function inRect(x, y, r) {
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

function applyDrop(card, zone) {
  var isGood = card.dataset.good === "1";

  if ((zone === "good" && isGood) || (zone === "bad" && !isGood)) {
    // ✅ CORRECTO
    var target = (zone === "good") ? goodDrop : badDrop;
    lockCard(card, target);
    totalPlaced++;

    if (zone === "good") {
      goodPlaced++;
      // Latido del corazón
      goodZone.classList.remove("beat");
      void goodZone.offsetWidth;
      goodZone.classList.add("beat");
    }

    updateCounter();
    showToast(zone === "good" ? "¡BIEN! 💚" : "¡CORRECTO! 👍", "good", 950);
    playSound(sndClap);
    spawnConfetti(7);
    checkFinish();
    return;
  }

  // ❌ INCORRECTO
  showToast("OOOHHH... 😅 INTÉNTALO OTRA VEZ", "bad", 1100);
  playSound(sndOhh);
  shake(card);
  returnToPlace(card);
}

function lockCard(card, target) {
  cleanupDrag(card);
  card.dataset.locked = "1";
  card.classList.add("locked");
  removePlaceholder();
  target.appendChild(card);
  clearActive();
}

function returnToPlace(card) {
  cleanupDrag(card);
  if (placeholder && placeholder.parentElement) {
    placeholder.parentElement.replaceChild(card, placeholder);
  } else if (startParent) {
    startParent.appendChild(card);
  }
  placeholder = null;
  clearActive();
}

function cleanupDrag(card) {
  card.classList.remove("dragging");
  card.style.left = card.style.top = card.style.width = "";
}

function removePlaceholder() {
  if (placeholder && placeholder.parentElement) placeholder.parentElement.removeChild(placeholder);
  placeholder = null;
}

function clearActive() {
  activeCard = activePointerId = startParent = null;
}

/* ── CONTADOR Y PROGRESO ── */
function updateCounter() {
  counterEl.textContent = "BUENAS: " + goodPlaced + " DE " + totalGood;
  if (progressBarEl) {
    progressBarEl.style.width = ((goodPlaced / totalGood) * 100) + "%";
  }
}

/* ── FIN ── */
function checkFinish() {
  if (goodPlaced < totalGood) return;
  markCompleted(PART_ID);
  if (progressBarEl) progressBarEl.style.width = "100%";
  spawnConfettiBurst();
  showFinish();
  showToast("¡ACTIVIDAD COMPLETADA! 🌟", "good", 2200);
  playSound(sndClap);
}

function showFinish() { finishEl.classList.add("on"); finishEl.setAttribute("aria-hidden","false"); }
function hideFinish() { finishEl.classList.remove("on"); finishEl.setAttribute("aria-hidden","true"); }

function resetGame() {
  renderAll();
  showToast("🚀 ¡OTRA VEZ!", "good", 1000);
}

/* ── TOAST ── */
function showToast(text, kind, ms) {
  toastEl.textContent = text;
  toastEl.classList.remove("good","bad","on");
  void toastEl.offsetWidth;
  if (kind === "good") toastEl.classList.add("good");
  if (kind === "bad")  toastEl.classList.add("bad");
  toastEl.classList.add("on");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function(){ toastEl.classList.remove("on"); }, ms || 900);
}

/* ── SHAKE ── */
function shake(el) {
  try {
    el.animate([
      {transform:"translateX(0)"},{transform:"translateX(-10px)"},
      {transform:"translateX(10px)"},{transform:"translateX(-7px)"},
      {transform:"translateX(7px)"},{transform:"translateX(0)"}
    ], {duration:260});
  } catch(e) {}
}

/* ── CONFETI ── */
function spawnConfetti(n) {
  for (var i=0; i<n; i++) (function(d){ setTimeout(function(){ addPiece(15+Math.random()*70); }, d); })(i*70);
}
function spawnConfettiBurst() {
  for (var i=0; i<80; i++) (function(d){ setTimeout(function(){ addPiece(2+Math.random()*96); }, d); })(i*28);
}
function addPiece(leftPct) {
  if (!confettiEl) return;
  var el = document.createElement("div");
  el.className = "cp";
  el.style.left   = leftPct + "%";
  el.style.width  = (8 + Math.random()*12) + "px";
  el.style.height = (8 + Math.random()*12) + "px";
  el.style.background = COLORS[Math.floor(Math.random()*COLORS.length)];
  el.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";
  el.style.animationDuration = (1.2 + Math.random()*1.3) + "s";
  confettiEl.appendChild(el);
  setTimeout(function(){ el.remove(); }, 2600);
}

/* ── SONIDO ── */
function playSound(a) {
  if (!a) return;
  try { a.pause(); a.currentTime = 0; } catch(e) {}
  try { var p = a.play(); if (p && p.catch) p.catch(function(){}); } catch(e) {}
}

/* ── UTIL ── */
function shuffleInPlace(a) {
  for (var i=a.length-1; i>0; i--) {
    var j = Math.floor(Math.random()*(i+1)), t = a[i];
    a[i] = a[j]; a[j] = t;
  }
}

/* ── PROGRESO LOCAL ── */
function guessProgressKey() {
  for (var i=0; i<localStorage.length; i++) {
    var k = localStorage.key(i);
    try { var o = JSON.parse(localStorage.getItem(k)); if (o && Array.isArray(o.completed)) return k; } catch(e) {}
  }
  return "minijuego_salud_progress";
}
function loadProgress() {
  if (!progressKey) progressKey = guessProgressKey();
  try { var o = JSON.parse(localStorage.getItem(progressKey)); if (o && Array.isArray(o.completed)) return o; } catch(e) {}
  return { completed: [] };
}
function saveProgress(o) {
  if (!progressKey) progressKey = guessProgressKey();
  try { localStorage.setItem(progressKey, JSON.stringify(o)); } catch(e) {}
}
function markCompleted(id) {
  var p = loadProgress();
  if (p.completed.indexOf(id) === -1) { p.completed.push(id); saveProgress(p); }
}