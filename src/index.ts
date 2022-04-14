import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import matcapPorcelain from "/matcap-porcelain-white.jpeg?url";
import Stats from "stats.js";

let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, -70);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xeeeeee, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

let thingsWaitingOn = 4;

let sound = new Audio("roundtablerival.mp3");
sound.volume = 0.1;
sound.oncanplay = () => {
  thingLoaded();
};

const textureLoader = new THREE.TextureLoader();
const material = new THREE.MeshMatcapMaterial({
  matcap: textureLoader.load(matcapPorcelain, () => thingLoaded()),
});

const rightClip = new THREE.Plane(new THREE.Vector3(1, 0, 0), 50);
const leftClip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 52);
renderer.clippingPlanes = [rightClip, leftClip];

let elephant: THREE.Object3D;
const loader = new OBJLoader();
const heartSize = 1;
let matHeart = new THREE.MeshPhongMaterial({ color: 0xff0000 });
let heart = new THREE.Mesh(new THREE.BoxGeometry(heartSize, heartSize, 3), matHeart);
loader.load("elephant2.obj", (object) => {
  object.traverse((el) => {
    if (el instanceof THREE.Mesh) {
      el.material = material;
    }
  });
  elephant = object;
  elephant.scale.setX(-1);
  thingLoaded();

  elephant.add(heart);
});

let present: THREE.Object3D;
const mtlLoader = new MTLLoader();
mtlLoader.load("presentGreenLow.mtl", (ms) => {
  loader.setMaterials(ms);
  loader.load("presentGreenLow.obj", (object) => {
    console.log(object);
    present = object;
    object.scale.set(6, 6, 6);
    object.children.forEach(x=>x.translateY(-0.15));
    let clone = heart.clone();
    clone.scale.set(2/6,2/6,1/6);
    present.add(clone)
    thingLoaded();
  });
});

function thingLoaded() {
  thingsWaitingOn--;
  console.log(thingsWaitingOn);

  if (thingsWaitingOn == 0) {
    start();
  }
}

let up = 10;
let D = -25;
let E = D + up;
let F = E + up;
let G = F + up;
let A = G + up;
let B = A + up;
let C = B + up;

let beat = 60 / 128;
let offset = 1.982;
let dead = false;
function topBottom(x: number) {
  let out = [];
  for (let i = 0; i < 20; i++) {
    out.push({ time: x * beat + offset, posY: -25 / 2 - Math.sin((i / 20) * Math.PI * 2) * 12.5, posX: -50 + Math.cos((i / 20) * Math.PI * 2) * 12.5, speedX: 2, speedY: 0 });
  }
  for (let i = 0; i < 4; i++) {
    out.push({ time: x * beat + offset, posY: -25 / 2 - Math.sin((i / 4) * Math.PI * 2) * 6, posX: -50 + Math.cos((i / 4) * Math.PI * 2) * 6, speedX: 1, speedY: 0 });
  }
  for (let i = 0; i < 20; i++) {
    out.push({ time: (x + 1) * beat + offset, posY: 25 / 2 - Math.sin((i / 20) * Math.PI * 2) * 12.5, posX: -50 + Math.cos((i / 20) * Math.PI * 2) * 12.5, speedX: 2, speedY: 0 });
  }
  for (let i = 0; i < 4; i++) {
    out.push({ time: (x + 1) * beat + offset, posY: 25 / 2 - Math.sin((i / 4) * Math.PI * 2) * 6, posX: -50 + Math.cos((i / 4) * Math.PI * 2) * 6, speedX: 1, speedY: 0 });
  }
  return out;
}
function topBottom2(x: number) {
  let out = [];
  for (let i = 0; i <= 10; i++) {
    out.push({ time: x * beat + offset, posY: -25 / 2 + (i * 5) / 4, posX: -50 - i * 2.5, speedX: 2, speedY: 0 });
    out.push({ time: x * beat + offset, posY: -25 / 2 - (i * 5) / 4, posX: -50 - i * 2.5, speedX: 2, speedY: 0 });
  }
  for (let i = 0; i <= 10; i++) {
    out.push({ time: (x + 1) * beat + offset, posY: 25 / 2 - (i * 5) / 4, posX: -50 - i * 2.5, speedX: 2, speedY: 0 });
    out.push({ time: (x + 1) * beat + offset, posY: 25 / 2 + (i * 5) / 4, posX: -50 - i * 2.5, speedX: 2, speedY: 0 });
  }
  return out;
}

