import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PARTS } from "./parts.js";
import { loadProgress } from "./storage.js";

var app = document.getElementById("app");
var fade = document.getElementById("fade");
var statusEl = document.getElementById("status");
var heartsEl = document.getElementById("hearts");

var scene = null;
var camera = null;
var renderer = null;
var raycaster = null;

var girl = null;
var rig = {};
var basePose = new Map();

var hotspotGroup = null;
var hotspotMeshes = new Map();
var clickables = [];

var pointer = new THREE.Vector2();
var clock = new THREE.Clock();

var isTransitioning = false;

// Tween cámara
var camFromPos = new THREE.Vector3();
var camFromLook = new THREE.Vector3();
var camToPos = new THREE.Vector3();
var camToLook = new THREE.Vector3();
var camT = 0;

// Intro suave
var introRunning = true;
var introT = 0;

init().then(function () {
  animate();
}).catch(function (e) {
  console.error(e);
});

async function init() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b1220, 3.0, 12);

  camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.05, 80);
  camera.position.set(0.8, 1.7, 5.2);
  camera.lookAt(0.2, 1.2, 0);

  renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0b1220, 1);
  app.appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();

  addClassroomLights();
  addClassroomScene();

  await loadGirlGLB("./assets/models/nina.glb");

  // Colocación de la niña en el aula
  girl.position.set(-0.6, 0, 0.3);
  girl.rotation.y = 0.35;

  addHotspots();

  refreshHUD();
  statusEl.textContent = "Toca un órgano en el cuerpo";

  window.addEventListener("resize", onResize, { passive: true });
  renderer.domElement.addEventListener("pointerdown", onPointerDown, { passive: true });
}

function addClassroomLights() {
  var ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);

  var key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(3.2, 5.0, 2.5);
  scene.add(key);

  var fill = new THREE.DirectionalLight(0xffffff, 0.25);
  fill.position.set(-3.0, 2.5, -2.5);
  scene.add(fill);

  // Luz cálida de “techo”
  var warm = new THREE.PointLight(0xffe2bf, 0.45, 10);
  warm.position.set(0.0, 3.2, 0.0);
  scene.add(warm);
}

function addClassroomScene() {
  // Suelo
  var floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 10),
    new THREE.MeshStandardMaterial({ color: 0x101a2e, roughness: 0.95, metalness: 0.0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);

  // Paredes
  var wallMat = new THREE.MeshStandardMaterial({ color: 0x12203a, roughness: 0.95, metalness: 0.0 });

  var back = new THREE.Mesh(new THREE.PlaneGeometry(12, 5), wallMat);
  back.position.set(0, 2.5, -4);
  scene.add(back);

  var left = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), wallMat);
  left.position.set(-6, 2.5, 0);
  left.rotation.y = Math.PI / 2;
  scene.add(left);

  var right = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), wallMat);
  right.position.set(6, 2.5, 0);
  right.rotation.y = -Math.PI / 2;
  scene.add(right);

  // Techo
  var ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 10),
    new THREE.MeshStandardMaterial({ color: 0x0e1830, roughness: 0.98, metalness: 0.0 })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 5;
  scene.add(ceiling);

  // Pizarra (verde)
  var boardFrame = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 1.9, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.85 })
  );
  boardFrame.position.set(0.7, 2.45, -3.88);
  scene.add(boardFrame);

  var board = new THREE.Mesh(
    new THREE.PlaneGeometry(5.0, 1.7),
    new THREE.MeshStandardMaterial({ color: 0x0e3b2b, roughness: 0.95, metalness: 0.0 })
  );
  board.position.set(0.7, 2.45, -3.85);
  scene.add(board);

  // Tiza dibujada (muy simple) usando planos blancos
  var chalkMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1.0, metalness: 0.0 });
  var chalkLine1 = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.06), chalkMat);
  chalkLine1.position.set(0.3, 2.9, -3.84);
  scene.add(chalkLine1);

  var chalkLine2 = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.06), chalkMat);
  chalkLine2.position.set(0.9, 2.65, -3.84);
  scene.add(chalkLine2);

  // Mesa del profe
  var teacherDesk = new THREE.Group();
  teacherDesk.position.set(-2.2, 0, -2.2);

  var deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.08, 0.9),
    new THREE.MeshStandardMaterial({ color: 0x3a2b20, roughness: 0.85 })
  );
  deskTop.position.y = 0.75;
  teacherDesk.add(deskTop);

  var deskBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.65, 0.85),
    new THREE.MeshStandardMaterial({ color: 0x2d2119, roughness: 0.9 })
  );
  deskBody.position.y = 0.37;
  teacherDesk.add(deskBody);

  scene.add(teacherDesk);

  // Mesas de alumnos (bloques simples, pocas para rendimiento)
  addStudentDesk(1.7, -0.7);
  addStudentDesk(3.0, -0.7);
  addStudentDesk(1.7, -1.9);
  addStudentDesk(3.0, -1.9);

  // Ventanas (lado derecho)
  addWindowPanel(5.75, 2.6, -1.7);
  addWindowPanel(5.75, 2.6, 0.6);

  // Carteles de aula (planos)
  addPoster(-5.8, 3.2, -1.5, "SALUD");
  addPoster(-5.8, 2.5, 0.4, "HÁBITOS");

  // Alfombra escenario
  var rug = new THREE.Mesh(
    new THREE.CircleGeometry(2.2, 40),
    new THREE.MeshStandardMaterial({ color: 0x142348, roughness: 0.9, metalness: 0.0 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(-0.1, 0.01, 0.7);
  scene.add(rug);

  // Luz suave en el “escenario”
  var stage = new THREE.PointLight(0x9fd0ff, 0.25, 7.0);
  stage.position.set(-0.2, 2.8, 1.2);
  scene.add(stage);
}

function addStudentDesk(x, z) {
  var g = new THREE.Group();
  g.position.set(x, 0, z);

  var top = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.07, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x3a2b20, roughness: 0.85 })
  );
  top.position.y = 0.68;
  g.add(top);

  var body = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.55, 0.65),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.95 })
  );
  body.position.y = 0.32;
  g.add(body);

  scene.add(g);
}

