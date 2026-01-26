import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

// ---- Loader hide
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  setTimeout(() => {
    intro.style.opacity = "0";
    intro.style.transition = "opacity .35s ease";
    setTimeout(() => intro.remove(), 380);
  }, 1050);
});

// ---- Three setup
const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0.4, 6.2);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffffff, 1.0);
key.position.set(3, 4, 2);
scene.add(key);

const rim = new THREE.PointLight(0x00ffe1, 2.4, 30);
rim.position.set(-3, 1.5, 4);
scene.add(rim);

const magenta = new THREE.PointLight(0xff50b4, 1.6, 30);
magenta.position.set(2.6, -1.2, 3.5);
scene.add(magenta);

// Helpers: materials
const ringMatA = new THREE.MeshStandardMaterial({
  color: 0x00ffe1,
  metalness: 0.75,
  roughness: 0.25,
  emissive: 0x001a16,
  emissiveIntensity: 0.65,
});

const ringMatB = new THREE.MeshStandardMaterial({
  color: 0x7a5aff,
  metalness: 0.65,
  roughness: 0.35,
  emissive: 0x0b0520,
  emissiveIntensity: 0.7,
});

const ringMatC = new THREE.MeshStandardMaterial({
  color: 0xff50b4,
  metalness: 0.6,
  roughness: 0.4,
  emissive: 0x200010,
  emissiveIntensity: 0.7,
});

// Group
const group = new THREE.Group();
scene.add(group);

// Rings (torus)
function makeRing(radius, tube, mat) {
  const geo = new THREE.TorusGeometry(radius, tube, 24, 120);
  const mesh = new THREE.Mesh(geo, mat);
  return mesh;
}

const ring1 = makeRing(1.65, 0.06, ringMatA);
ring1.rotation.x = Math.PI * 0.62;

const ring2 = makeRing(1.2, 0.055, ringMatB);
ring2.rotation.x = Math.PI * 0.55;
ring2.rotation.z = Math.PI * 0.18;

const ring3 = makeRing(0.82, 0.05, ringMatC);
ring3.rotation.x = Math.PI * 0.52;
ring3.rotation.z = -Math.PI * 0.12;

group.add(ring1, ring2, ring3);

// Core (glowing sphere)
const coreGeo = new THREE.SphereGeometry(0.55, 64, 64);
const coreMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.2,
  emissive: 0x00ffe1,
  emissiveIntensity: 0.75,
});
const core = new THREE.Mesh(coreGeo, coreMat);
group.add(core);

// Subtle “aura” (bigger transparent sphere)
const auraGeo = new THREE.SphereGeometry(0.95, 64, 64);
const auraMat = new THREE.MeshBasicMaterial({
  color: 0x00ffe1,
  transparent: true,
  opacity: 0.06,
});
const aura = new THREE.Mesh(auraGeo, auraMat);
group.add(aura);

// Particles (points)
const starsCount = 700;
const positions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount; i++) {
  // donut-ish distribution
  const r = 2.2 + Math.random() * 4.0;
  const theta = Math.random() * Math.PI * 2;
  const y = (Math.random() - 0.5) * 2.2;
  positions[i * 3 + 0] = Math.cos(theta) * r;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = Math.sin(theta) * r - 2.0; // push back
}
const starsGeo = new THREE.BufferGeometry();
starsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const starsMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.015,
  transparent: true,
  opacity: 0.45,
});
const stars = new THREE.Points(starsGeo, starsMat);
scene.add(stars);

// --- Resize
function resize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
const ro = new ResizeObserver(resize);
ro.observe(canvas);
resize();

// --- Parallax (mouse)
let targetX = 0, targetY = 0;
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
  const y = (e.clientY / window.innerHeight) * 2 - 1;
  targetX = x;
  targetY = y;
});

// --- Animation loop
let t = 0;
function animate() {
  t += 0.01;

  // smooth parallax
  group.rotation.y += (targetX * 0.25 - group.rotation.y) * 0.04;
  group.rotation.x += (-targetY * 0.18 - group.rotation.x) * 0.04;

  // ring spins
  ring1.rotation.z += 0.010;
  ring2.rotation.z -= 0.012;
  ring3.rotation.z += 0.014;

  // float
  group.position.y = Math.sin(t * 0.9) * 0.08;

  // core pulse
  const pulse = 1 + Math.sin(t * 1.6) * 0.03;
  core.scale.set(pulse, pulse, pulse);
  aura.scale.set(1 + Math.sin(t * 1.2) * 0.06, 1 + Math.sin(t * 1.2) * 0.06, 1 + Math.sin(t * 1.2) * 0.06);

  // stars slow drift
  stars.rotation.y += 0.0008;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// pause when hidden (performance)
document.addEventListener("visibilitychange", () => {
  renderer.setAnimationLoop(document.hidden ? null : animate);
});
