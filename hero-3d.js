import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("hero-3d");
if (!canvas) {
  // لا تسوي throw عشان ما يصير مشاكل على متصفحات معينة
  console.warn("hero-3d canvas not found");
} else {
  const isMobile = matchMedia("(max-width: 900px)").matches;

  // DPR أخف للجوال (هذا أهم سبب للكراش)
  const DPR = isMobile ? 1 : Math.min(1.5, window.devicePixelRatio || 1);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,            // الجوال بدون anti-alias أخف بكثير
    powerPreference: "low-power",     // يخفف على iPhone
  });
  renderer.setPixelRatio(DPR);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0, 0.2, 6);

  // إضاءات خفيفة
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));

  const key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(3.5, 4.5, 3);
  scene.add(key);

  const accent = new THREE.DirectionalLight(0x6d5cff, 0.55);
  accent.position.set(-4, -2, 3);
  scene.add(accent);

  const group = new THREE.Group();
  scene.add(group);

  // نفس ألوانك
  const matA = new THREE.MeshStandardMaterial({
    color: 0x6d5cff,
    metalness: 0.2,
    roughness: 0.45,
    emissive: 0x120a3a,
    emissiveIntensity: 0.35,
  });

  const matB = new THREE.MeshStandardMaterial({
    color: 0x3aa0ff,
    metalness: 0.2,
    roughness: 0.48,
    emissive: 0x061a33,
    emissiveIntensity: 0.38,
  });

  // ✅ تخفيف الهندسة (segments أقل بكثير من قبل)
  function ring(radius, tube, mat, rx, rz) {
    const radialSegments = isMobile ? 14 : 18;
    const tubularSegments = isMobile ? 80 : 110;
    const geo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = rx;
    mesh.rotation.z = rz;
    return mesh;
  }

  const r1 = ring(1.55, 0.085, matA, Math.PI * 0.45, 0);
  const r2 = ring(1.15, 0.08, matB, Math.PI * 0.35, Math.PI * 0.2);
  const r3 = ring(0.82, 0.075, matA, Math.PI * 0.55, -Math.PI * 0.18);
  group.add(r1, r2, r3);

 