function addWindowPanel(x, y, z) {
  var frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.4, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.85 })
  );
  frame.position.set(x, y, z);
  frame.rotation.y = -Math.PI / 2;
  scene.add(frame);

  var glass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.1, 1.3),
    new THREE.MeshStandardMaterial({
      color: 0x9fd0ff,
      roughness: 0.2,
      metalness: 0.0,
      transparent: true,
      opacity: 0.12
    })
  );
  glass.position.set(x - 0.02, y, z);
  glass.rotation.y = -Math.PI / 2;
  scene.add(glass);
}

function addPoster(x, y, z, text) {
  var canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(22, 22, 468, 468);

  ctx.font = "bold 84px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 256);

  var tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;

  var mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.95, metalness: 0.0 });
  var plane = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.05), mat);
  plane.position.set(x, y, z);
  plane.rotation.y = Math.PI / 2;
  scene.add(plane);
}

async function loadGirlGLB(url) {
  var loader = new GLTFLoader();

  var gltf = await new Promise(function (resolve, reject) {
    loader.load(url, resolve, undefined, reject);
  });

  if (girl) scene.remove(girl);

  girl = gltf.scene;
  girl.position.set(0, 0, 0);
  scene.add(girl);

  normalizeModelToFloor(girl, 1.7);

  rig = buildRigRefs(girl);
  basePose = captureBasePose(rig);
}

function normalizeModelToFloor(model, targetHeight) {
  var box = new THREE.Box3().setFromObject(model);
  var size = new THREE.Vector3();
  box.getSize(size);

  var currentHeight = Math.max(0.0001, size.y);
  var scale = targetHeight / currentHeight;
  model.scale.setScalar(scale);

  var box2 = new THREE.Box3().setFromObject(model);
  var center2 = new THREE.Vector3();
  box2.getCenter(center2);

  var yMin = box2.min.y;
  model.position.y += -yMin;
  model.position.x += -center2.x;
  model.position.z += -center2.z;
}

function buildRigRefs(root) {
  function get(name) { return root.getObjectByName(name) || null; }

  return {
    hips: get("Hips"),
    spine: get("Spine"),
    spine1: get("Spine1"),
    spine2: get("Spine2"),
    neck: get("Neck"),
    head: get("Head"),
    leftEye: get("LeftEye") || get("EyeLeft"),
    rightEye: get("RightEye") || get("EyeRight"),
    leftArm: get("LeftArm"),
    rightArm: get("RightArm"),
    leftUpLeg: get("LeftUpLeg"),
    rightUpLeg: get("RightUpLeg"),
    leftLeg: get("LeftLeg"),
    rightLeg: get("RightLeg")
  };
}

function captureBasePose(refs) {
  var m = new Map();
  var keys = Object.keys(refs);
  var i = 0;
  for (i = 0; i < keys.length; i++) {
    var k = keys[i];
    var obj = refs[k];
    if (obj) m.set(k, obj.quaternion.clone());
  }
  return m;
}