function sweep(x: number) {
  const range = 5;
  let out = [];
  out.push({ time: x * beat + offset, posY: 0, posX: -50, speedX: 1, speedY: 0 });
  for (let i = 1; i < range; i++) {
    out.push({ time: (x + i / range) * beat + offset, posY: 0, posX: -50, speedX: 1, speedY: i / range / 2 });
    out.push({ time: (x + i / range) * beat + offset, posY: 0, posX: -50, speedX: 1, speedY: -i / range / 2 });
  }
  return out;
}
function trill(x: number) {
  let out = [];
  for (let i = 0; i < 20; i++) {
    let y = Math.sin((i / 20) * Math.PI * 2);
    let x = Math.cos((i / 20) * Math.PI * 2);
    out.push({ time: x * beat + offset, posY: y * 10, posX: -60 + x * 10, speedX: x, speedY: y });
  }
  return out;
  return [
    { time: x * beat + offset, posY: F, posX: -50, speedX: 1, speedY: 0 },
    { time: (x + 1 / 6) * beat + offset, posY: G, posX: -50, speedX: 1, speedY: 0 },
    { time: (x + 1 / 3) * beat + offset, posY: F, posX: -50, speedX: 1, speedY: 0 },
    { time: (x + 1 / 2) * beat + offset, posY: E, posX: -50, speedX: 1, speedY: 0 },
  ];
}
function trill2(x: number) {
  let out = [];
  for (let i = 0; i < 20; i++) {
    out.push({ time: x * beat + offset, posY: -25 + Math.cos((i / 19 - 0.5) * Math.PI) * 10, posX: -50 + Math.sin((i / 19 - 0.5) * Math.PI) * 10, speedX: 1, speedY: 1 });
    out.push({ time: x * beat + offset, posY: 25 - Math.cos((i / 19 - 0.5) * Math.PI) * 10, posX: -50 + Math.sin((i / 19 - 0.5) * Math.PI) * 10, speedX: 1, speedY: -1 });
  }
  return out;
}
function doubleAttempt(x: number) {
  let out = [];
  for (let i = 0; i < 5; i++) {
    out.push({ time: (x + (i / 5) * 0.25) * beat + offset, posY: D + (i / 4) * 7.5, posX: -50, speedX: 1, speedY: 0 });
    out.push({ time: (x + (i / 5) * 0.25) * beat + offset, posY: -D - (i / 4) * 7.5, posX: -50, speedX: 1, speedY: 0 });
  }
  for (let i = 0; i < 10; i++) {
    out.push({ time: (x + 0.75 + (i / 10) * 0.5) * beat + offset, posY: D + (i / 8) * 15, posX: -50, speedX: 1, speedY: 0 });
    out.push({ time: (x + 0.75 + (i / 10) * 0.5) * beat + offset, posY: -D - (i / 8) * 15, posX: -50, speedX: 1, speedY: 0 });
  }
  return out;
  return [
    { time: (x + 0.0) * beat + offset, posY: D, posX: -50, speedX: 1, speedY: 0 },
    { time: (x + 0.25) * beat + offset, posY: F, posX: -50, speedX: 1, speedY: 0 },
    { time: (x + 0.75) * beat + offset, posY: D, posX: -50, speedX: 1, speedY: 0 },
    { time: (x + 1.0) * beat + offset, posY: F, posX: -50, speedX: 1, speedY: 0 },
    { time: (x + 1.25) * beat + offset, posY: A, posX: -50, speedX: 1, speedY: 0 },
  ];
}
function fullSweep(x: number) {
  let out = [];
  for (let i = 0; i < 30; i++) {
    if (i == 10 || i == 11 || i == 20 || i==21) continue;
    out.push({ time: (x + (i / 30) * 2.5) * beat + offset, posY: -25 + (i / 29) * 50, posX: -50, speedX: 1, speedY: 0 });
  }
  return out;
}
function diamond(x: number) {
  let out = [];
  for (let i = 0; i <= 10; i++) {
    out.push({ time: (x + (i / 10) * 2.25) * beat + offset, posY: -25 + (i / 10) * 50, posX: -50, speedX: 1, speedY: 0 });
    out.push({ time: (x + (i / 10) * 2.25) * beat + offset, posY: 25 - (i / 10) * 50, posX: -50, speedX: 1, speedY: 0 });
  }

  return out;
}
let presents: { time: number; posX: number; posY: number; speedX: number; speedY: number; obj?: THREE.Object3D }[] = [
  { time: 0, posY: 0, posX: -50, speedX: 1, speedY: 0 },
  ...topBottom(0),
  ...sweep(2),
  // { time: 3.0 * beat + offset, posY: D, posX: -50, speedX: 1, speedY: 0 },
  ...doubleAttempt(3.75),
  { time: 5.5 * beat + offset, posY: D, posX: -50, speedX: 1, speedY: 0 },
  { time: 5.5 * beat + offset, posY: -D, posX: -50, speedX: 1, speedY: 0 },
  { time: 6.0 * beat + offset, posY: F, posX: -50, speedX: 1, speedY: 0 },
  { time: 6.0 * beat + offset, posY: -F, posX: -50, speedX: 1, speedY: 0 },
  { time: 6.5 * beat + offset, posY: G, posX: -50, speedX: 1, speedY: 0 },
  { time: 6.5 * beat + offset, posY: -G, posX: -50, speedX: 1, speedY: 0 },
  ...trill(7),
  ...topBottom(8),
  ...sweep(10),
  // { time: 11.0 * beat + offset, posY: D, posX: -50, speedX: 1, speedY: 0 },
  ...doubleAttempt(11.75),
  // { time: 11.75 * beat + offset, posY: D, posX: -50, speedX: 1, speedY: 0 },
  // { time: 12.0 * beat + offset, posY: F, posX: -50, speedX: 1, speedY: 0 },
  // { time: 12.25 * beat + offset, posY: D, posX: -50, speedX: 1, speedY: 0 },
  // { time: 12.50 * beat+offset, posY: A, posX: -50, speedX: 1, speedY: 0 },
  // { time: 12.75 * beat + offset, posY: F, posX: -50, speedX: 1, speedY: 0 },
  { time: 13.0 * beat + offset, posY: D, posX: -50, speedX: 1, speedY: 0 },
  { time: 13.0 * beat + offset, posY: -D, posX: -50, speedX: 1, speedY: 0 },
  { time: 13.5 * beat + offset, posY: E, posX: -50, speedX: 1, speedY: 0 },
  { time: 13.5 * beat + offset, posY: -E, posX: -50, speedX: 1, speedY: 0 },
  ...trill2(14),
  { time: 15.0 * beat + offset, posY: D, posX: -50, speedX: 1, speedY: 0 },
  ...topBottom2(16),
  ...sweep(18),
  { time: 19.0 * beat + offset, posY: D, posX: -50, speedX: 1, speedY: 0 },
  { time: 19.0 * beat + offset, posY: -D, posX: -50, speedX: 1, speedY: 0 },
  { time: 19.5 * beat + offset, posY: A, posX: -50, speedX: 1, speedY: 0 },
  { time: 19.5 * beat + offset, posY: -A, posX: -50, speedX: 1, speedY: 0 },
  { time: 19.75 * beat + offset, posY: D, posX: -50, speedX: 1, speedY: 0 },
  { time: 19.75 * beat + offset, posY: -D, posX: -50, speedX: 1, speedY: 0 },
  { time: 20.0 * beat + offset, posY: F, posX: -50, speedX: 1, speedY: 0 },
  { time: 20.0 * beat + offset, posY: -F, posX: -50, speedX: 1, speedY: 0 },
  ...fullSweep(20.5),
  ...trill(23),
  ...topBottom(24),
  ...sweep(26),
  ...diamond(28)
];

