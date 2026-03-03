"use strict";

var PART_ID = "corazon";

var cardsEl = null;
var goodZone = null;
var badZone = null;
var goodDrop = null;
var badDrop = null;

var toastEl = null;
var counterEl = null;
var finishEl = null;

var btnReset = null;
var btnAgain = null;

var sndClap = null;
var sndOhh = null;

var items = [];
var totalGood = 0;
var goodPlaced = 0;

var activeCard = null;
var activePointerId = null;
var startParent = null;
var placeholder = null;

var offsetX = 0;
var offsetY = 0;

var progressKey = null;

document.addEventListener("DOMContentLoaded", function () {
  cardsEl = document.getElementById("cards");
  goodZone = document.getElementById("goodZone");
  badZone = document.getElementById("badZone");
  goodDrop = document.getElementById("goodDrop");
  badDrop = document.getElementById("badDrop");

  toastEl = document.getElementById("toast");
  counterEl = document.getElementById("counter");
  finishEl = document.getElementById("finish");

  btnReset = document.getElementById("btnReset");
  btnAgain = document.getElementById("btnAgain");

  sndClap = document.getElementById("sndClap");
  sndOhh = document.getElementById("sndOhh");

  btnReset.addEventListener("click", function () { resetGame(); });
  btnAgain.addEventListener("click", function () { resetGame(); });

  buildItems();
  renderAll();
  showToast("EMPIEZA. LAS BUENAS A BIEN", "good", 1200);
});

function buildItems() {
  items = [
    { id: "correr",  emoji: "🏃", text: "CORRER",          mini: "MOVERSE",        good: true },
    { id: "bailar",  emoji: "💃", text: "BAILAR",          mini: "MOVERSE",        good: true },
    { id: "saltar",  emoji: "🤸", text: "SALTAR",          mini: "JUGAR",          good: true },
    { id: "agua",    emoji: "💧", text: "BEBER AGUA",      mini: "HIDRATARSE",     good: true },
    { id: "dormir",  emoji: "😴", text: "DORMIR BIEN",     mini: "DESCANSAR",      good: true },
    { id: "jugar",   emoji: "⚽", text: "JUGAR FUERA",     mini: "AIRE Y JUEGO",   good: true },

    { id: "chuches", emoji: "🍭", text: "MUCHAS CHUCHES",  mini: "AZÚCAR",         good: false },
    { id: "tele",    emoji: "📺", text: "PANTALLAS",       mini: "TODO EL DÍA",    good: false },
    { id: "sofa",    emoji: "🛋️", text: "MUCHO SOFÁ",      mini: "SIN MOVERSE",    good: false },
    { id: "noSleep", emoji: "🌙", text: "NO DORMIR",       mini: "SIN DESCANSO",   good: false }
  ];

  totalGood = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i].good) totalGood++;
  }
}

function renderAll() {
  cardsEl.innerHTML = "";
  goodDrop.innerHTML = "";
  badDrop.innerHTML = "";

  goodPlaced = 0;
  hideFinish();

  for (var i = 0; i < items.length; i++) {
    var card = makeCard(items[i]);
    cardsEl.appendChild(card);
  }

  updateCounter();
}

function makeCard(item) {
  var card = document.createElement("div");
  card.className = "card";
  card.dataset.good = item.good ? "1" : "0";
  card.dataset.locked = "0";

  var e = document.createElement("div");
  e.className = "card-emoji";
  e.textContent = item.emoji;

  var t = document.createElement("div");
  t.className = "card-text";
  t.textContent = item.text;

  var m = document.createElement("div");
  m.className = "card-mini";
  m.textContent = item.mini;

  card.appendChild(e);
  card.appendChild(t);
  card.appendChild(m);

  card.addEventListener("pointerdown", onPointerDownCard);

  return card;
}

function onPointerDownCard(ev) {
  var card = ev.currentTarget;
  if (card.dataset.locked === "1") return;

  activeCard = card;
  activePointerId = ev.pointerId;
  startParent = card.parentElement;

  placeholder = document.createElement("div");
  placeholder.style.width = card.offsetWidth + "px";
  placeholder.style.height = card.offsetHeight + "px";
  placeholder.style.borderRadius = "18px";
  placeholder.style.border = "3px dashed rgba(0,0,0,0.18)";
  placeholder.style.background = "rgba(255,255,255,0.55)";

  startParent.insertBefore(placeholder, card);

  var rect = card.getBoundingClientRect();
  offsetX = ev.clientX - rect.left;
  offsetY = ev.clientY - rect.top;

  card.classList.add("dragging");
  card.style.left = rect.left + "px";
  card.style.top = rect.top + "px";
  card.style.width = rect.width + "px";

  document.body.appendChild(card);

  try { card.setPointerCapture(ev.pointerId); } catch (e) {}

  card.addEventListener("pointermove", onPointerMoveCard);
  card.addEventListener("pointerup", onPointerUpCard);
  card.addEventListener("pointercancel", onPointerUpCard);

  ev.preventDefault();
}

function onPointerMoveCard(ev) {
  if (!activeCard) return;
  if (ev.pointerId !== activePointerId) return;

  var x = ev.clientX - offsetX;
  var y = ev.clientY - offsetY;

  activeCard.style.left = x + "px";
  activeCard.style.top = y + "px";
}

function onPointerUpCard(ev) {
  if (!activeCard) return;
  if (ev.pointerId !== activePointerId) return;

  var card = activeCard;

  try { card.releasePointerCapture(ev.pointerId); } catch (e) {}

  card.removeEventListener("pointermove", onPointerMoveCard);
  card.removeEventListener("pointerup", onPointerUpCard);
  card.removeEventListener("pointercancel", onPointerUpCard);

  var droppedZone = detectZone(ev.clientX, ev.clientY);

  if (!droppedZone) {
    returnToPlace(card);
    return;
  }

  applyDrop(card, droppedZone);
}

function detectZone(x, y) {
  var gr = goodZone.getBoundingClientRect();
  var br = badZone.getBoundingClientRect();

  if (inRect(x, y, gr)) return "good";
  if (inRect(x, y, br)) return "bad";

  return "";
}

function inRect(x, y, r) {
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

function applyDrop(card, zone) {
  var isGood = card.dataset.good === "1";

  if (zone === "good" && isGood) {
    lockCard(card, goodDrop);
    goodPlaced++;
    updateCounter();
    showToast("¡BIEN! 👏", "good", 900);
    playSound(sndClap);
    checkFinish();
    return;
  }

  if (zone === "bad" && !isGood) {
    lockCard(card, badDrop);
    showToast("¡BIEN! 👏", "good", 900);
    playSound(sndClap);
    return;
  }

  showToast("OOOHHH...", "bad", 950);
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
  card.style.left = "";
  card.style.top = "";
  card.style.width = "";
}

function removePlaceholder() {
  if (placeholder && placeholder.parentElement) {
    placeholder.parentElement.removeChild(placeholder);
  }
  placeholder = null;
}

function clearActive() {
  activeCard = null;
  activePointerId = null;
  startParent = null;
}

function updateCounter() {
  counterEl.textContent = "BUENAS: " + goodPlaced + " DE " + totalGood;
}

function checkFinish() {
  if (goodPlaced < totalGood) return;

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

function resetGame() {
  renderAll();
  showToast("OTRA VEZ 😊", "good", 900);
}

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
