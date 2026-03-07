"use strict";

var PART_ID = "cerebro";
var COLORS = ["#fbbf24","#34d399","#60a5fa","#f472b6","#a78bfa","#fb923c","#4ade80","#38bdf8"];

var progressEl, progressBarEl, imgEl, emojiEl, wordLabelEl, hintEl, optionsEl;
var toastEl, finishEl, finishScoreEl, confettiEl;
var btnReset, btnAgain, sndClap, sndOhh;
var rounds = [], allSyllables = [];
var idx = 0, locked = false;
var correctCount = 0, totalAnswers = 0;
var progressKey = null;

document.addEventListener("DOMContentLoaded", function () {
  progressEl    = document.getElementById("progress");
  progressBarEl = document.getElementById("progressBar");
  imgEl         = document.getElementById("img");
  emojiEl       = document.getElementById("emoji");
  wordLabelEl   = document.getElementById("wordLabel");
  hintEl        = document.getElementById("hint");
  optionsEl     = document.getElementById("options");
  toastEl       = document.getElementById("toast");
  finishEl      = document.getElementById("finish");
  finishScoreEl = document.getElementById("finishScore");
  confettiEl    = document.getElementById("confettiLayer");
  btnReset      = document.getElementById("btnReset");
  btnAgain      = document.getElementById("btnAgain");
  sndClap       = document.getElementById("sndClap");
  sndOhh        = document.getElementById("sndOhh");

  btnReset.addEventListener("click", resetGame);
  btnAgain.addEventListener("click", resetGame);

  buildRounds();
  resetGame();
  showToast("👆 TOCA LA SÍLABA CORRECTA", "good", 1400);
});

function buildRounds() {
  rounds = [
    { id:"mano",      syllable:"MA", emoji:"✋",  img:"./assets/mano.png" },
    { id:"pelicano",  syllable:"PE", emoji:"🐦",  img:"./assets/pelicano.png" },
    { id:"nido",      syllable:"NI", emoji:"🪺",  img:"./assets/nido.png" },
    { id:"nandu",     syllable:"ÑA", emoji:"🐦",  img:"./assets/nandu.png" },
    { id:"lagarto",   syllable:"LA", emoji:"🦎",  img:"./assets/lagarto.png" },
    { id:"saturno",   syllable:"SA", emoji:"🪐",  img:"./assets/saturno.png" },
    { id:"melocoton", syllable:"ME", emoji:"🍑",  img:"./assets/melocoton.png" },
    { id:"parque",    syllable:"PA", emoji:"🛝",  img:"./assets/parque.png" },
    { id:"noria",     syllable:"NO", emoji:"🎡",  img:"./assets/noria.png" },
    { id:"gnu",       syllable:"ÑU", emoji:"🦬",  img:"./assets/gnu.png" },
    { id:"leon",      syllable:"LE", emoji:"🦁",  img:"./assets/leon.png" },
    { id:"siete",     syllable:"SI", emoji:"7️⃣", img:"./assets/7.png" }
  ];
  allSyllables = rounds.map(function(r){ return r.syllable; });
}

function resetGame() {
  idx = 0; locked = false;
  correctCount = 0; totalAnswers = 0;
  hideFinish();
  renderRound();
  showToast("🚀 ¡EMPEZAMOS!", "good", 1100);
}

function renderRound() {
  if (idx >= rounds.length) { finishGame(); return; }
  locked = false;

  var r = rounds[idx];
  updateProgress();
  hintEl.textContent = "TOCA LA SÍLABA";

  // Animación emoji
  emojiEl.classList.remove("anim");
  void emojiEl.offsetWidth;
  emojiEl.textContent = r.emoji;
  emojiEl.classList.add("anim");

  imgEl.style.display = "none";
  emojiEl.style.display = "";
  imgEl.src = "";
  if (wordLabelEl) wordLabelEl.textContent = r.id.toUpperCase();
  if (r.img) {
    imgEl.alt = r.id;
    imgEl.src = r.img;
    imgEl.onload  = function(){ imgEl.style.display = "block"; };
    imgEl.onerror = function(){ imgEl.style.display = "none"; };
  }

  renderOptions(buildOptions(r.syllable, 4), r.syllable);
}

function updateProgress() {
  progressEl.textContent = (idx + 1) + " DE " + rounds.length;
  progressBarEl.style.width = ((idx / rounds.length) * 100) + "%";
}

function buildOptions(correct, count) {
  var pool = allSyllables.filter(function(s){ return s !== correct; });
  shuffleInPlace(pool);
  var opts = [correct];
  for (var j = 0; j < pool.length && opts.length < count; j++) opts.push(pool[j]);
  while (opts.length < count) opts.push(correct);
  shuffleInPlace(opts);
  return opts;
}

