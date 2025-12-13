const THEME_KEY = "portfolio-theme";

function getTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  updateToggleButton(theme);
}

function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
}

function updateToggleButton(theme) {
  const button = document.getElementById("theme-toggle");
  if (button) {
    const icon = button.querySelector("i");
    if (icon) {
      icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
    }
    button.setAttribute(
      "aria-label",
      `switch to ${theme === "light" ? "dark" : "light"} mode`
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = getTheme();
  setTheme(savedTheme);
});
