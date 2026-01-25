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
        successMessage.classList.remove("hidden");
      } else {
        alert("صار خطأ أثناء الإرسال، جرّبي مرة ثانية 🙏");
      }
    } catch (error) {
      alert("تعذر الاتصال، تأكدي من الإنترنت 🌐");
    }
  });
}
// Scroll reveal animation (Fade/Slide on scroll)
const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((el) => revealObserver.observe(el));

