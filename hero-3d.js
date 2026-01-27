import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("hero-3d");
if (!canvas) throw new Error("Canvas not found");

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0.2, 6);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.85));

const key = new THREE.DirectionalLight(0xffffff, 0.9);
key.position.set(4, 5, 3);
scene.add(key);

const accent = new THREE.DirectionalLight(0x6d5cff, 0.6);
accent.position.set(-4, -2, 3);
scene.add(accent);

// Group
const group = new THREE.Group();
scene.add(group);

// Materials
const matA = new THREE.MeshStandardMaterial({
  color: 0x6d5cff,
  metalness: 0.25,
  roughness: 0.35,
  emissive: 0x120a3a,
  emissiveIntensity: 0.4
});

const matB = new THREE.MeshStandardMaterial({
  color: 0x3aa0ff,
  metalness: 0.25,
  roughness: 0.4,
  emissive: 0x061a33,
  emissiveIntensity: 0.45
});

// Rings
function ring(r, t, mat, rx, rz){
  const geo = new THREE.TorusGeometry(r, t, 24, 140);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = rx;
  mesh.rotation.z = rz;
  return mesh;
}

const r1 = ring(1.6, 0.09, matA, Math.PI * 0.45, 0);
const r2 = ring(1.2, 0.085, matB, Math.PI * 0.35, Math.PI * 0.2);
const r3 = ring(0.85, 0.08, matA, Math.PI * 0.55, -Math.PI * 0.18);

group.add(r1, r2, r3);

// Resize
function resize(){
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas);
resize();

// Mouse interaction (خفيف)
let mx = 0, my = 0;
window.addEventListener("mousemove", e => {
  mx = (e.clientX / window.innerWidth) * 2 - 1;
  my = (e.clientY / window.innerHeight) * 2 - 1;
});

// Animate
function animate(){
  group.rotation.y += 0.002;
  group.rotation.x += 0.0015;

  group.rotation.y += (mx * 0.12 - group.rotation.y) * 0.03;
  group.rotation.x += (-my * 0.08 - group.rotation.x) * 0.03;

  r1.rotation.z += 0.006;
  r2.rotation.z -= 0.008;
  r3.rotation.z += 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
