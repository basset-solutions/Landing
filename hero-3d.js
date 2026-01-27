import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("hero-3d");
if (!canvas) {
  console.warn("hero-3d canvas not found");
} else {
  const isMobile = matchMedia("(max-width: 900px)").matches;
  const DPR = isMobile ? 1 : Math.min(1.5, window.devicePixelRatio || 1);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(DPR);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0, 0.18, 6);

  // lights (خفيفة)
  scene.add(new THREE.AmbientLight(0xffffff, 0.92));

  const key = new THREE.DirectionalLight(0xffffff, 0.75);
  key.position.set(3.5, 4.5, 3);
  scene.add(key);

  const accent = new THREE.DirectionalLight(0x6d5cff, 0.55);
  accent.position.set(-4, -2, 3);
  scene.add(accent);

  const group = new THREE.Group();
  scene.add(group);

  const matA = new THREE.MeshStandardMaterial({
    color: 0x6d5cff,
    metalness: 0.18,
    roughness: 0.5,
    emissive: 0x120a3a,
    emissiveIntensity: 0.32,
  });

  const matB = new THREE.MeshStandardMaterial({
    color: 0x3aa0ff,
    metalness: 0.18,
    roughness: 0.52,
    emissive: 0x061a33,
    emissiveIntensity: 0.34,
  });

  function ring(radius, tube, mat, rx, rz) {
    const radialSegments = isMobile ? 14 : 18;
    const tubularSegments = isMobile ? 72 : 100;
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

  // ✅ حركة تلقائية فقط
  let raf = 0;
  let t = 0;

  function animate() {
    t += 0.01;

    // دوران ناعم
    r1.rotation.z += 0.0048;
    r2.rotation.z -= 0.0062;
    r3.rotation.z += 0.0075;

    // float بسيط جدًا
    group.position.y = Math.sin(t * 0.9) * 0.06;
    group.rotation.y = Math.sin(t * 0.35) * 0.12;
    group.rotation.x = Math.cos(t * 0.28) * 0.08;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }
  animate();

  // وقف الأنيميشن إذا التبويب مخفي
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf) {
      animate();
    }
  });
}
