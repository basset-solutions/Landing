/* =========================================================
   Base JS for Basset Landing
   - إزالة no-js
   - Smooth scroll
   - Reveal on scroll
   - Contact form (Formspree) success handling
   ========================================================= */

/* 1) إزالة no-js أول ما يشتغل الجافاسكربت */
document.documentElement.classList.remove("no-js");

/* 2) Smooth scroll للروابط الداخلية */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

/* 3) Reveal on scroll */
(function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  /* لو المتصفح ما يدعم IntersectionObserver */
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
    {
      threshold: 0.15,
    }
  );

  reveals.forEach((el) => observer.observe(el));
})();

/* 4) Contact form (Formspree) + رسالة النجاح */
(function contactFormHandler() {
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("success-message");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method || "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        form.classList.add("hidden");
        if (successMessage) {
          successMessage.classList.remove("hidden");
        }
      } else {
        alert("صار خطأ أثناء الإرسال، جرّب مرة ثانية 🙏");
      }
    } catch (err) {
      alert("تعذر الاتصال، تأكد من الإنترنت 🌐");
    }
  });
})();

/* 5) أمان إضافي: لو JS اشتغل متأخر، أظهر العناصر */
window.addEventListener("load", () => {
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.add("is-visible");
  });
});
