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
  camera.position.set(0, 0.15, 6);

  scene.add(new THREE.AmbientLight(0xffffff, 0.92));

  const key = new THREE.DirectionalLight(0xffffff, 0.75);
  key.position.set(3.5, 4.5, 3);
  scene.add(key);

  const accentA = new THREE.DirectionalLight(0x6d5cff, 0.55);
  accentA.position.set(-4, -2, 3);
  scene.add(accentA);

  const accentB = new THREE.DirectionalLight(0x3aa0ff, 0.35);
  accentB.position.set(4, -1.5, 2);
  scene.add(accentB);

  const group = new THREE.Group();
  scene.add(group);

  const matPurple = new THREE.MeshStandardMaterial({
    color: 0x6d5cff,
    metalness: 0.15,
    roughness: 0.55,
    emissive: 0x120a3a,
    emissiveIntensity: 0.30,
  });

  const matBlue = new THREE.MeshStandardMaterial({
    color: 0x3aa0ff,
    metalness: 0.15,
    roughness: 0.58,
    emissive: 0x061a33,
    emissiveIntensity: 0.30,
  });

  function ring(radius, tube, mat, rx, rz) {
    const radialSegments = isMobile ? 12 : 16;
    const tubularSegments = isMobile ? 64 : 90;
    const geo = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = rx;
    mesh.rotation.z = rz;
    return mesh;
  }

  const r1 = ring(1.55, 0.085, matPurple, Math.PI * 0.45, 0);
  const r2 = ring(1.15, 0.080, matBlue,   Math.PI * 0.35, Math.PI * 0.20);
  const r3 = ring(0.82, 0.075, matPurple, Math.PI * 0.55, -Math.PI * 0.18);
  group.add(r1, r2, r3);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  let raf = 0;
  let t = 0;

  function animate() {
    t += 0.01;

    r1.rotation.z += 0.0045;
    r2.rotation.z -= 0.0058;
    r3.rotation.z += 0.0070;

    group.position.y = Math.sin(t * 0.9) * 0.055;
    group.rotation.y = Math.sin(t * 0.35) * 0.12;
    group.rotation.x = Math.cos(t * 0.28) * 0.08;

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
