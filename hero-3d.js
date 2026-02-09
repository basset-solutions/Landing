import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("hero-3d");
if (!canvas) return;

const isMobile = matchMedia("(max-width: 900px)").matches;

/* =========================
   Renderer (Sharp + Clean)
========================= */
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: !isMobile,
  powerPreference: isMobile ? "low-power" : "high-performance",
});

renderer.setPixelRatio(isMobile ? 1.3 : 1.6);
renderer.outputColorSpace = THREE.SRGBColorSpace;

/* =========================
   Scene + Camera
========================= */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 70);
camera.position.set(0, 0.05, 6);

/* =========================
   Lights (ألوان أوضح)
========================= */
scene.add(new THREE.AmbientLight(0xffffff, 0.85));

const purple = new THREE.DirectionalLight(0x6d5cff, 1.2);
purple.position.set(-5, 3, 3);
scene.add(purple);

const blue = new THREE.DirectionalLight(0x3aa0ff, 1.2);
blue.position.set(5, -2, 3);
scene.add(blue);

const teal = new THREE.DirectionalLight(0x38ffd6, 0.8); // اللون الثالث ✨
teal.position.set(0, -3, 3);
scene.add(teal);

/* =========================
   Geometry
========================= */
const tubularSegments = isMobile ? 130 : 200;
const radialSegments = isMobile ? 12 : 18;

const geo = new THREE.TorusKnotGeometry(
  1.15,
  0.14,
  tubularSegments,
  radialSegments,
  2,
  3
);

/* =========================
   ✅ Vertex Colors (3 ألوان)
========================= */
const colors = [];
const colorA = new THREE.Color(0x3aa0ff); // أزرق
const colorB = new THREE.Color(0x6d5cff); // بنفسجي
const colorC = new THREE.Color(0x38ffd6); // تركوازي

const pos = geo.attributes.position;

for (let i = 0; i < pos.count; i++) {
  const y = pos.getY(i);

  // تدرج ثلاثي حسب الارتفاع
  let c;
  if (y > 0.4) {
    c = colorA;
  } else if (y < -0.4) {
    c = colorC;
  } else {
    c = colorB;
  }

  colors.push(c.r, c.g, c.b);
}

geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

/* =========================
   Material
========================= */
const mat = new THREE.MeshPhysicalMaterial({
  vertexColors: true,     // ✨ يستخدم ألوان الفيرتكس
  metalness: 0.35,
  roughness: 0.28,
  clearcoat: 1,
  clearcoatRoughness: 0.15,
  emissive: 0x0a0f25,
  emissiveIntensity: 0.25,
});

/* =========================
   Mesh
========================= */
const knot = new THREE.Mesh(geo, mat);
scene.add(knot);

/* =========================
   Resize
========================= */
function place() {
  if (isMobile) {
    knot.position.set(0, -0.35, 0);
    knot.scale.set(0.92, 0.92, 0.92);
  } else {
    knot.position.set(0, -0.12, 0);
    knot.scale.set(1, 1, 1);
  }
}

function resize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  place();
}

new ResizeObserver(resize).observe(canvas);
resize();

/* =========================
   Animation
========================= */
let t = 0;

function animate() {
  t += 0.01;

  knot.rotation.y += 0.007;
  knot.rotation.x = Math.PI * 0.35 + Math.cos(t * 0.3) * 0.08;
  knot.rotation.z = Math.sin(t * 0.25) * 0.06;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
