document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("theme-checkbox");
  const modeText = document.getElementById("mode-text");
  const body     = document.body;

  // Daha önceki tercihi uygula
  const saved = localStorage.getItem("mode");
  if (saved === "light") {
    body.classList.add("light-mode");
    checkbox.checked = true;
    modeText.textContent = "Light";
  }

  // Toggle event
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      body.classList.add("light-mode");
      modeText.textContent = "Light";
      localStorage.setItem("mode","light");
    } else {
      body.classList.remove("light-mode");
      modeText.textContent = "Dark";
      localStorage.setItem("mode","dark");
    }
  });
});
