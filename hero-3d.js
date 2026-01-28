import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("hero-3d");
if (!canvas) {
  console.warn("hero-3d canvas not found");
} else {
  const isMobile = matchMedia("(max-width: 900px)").matches;

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

  const key = new THREE.DirectionalLight(0xffffff, 0.72);
  key.position.set(4, 5, 4);
  scene.add(key);

  const accent = new THREE.DirectionalLight(0x6d5cff, 0.55);
  accent.position.set(-4, -2, 3);
  scene.add(accent);

  const accent2 = new THREE.DirectionalLight(0x3aa0ff, 0.38);
  accent2.position.set(4, -1.5, 2);
  scene.add(accent2);

  // ✅ مادة تعطي لمعة جميلة بدون ما تثقل
  const mat = new THREE.MeshStandardMaterial({
    color: 0x3aa0ff,
    metalness: 0.18,
    roughness: 0.55,
    emissive: 0x061a33,
    emissiveIntensity: 0.25,
  });

  // ✅ عقدة (Knot) — خفيفة على الجوال
  const tubularSegments = isMobile ? 110 : 170; // تفاصيل أقل للجوال
  const radialSegments = isMobile ? 10 : 14;

  // TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q)
  const geo = new THREE.TorusKnotGeometry(1.15, 0.14, tubularSegments, radialSegments, 2, 3);
  const knot = new THREE.Mesh(geo, mat);
  knot.rotation.x = Math.PI * 0.35;
  knot.rotation.z = Math.PI * 0.12;
  scene.add(knot);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // مكانها فوق داخل الهيرو فقط
    if (isMobile) {
      knot.position.set(0, -0.35, 0);
      knot.scale.set(0.92, 0.92, 0.92);
    } else {
      knot.position.set(0, -0.10, 0);
      knot.scale.set(1, 1, 1);
    }
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  let raf = 0;
  let t = 0;

  function animate() {
    t += 0.01;

    // حركة ناعمة (تلقائي فقط)
    knot.rotation.y += 0.006;
    knot.rotation.x = Math.PI * 0.35 + Math.cos(t * 0.25) * 0.09;
    knot.rotation.z = Math.PI * 0.12 + Math.sin(t * 0.30) * 0.06;

    // طفو بسيط جدًا
    knot.position.y += Math.sin(t * 0.9) * 0.0008;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }

  animate();

  // إيقاف إذا التبويب مخفي (خفيف جدًا)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf) {
      animate();
    }
  });
}
