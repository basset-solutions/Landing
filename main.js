import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

// Loader hide
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  setTimeout(() => {
    intro.style.opacity = "0";
    intro.style.transition = "opacity .35s ease";
    setTimeout(() => intro.remove(), 380);
  }, 1050);
});

const canvas = document.getElementById("three-canvas");

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.setClearAlpha(0);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0.25, 6.0);

// Lights (soft studio vibe)
scene.add(new THREE.AmbientLight(0xffffff, 0.85));

const key = new THREE.DirectionalLight(0xffffff, 0.9);
key.position.set(4, 5, 3);
scene.add(key);

const fill = new THREE.DirectionalLight(0x00ffe1, 0.55);
fill.position.set(-4, 1.5, 4);
scene.add(fill);

const mag = new THREE.DirectionalLight(0xff50b4, 0.25);
mag.position.set(2.5, -2, 2);
scene.add(mag);

// Background “card” panel (NOT space): big smooth plane
const bgGeo = new THREE.PlaneGeometry(18, 10, 1, 1);
const bgMat = new THREE.MeshBasicMaterial({
  color: 0x070a10,
  transparent: true,
  opacity: 0.0, // نخلي الخلفية من CSS، بس موجود لو احتجت لاحقاً
});
const bg = new THREE.Mesh(bgGeo, bgMat);
bg.position.z = -2.5;
scene.add(bg);

// Group
const group = new THREE.Group();
scene.add(group);

// Materials (glassy / modern)
const matA = new THREE.MeshPhysicalMaterial({
  color: 0x00ffe1,
  metalness: 0.2,
  roughness: 0.25,
  transmission: 0.35,      // pseudo-glass
  thickness: 1.0,
  clearcoat: 0.8,
  clearcoatRoughness: 0.25,
  ior: 1.3,
  transparent: true,
  opacity: 0.9,
});

const matB = matA.clone();
matB.color = new THREE.Color(0x7a5aff);
matB.transmission = 0.28;
matB.opacity = 0.88;

const matC = matA.clone();
matC.color = new THREE.Color(0xff50b4);
matC.transmission = 0.22;
matC.opacity = 0.85;

// Ribbons (torus knots look modern)
function ribbon(radius, tube, mat) {
  const geo = new THREE.TorusKnotGeometry(radius, tube, 220, 18, 2, 3);
  return new THREE.Mesh(geo, mat);
}

const r1 = ribbon(1.1, 0.10, matA);
r1.rotation.x = Math.PI * 0.18;

const r2 = ribbon(0.85, 0.09, matB);
r2.rotation.x = Math.PI * 0.55;
r2.rotation.z = Math.PI * 0.18;

const r3 = ribbon(0.62, 0.08, matC);
r3.rotation.x = Math.PI * 0.82;
r3.rotation.z = -Math.PI * 0.10;

group.add(r1, r2, r3);

// Core disc (clean tech)
const coreGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.10, 64);
const coreMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.65,
  roughness: 0.22,
  emissive: 0x001a16,
  emissiveIntensity: 0.35,
});
const core = new THREE.Mesh(coreGeo, coreMat);
core.rotation.x = Math.PI * 0.5;
group.add(core);

// Subtle glow plane behind (brand glow)
const glowGeo = new THREE.PlaneGeometry(5.5, 5.5);
const glowMat = new THREE.MeshBasicMaterial({
  color: 0x00ffe1,
  transparent: true,
  opacity: 0.06,
});
const glow = new THREE.Mesh(glowGeo, glowMat);
glow.position.z = -0.8;
group.add(glow);

// Resize
function resize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas);
resize();

// Parallax (mouse) — خفيف وراقي
let targetX = 0, targetY = 0;
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = (e.clientY / window.innerHeight) * 2 - 1;
  targetX = x;
  targetY = y;
});

// Animate
let t = 0;
function animate() {
  t += 0.01;

  // smooth tilt (NOT too “spacey”)
  group.rotation.y += (targetX * 0.35 - group.rotation.y) * 0.04;
  group.rotation.x += (-targetY * 0.22 - group.rotation.x) * 0.04;

  // classy motion
  r1.rotation.z += 0.006;
  r2.rotation.z -= 0.0075;
  r3.rotation.z += 0.009;

  group.position.y = Math.sin(t * 0.9) * 0.08;

  // subtle core pulse
  const pulse = 1 + Math.sin(t * 1.3) * 0.02;
  core.scale.set(pulse, pulse, pulse);
  glow.material.opacity = 0.05 + (Math.sin(t * 1.1) * 0.01);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Pause on hidden (performance)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) renderer.setAnimationLoop(null);
  else renderer.setAnimationLoop(animate);
});