for (let i = 31; i < 1000; i++) {
  presents.push({ time: i * beat + offset, posY: 0, posX: -50, speedX: 1, speedY: 0 });
}

let keys: { [keycode: string]: boolean } = {};
let minx = new THREE.Vector3(-50, -25, 0);
let maxx = new THREE.Vector3(50, 25, 0);
function update() {
  if (keys["w"] || keys["ArrowUp"]) {
    elephant.position.y += 0.75;
  }
  if (keys["s"] || keys["ArrowDown"]) {
    elephant.position.y -= 0.75;
  }
  if (keys["a"] || keys["ArrowLeft"]) {
    elephant.position.x += 0.75;
  }
  if (keys["d"] || keys["ArrowRight"]) {
    elephant.position.x -= 0.75;
  }
  elephant.position.clamp(minx, maxx);

  for (const myPresent of presents) {
    if (sound.currentTime < myPresent.time) {
      break;
    }

    const newX = (((sound.currentTime - myPresent.time) * 100) / (5 * beat)) * myPresent.speedX + myPresent.posX;
    const newY = (((sound.currentTime - myPresent.time) * 100) / (5 * beat)) * myPresent.speedY + myPresent.posY;
    if (newX < minx.x || newX > maxx.x + 10 || newY < minx.y || newY > maxx.y) {
      if (myPresent.obj) {
        scene.remove(myPresent.obj);
        myPresent.obj = undefined;
      }
      continue;
    }
    if (!myPresent.obj) {
      const obj = present.clone();
      obj.position.set(myPresent.posX, myPresent.posY, 0);
      scene.add(obj);
      myPresent.obj = obj;
      // let x = Math.random() * 2 * Math.PI;
      // let y = Math.random() * 2 * Math.PI;
      // obj.rotateX(x);
      // obj.rotateY(y);
    }
    myPresent.obj.position.x = newX;
    myPresent.obj.position.y = newY;

    if (
      newX - 1.5 * heartSize < elephant.position.x && //
      newX + 1.5 * heartSize > elephant.position.x && //
      newY - 1.5 * heartSize < elephant.position.y && //
      newY + 1.5 * heartSize > elephant.position.y
    ) {
      dead = true;
      sound.pause();
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  stats.begin();

  if (!sound.paused) update();
  renderer.render(scene, camera);

  stats.end();
}

function start() {
  scene.add(elephant);

  let geometry = new THREE.BoxGeometry(100, 50, 10);
  let geo = new THREE.EdgesGeometry(geometry);

  let mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });

  let wireframe = new THREE.LineSegments(geo, mat);

  scene.add(wireframe);

  animate();
}

window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
  if (event.key == " ") {
    if (dead) {
      dead = false;
      sound.currentTime = 0;
      elephant.position.x = 0;
      elephant.position.y = 0;
      for (const myPresent of presents) {
        if (myPresent.obj) {
          scene.remove(myPresent.obj);
          myPresent.obj = undefined;
        }
      }
    }
    if (sound.paused) sound.play();
    else sound.pause();
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

document.addEventListener("visibilitychange", () => {
  sound.pause();
});

window.onclick = () => {
  if (sound.paused) {
    if (dead) {
      dead = false;
      sound.currentTime = 0;
      elephant.position.x = 0;
      elephant.position.y = 0;
      for (const myPresent of presents) {
        if (myPresent.obj) {
          scene.remove(myPresent.obj);
          myPresent.obj = undefined;
        }
      }
    }
    sound.play();
  } else sound.pause();
};