function addHotspots() {
  if (hotspotGroup) scene.remove(hotspotGroup);

  hotspotGroup = new THREE.Group();
  hotspotMeshes.clear();
  clickables = [];

  var invisible = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 });

  createHotspot("vista", 0.18, invisible);
  createHotspot("oido", 0.18, invisible);
  createHotspot("cerebro", 0.20, invisible);
  createHotspot("pulmones", 0.24, invisible);
  createHotspot("corazon", 0.20, invisible);
  createHotspot("estomago", 0.22, invisible);

  scene.add(hotspotGroup);

  updateHotspotsPositions();
}

function createHotspot(id, radius, mat) {
  var mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 18, 18), mat);
  mesh.userData = { clickable: true, partId: id, kind: "hotspot", r: radius };

  hotspotGroup.add(mesh);
  hotspotMeshes.set(id, mesh);
  clickables.push(mesh);
}

function updateHotspotsPositions() {
  if (!girl) return;

  var p;

  p = getEyesWorldPosition();
  if (p) setHotspot("vista", p);

  p = getEarWorldPosition();
  if (p) setHotspot("oido", p);

  p = getBrainWorldPosition();
  if (p) setHotspot("cerebro", p);

  p = getLungsWorldPosition();
  if (p) setHotspot("pulmones", p);

  p = getHeartWorldPosition();
  if (p) setHotspot("corazon", p);

  p = getStomachWorldPosition();
  if (p) setHotspot("estomago", p);
}

function setHotspot(id, worldPos) {
  var h = hotspotMeshes.get(id);
  if (!h) return;
  h.position.copy(worldPos);
}

function getEyesWorldPosition() {
  var l = rig.leftEye;
  var r = rig.rightEye;

  if (l && r) {
    var a = new THREE.Vector3();
    var b = new THREE.Vector3();
    l.getWorldPosition(a);
    r.getWorldPosition(b);
    return a.add(b).multiplyScalar(0.5);
  }

  if (rig.head) {
    var p = new THREE.Vector3();
    rig.head.getWorldPosition(p);
    p.y -= 0.02;
    p.z += 0.05;
    return p;
  }
  return null;
}

function getEarWorldPosition() {
  if (!rig.head) return null;

  var headPos = new THREE.Vector3();
  var headQuat = new THREE.Quaternion();
  rig.head.getWorldPosition(headPos);
  rig.head.getWorldQuaternion(headQuat);

  var offset = new THREE.Vector3(0.16, 0.02, 0.02).applyQuaternion(headQuat);
  return headPos.add(offset);
}

function getBrainWorldPosition() {
  if (!rig.head) return null;

  var headPos = new THREE.Vector3();
  var headQuat = new THREE.Quaternion();
  rig.head.getWorldPosition(headPos);
  rig.head.getWorldQuaternion(headQuat);

  var offset = new THREE.Vector3(0, 0.18, 0.02).applyQuaternion(headQuat);
  return headPos.add(offset);
}

function getChestRef() {
  return rig.spine2 || rig.spine1 || rig.spine || rig.hips || null;
}

function getLungsWorldPosition() {
  var ref = getChestRef();
  if (!ref) return null;

  var p = new THREE.Vector3();
  var q = new THREE.Quaternion();
  ref.getWorldPosition(p);
  ref.getWorldQuaternion(q);

  var offset = new THREE.Vector3(0, 0.18, 0.16).applyQuaternion(q);
  return p.add(offset);
}

function getHeartWorldPosition() {
  var ref = getChestRef();
  if (!ref) return null;

  var p = new THREE.Vector3();
  var q = new THREE.Quaternion();
  ref.getWorldPosition(p);
  ref.getWorldQuaternion(q);

  var offset = new THREE.Vector3(-0.10, 0.10, 0.17).applyQuaternion(q);
  return p.add(offset);
}

