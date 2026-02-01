import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("hero-3d");
if (!canvas) {
  console.warn("hero-3d canvas not found");
} else {
  const isMobile = matchMedia("(max-width: 900px)").matches;

  // ✅ وضوح + أمان للجوال
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile, // للجوال OFF لتجنب مشاكل Safari
    powerPreference: isMobile ? "low-power" : "high-performance",
  });

  // توازن بين "صفاء" و "استقرار"
  renderer.setPixelRatio(isMobile ? 1.25 : 1.6);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.physicallyCorrectLights = true;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 70);
  camera.position.set(0, 0.05, 6);

  // Lights (تعطي لونين واضحين)
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));

  const purple = new THREE.DirectionalLight(0x6d5cff, 1.05);
  purple.position.set(-5, 3, 3);
  scene.add(purple);

  const blue = new THREE.DirectionalLight(0x3aa0ff, 1.05);
  blue.position.set(5, -2, 3);
  scene.add(blue);

  const white = new THREE.DirectionalLight(0xffffff, 0.55);
  white.position.set(2, 5, 5);
  scene.add(white);

  // ====== 1) العقدة ======
  const knotMat = new THREE.MeshPhysicalMaterial({
    color: 0x3aa0ff,
    metalness: 0.35,
    roughness: 0.24,
    clearcoat: 1,
    clearcoatRoughness: 0.14,
    emissive: 0x1b0b2f,
    emissiveIntensity: 0.28,
  });

  const tubularSegments = isMobile ? 130 : 190;
  const radialSegments = isMobile ? 12 : 18;

  const knotGeo = new THREE.TorusKnotGeometry(
    1.15, 0.14,
    tubularSegments, radialSegments,
    2, 3
  );

  const knot = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knot);

  // ====== 2) الشريطة / الخط (Trail) ======
  // نرسم "خط متدرج اللون" يلف حول العقدة (كأنه خارج منها)
  const TRAIL_POINTS = isMobile ? 90 : 140;

  const trailGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(TRAIL_POINTS * 3);
  const col = new Float32Array(TRAIL_POINTS * 3);

  // ألوان التدرج (بنفسجي → أزرق)
  const cA = new THREE.Color(0x6d5cff);
  const cB = new THREE.Color(0x3aa0ff);

  for (let i = 0; i < TRAIL_POINTS; i++) {
    const t = i / (TRAIL_POINTS - 1);
    const c = cA.clone().lerp(cB, t);
    col[i * 3 + 0] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }

  trailGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  trailGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));

  const trailMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const trail = new THREE.Line(trailGeo, trailMat);
  scene.add(trail);

  // معادلة Torus Knot (للخط) — خفيفة وسلسة
  function torusKnotPoint(u, p = 2, q = 3, R = 1.25, r = 0.48) {
    // u: 0..2π
    const cu = Math.cos(u);
    const su = Math.sin(u);
    const qu = q * u;
    const pu = p * u;

    const x = (R + r * Math.cos(qu)) * Math.cos(pu);
    const y = (R + r * Math.cos(qu)) * Math.sin(pu);
    const z = r * Math.sin(qu);

    return new THREE.Vector3(x, y, z);
  }

  // ====== Positioning داخل الهيرو فقط ======
  function place() {
    if (isMobile) {
      knot.position.set(0, -0.35, 0);
      knot.scale.set(0.92, 0.92, 0.92);

      trail.position.copy(knot.position);
      trail.scale.copy(knot.scale);
    } else {
      knot.position.set(0, -0.12, 0);
      knot.scale.set(1, 1, 1);

      trail.position.copy(knot.position);
      trail.scale.copy(knot.scale);
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

  // ====== Animation ======
  let raf = 0;
  let t = 0;

  // دوران نفس اللي على العقدة عشان يصير كأنه “طالع منها”
  const rot = new THREE.Euler(0, 0, 0, "XYZ");
  const m = new THREE.Matrix4();

  function animate() {
    t += 0.01;

    // حركة العقدة
    knot.rotation.y += 0.007;
    knot.rotation.x = Math.PI * 0.35 + Math.cos(t * 0.3) * 0.08;
    knot.rotation.z = Math.sin(t * 0.25) * 0.06;

    // نفس دوران العقدة على الشريطة
    rot.set(knot.rotation.x, knot.rotation.y, knot.rotation.z);
    m.makeRotationFromEuler(rot);

    // تحديث نقاط الشريطة: “رأس” يتحرك وباقي النقاط تتبع
    const headU = (t * 1.25) % (Math.PI * 2);
    const tailLen = Math.PI * 1.15; // طول الشريطة حول العقدة

    for (let i = 0; i < TRAIL_POINTS; i++) {
      const ratio = i / (TRAIL_POINTS - 1);

      // u من الرأس إلى الذيل
      const u = headU - ratio * tailLen;

      // نقطة على منحنى العقدة
      const v = torusKnotPoint(u);

      // لفّة بسيطة تعطي “سلاسة” كأنها شريط
      const wobble = Math.sin(t * 1.1 + ratio * 6.0) * (isMobile ? 0.018 : 0.022);
      v.x += wobble * 0.6;
      v.y += wobble * 0.35;

      // طبق دوران العقدة
      v.applyMatrix4(m);

      // اكتبها في البافر
      pos[i * 3 + 0] = v.x;
      pos[i * 3 + 1] = v.y;
      pos[i * 3 + 2] = v.z;
    }

    trail.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }

  animate();

  // وقف إذا التبويب مخفي
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf) {
      animate();
    }
  });
}
