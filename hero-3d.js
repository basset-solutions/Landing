import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("hero-3d");
if (!canvas) {
  console.warn("hero-3d canvas not found");
} else {
  const isMobile = matchMedia("(max-width: 900px)").matches;

  // ثابت وخفيف جدًا (أهم شيء للجوال)
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(1);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0, 0.05, 6);

  scene.add(new THREE.AmbientLight(0xffffff, 0.95));

  const key = new THREE.DirectionalLight(0xffffff, 0.7);
  key.position.set(4, 5, 4);
  scene.add(key);

  const accent = new THREE.DirectionalLight(0x6d5cff, 0.55);
  accent.position.set(-4, -2, 3);
  scene.add(accent);

  const accent2 = new THREE.DirectionalLight(0x3aa0ff, 0.35);
  accent2.position.set(4, -1.5, 2);
  scene.add(accent2);

  // ✅ شكل واحد فقط
  const mat = new THREE.MeshStandardMaterial({
    color: 0x3aa0ff,
    metalness: 0.12,
    roughness: 0.62,
    emissive: 0x061a33,
    emissiveIntensity: 0.25,
  });

  const radialSegments = isMobile ? 12 : 16;
  const tubularSegments = isMobile ? 64 : 90;

  const geo = new THREE.TorusGeometry(1.45, 0.10, radialSegments, tubularSegments);
  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = Math.PI * 0.45;
  ring.rotation.z = Math.PI * 0.15;
  scene.add(ring);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // مكانه داخل الهيرو فقط (فوق)، ما ينزل تحت
    if (isMobile) {
      ring.position.set(0, -0.35, 0);
      ring.scale.set(0.88, 0.88, 0.88);
    } else {
      ring.position.set(0, -0.10, 0);
      ring.scale.set(1, 1, 1);
    }
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  let raf = 0;
  let t = 0;

  function animate() {
    t += 0.01;

    ring.rotation.z += 0.006;
    ring.rotation.y = Math.sin(t * 0.35) * 0.25;
    ring.rotation.x = Math.PI * 0.45 + Math.cos(t * 0.25) * 0.08;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf) {
      animate();
    }
  });
}
