// Remove no-js once JS runs
document.documentElement.classList.remove("no-js");

// Smooth scroll (مع تجاهل الروابط اللي مو موجودة)
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Contact form submit (Formspree) + success message
const form = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");
const backBtn = document.getElementById("back-to-form");

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
    } catch {
      alert("تعذر الاتصال، تأكدي من الإنترنت 🌐");
    }
  });
}

if (backBtn && form && successMessage) {
  backBtn.addEventListener("click", () => {
    successMessage.classList.add("hidden");
    form.classList.remove("hidden");
  });
}

// Reveal on scroll (IntersectionObserver + fallback)
(function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

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
