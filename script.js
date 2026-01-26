// 1) Intro loader hide
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  setTimeout(() => {
    intro.style.opacity = "0";
    intro.style.transition = "opacity .35s ease";
    setTimeout(() => intro.remove(), 380);
  }, 1100); // نفس مدة الـ loading animation
});

// 2) Canvas particles (خفيف + شكله "تقني/3D-ish")
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d", { alpha: true });

let w = 0, h = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
let particles = [];
let rafId = null;

function resize() {
  w = canvas.clientWidth;
  h = canvas.clientHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // regenerate with density based on area
  const count = Math.floor((w * h) / 18000); // adjust density
  particles = Array.from({ length: Math.max(35, Math.min(140, count)) }, () => makeParticle());
}
function makeParticle() {
  const speed = 0.15 + Math.random() * 0.45;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.8 + Math.random() * 2.2,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    a: 0.25 + Math.random() * 0.45
  };
}

function step() {
  ctx.clearRect(0, 0, w, h);

  // subtle vignette
  const g = ctx.createRadialGradient(w * 0.5, h * 0.35, 40, w * 0.5, h * 0.5, Math.max(w, h));
  g.addColorStop(0, "rgba(0,255,225,0.06)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // draw particles
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;
    if (p.y < -10) p.y = h + 10;
    if (p.y > h + 10) p.y = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.a})`;
    ctx.fill();
  }

  // connect close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.18;
        ctx.strokeStyle = `rgba(0,255,225,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  rafId = requestAnimationFrame(step);
}

const ro = new ResizeObserver(resize);
ro.observe(canvas);

resize();
step();

// pause on tab hidden (أداء)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  } else if (!rafId) {
    step();
  }
});