function renderOptions(opts, correct) {
  optionsEl.innerHTML = "";
  opts.forEach(function(s, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "opt";
    b.textContent = s;
    b.style.animationDelay = (i * 0.07) + "s";
    b.addEventListener("click", function(){ onPick(b, correct); });
    optionsEl.appendChild(b);
  });
}

function onPick(btn, correct) {
  if (locked) return;
  totalAnswers++;

  if (btn.textContent === correct) {
    locked = true;
    correctCount++;
    btn.classList.add("good","disabled");
    optionsEl.querySelectorAll(".opt").forEach(function(b){ b.classList.add("disabled"); });
    hintEl.textContent = "✅ ¡CORRECTO!";
    showToast("¡BIEN! 🎉", "good", 950);
    playSound(sndClap);
    spawnConfetti(9);
    setTimeout(function(){ idx++; renderRound(); }, 700);
    return;
  }

  btn.classList.add("bad");
  shake(btn);
  hintEl.textContent = "INTÉNTALO OTRA VEZ 💪";
  showToast("OOOHHH... 😅", "bad", 950);
  playSound(sndOhh);
  setTimeout(function(){ btn.classList.remove("bad"); }, 820);
}

/* FIN */
function finishGame() {
  markCompleted(PART_ID);
  progressBarEl.style.width = "100%";
  if (finishScoreEl) finishScoreEl.textContent = "✅ " + correctCount + " ACIERTOS DE " + totalAnswers + " INTENTOS";
  spawnConfettiBurst();
  showFinish();
  showToast("¡ACTIVIDAD COMPLETADA! 🌟", "good", 2200);
  playSound(sndClap);
}

function showFinish(){ finishEl.classList.add("on"); finishEl.setAttribute("aria-hidden","false"); }
function hideFinish(){ finishEl.classList.remove("on"); finishEl.setAttribute("aria-hidden","true"); }

/* TOAST */
function showToast(text, kind, ms) {
  toastEl.textContent = text;
  toastEl.classList.remove("good","bad","on");
  void toastEl.offsetWidth;
  if (kind==="good") toastEl.classList.add("good");
  if (kind==="bad")  toastEl.classList.add("bad");
  toastEl.classList.add("on");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function(){ toastEl.classList.remove("on"); }, ms||900);
}

/* SHAKE */
function shake(el) {
  try {
    el.animate([
      {transform:"translateX(0)"},{transform:"translateX(-10px)"},
      {transform:"translateX(10px)"},{transform:"translateX(-7px)"},
      {transform:"translateX(7px)"},{transform:"translateX(0)"}
    ], {duration:260});
  } catch(e){}
}

/* CONFETI */
function spawnConfetti(n) {
  for (var i=0;i<n;i++) (function(d){ setTimeout(function(){ addPiece(18+Math.random()*64); },d); })(i*75);
}
function spawnConfettiBurst() {
  for (var i=0;i<80;i++) (function(d){ setTimeout(function(){ addPiece(2+Math.random()*96); },d); })(i*30);
}
function addPiece(leftPct) {
  if (!confettiEl) return;
  var el = document.createElement("div");
  el.className = "cp";
  el.style.left = leftPct + "%";
  el.style.width  = (8+Math.random()*12)+"px";
  el.style.height = (8+Math.random()*12)+"px";
  el.style.background = COLORS[Math.floor(Math.random()*COLORS.length)];
  el.style.borderRadius = Math.random()>0.5?"50%":"3px";
  el.style.animationDuration = (1.2+Math.random()*1.2)+"s";
  confettiEl.appendChild(el);
  setTimeout(function(){ el.remove(); }, 2500);
}

/* SONIDO */
function playSound(a){
  if(!a) return;
  try{a.pause();a.currentTime=0;}catch(e){}
  try{var p=a.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
}

/* UTIL */
function shuffleInPlace(a){
  for(var i=a.length-1;i>0;i--){
    var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;
  }
}

/* PROGRESO */
function guessProgressKey(){
  for(var i=0;i<localStorage.length;i++){
    var k=localStorage.key(i);
    try{var o=JSON.parse(localStorage.getItem(k));if(o&&Array.isArray(o.completed))return k;}catch(e){}
  }
  return "minijuego_salud_progress";
}
function loadProgress(){
  if(!progressKey)progressKey=guessProgressKey();
  try{var o=JSON.parse(localStorage.getItem(progressKey));if(o&&Array.isArray(o.completed))return o;}catch(e){}
  return{completed:[]};
}
function saveProgress(o){
  if(!progressKey)progressKey=guessProgressKey();
  try{localStorage.setItem(progressKey,JSON.stringify(o));}catch(e){}
}
function markCompleted(id){
  var p=loadProgress();
  if(p.completed.indexOf(id)===-1){p.completed.push(id);saveProgress(p);}
}