// شيل no-js أول ما يشتغل الجافاسكربت
document.documentElement.classList.remove("no-js");

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// Contact form submit
const form = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.reset();
        form.classList.add("hidden");
        if (successMessage) successMessage.classList.remove("hidden");
      } else {
        alert("صار خطأ أثناء الإرسال، جرّبي مرة ثانية 🙏");
      }
    } catch (error) {
      alert("تعذر الاتصال، تأكدي من الإنترنت 🌐");
    }
  });
}

// Reveal on scroll (مضمون + fallback)
(function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  // إذا المتصفح ما يدعم IntersectionObserver: اظهر كل العناصر مباشرة
  if (!("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => observer.observe(el));
})();
