// Dark Mode Toggle
const toggle = document.createElement("div");
toggle.className = "toggle-switch";
toggle.innerText = "☾ Dark Mode";
document.body.appendChild(toggle);

let dark = false;
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  dark = !dark;
  toggle.innerText = dark ? "☀ Light Mode" : "☾ Dark Mode";
}); 