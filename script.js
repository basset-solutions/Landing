window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  const spline = document.getElementById("splineBg");

  setTimeout(() => {
    intro.style.display = "none";
    spline.classList.remove("hidden");
    spline.classList.add("visible");
  }, 1200); // نفس مدة الأنيميشن
});