function getStomachWorldPosition() {
  var ref = rig.spine1 || rig.spine || rig.hips;
  if (!ref) return null;

  var p = new THREE.Vector3();
  var q = new THREE.Quaternion();
  ref.getWorldPosition(p);
  ref.getWorldQuaternion(q);

  var offset = new THREE.Vector3(-0.06, -0.18, 0.16).applyQuaternion(q);
  return p.add(offset);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerDown(e) {
  if (isTransitioning) return;

  var rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

  raycaster.setFromCamera(pointer, camera);

  var hits = raycaster.intersectObjects(clickables, true);
  if (!hits || hits.length === 0) return;

  var chosen = hits[0].object;
  while (chosen && (!chosen.userData || !chosen.userData.clickable) && chosen.parent) chosen = chosen.parent;
  if (!chosen || !chosen.userData || !chosen.userData.clickable) return;

  var id = chosen.userData.partId;
  var part = findPart(id);
  if (!part) return;

  startTransitionToPart(part);
}

function findPart(id) {
  var i = 0;
  for (i = 0; i < PARTS.length; i++) {
    if (PARTS[i].id === id) return PARTS[i];
  }
  return null;
}

function startTransitionToPart(part) {
  isTransitioning = true;
  statusEl.textContent = part.name + ": " + part.habit;

  var focus = getFocusPosition(part.id);

  camFromPos.copy(camera.position);
  camFromLook.copy(getCameraLookPoint());

  camToLook.copy(focus);

  var dist = 1.35;
  if (part.id === "vista") dist = 1.05;
  if (part.id === "oido") dist = 1.10;
  if (part.id === "cerebro") dist = 1.05;
  if (part.id === "corazon") dist = 1.25;
  if (part.id === "pulmones") dist = 1.30;
  if (part.id === "estomago") dist = 1.30;

  camToPos.copy(focus).add(new THREE.Vector3(0, 0.25, dist));

  camT = 0;

  setTimeout(function () { if (fade) fade.classList.add("on"); }, 520);
  setTimeout(function () { window.location.href = part.url; }, 950);
}

function getCameraLookPoint() {
  var dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  return camera.position.clone().add(dir);
}

function getFocusPosition(id) {
  var hs = hotspotMeshes.get(id);
  if (hs) return hs.position.clone();
  return new THREE.Vector3(0, 1.2, 0);
}

function animate() {
  requestAnimationFrame(animate);

  var dt = clock.getDelta();
  var t = clock.elapsedTime;

  updateIntro(dt);
  updateProceduralPose(t);
  updateHotspotsPositions();
  updateCameraTween(dt);

  renderer.render(scene, camera);
}

function updateIntro(dt) {
  if (!introRunning) return;

  introT = Math.min(introT + dt * 0.7, 1);
  var ease = smoothstep(introT);

  var fromPos = new THREE.Vector3(0.8, 1.7, 5.2);
  var toPos = new THREE.Vector3(0.6, 1.45, 3.6);

  var fromLook = new THREE.Vector3(0.2, 1.2, 0);
  var toLook = new THREE.Vector3(-0.1, 1.2, 0.3);

  camera.position.lerpVectors(fromPos, toPos, ease);
  var look = new THREE.Vector3().lerpVectors(fromLook, toLook, ease);
  camera.lookAt(look);

  if (introT >= 1) introRunning = false;
}

function updateProceduralPose(t) {
  if (!girl) return;

  // Movimiento suave para que esté viva
  girl.position.y += (Math.sin(t * 2.2) * 0.01 - girl.position.y) * 0.12;

  applyBone("leftUpLeg", Math.sin(t * 4.1 + 0) * 0.18, 0, 0);
  applyBone("rightUpLeg", Math.sin(t * 4.1 + Math.PI) * 0.18, 0, 0);
  applyBone("leftArm", Math.sin(t * 4.1 + Math.PI) * 0.14, 0, 0);
  applyBone("rightArm", Math.sin(t * 4.1 + 0) * 0.14, 0, 0);
  applyBone("spine1", 0, Math.sin(t * 1.2) * 0.03, 0);

  if (rig.head && basePose.get("head")) {
    rig.head.quaternion.copy(basePose.get("head"));
    rig.head.rotateY(Math.sin(t * 0.9) * 0.08);
  }
}

function applyBone(key, dx, dy, dz) {
  var bone = rig[key];
  var base = basePose.get(key);
  if (!bone || !base) return;

  bone.quaternion.copy(base);
  bone.rotateX(dx);
  bone.rotateY(dy);
  bone.rotateZ(dz);
}

function updateCameraTween(dt) {
  if (!isTransitioning) return;

  camT = Math.min(camT + dt * 1.5, 1);
  var ease = smoothstep(camT);

  camera.position.lerpVectors(camFromPos, camToPos, ease);
  var look = new THREE.Vector3().lerpVectors(camFromLook, camToLook, ease);
  camera.lookAt(look);
}

function smoothstep(x) {
  return x * x * (3 - 2 * x);
}

function refreshHUD() {
  var progress = loadProgress();
  var total = PARTS.length;
  var done = progress.completed.length;

  heartsEl.innerHTML = "";
  var i = 0;
  for (i = 0; i < total; i++) {
    var d = document.createElement("span");
    d.className = "heart" + (i < done ? " on" : "");
    heartsEl.appendChild(d);
  }
}
