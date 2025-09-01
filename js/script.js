document.addEventListener("DOMContentLoaded", function() {
  // Initialize Animate On Scroll (AOS) library for scroll animations
  AOS.init({
      duration: 800,
      once: true,
      offset: 100
  });

  // =================================================================
  // THEME TOGGLE FUNCTIONALITY (REFINED & FIXED)
  // =================================================================
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  /**
   * Applies the theme and updates the UI accordingly.
   * @param {string} theme - The theme to apply, either 'neon' or 'light'.
   */
  const applyTheme = (theme) => {
      if (theme === 'neon') {
          body.classList.remove('light-mode');
          themeToggle.setAttribute('aria-pressed', 'true');
          // Initialize particles only when switching to dark mode and if not already running
          if (window.particlesJS && (!window.pJSDom || window.pJSDom.length === 0)) {
              initParticles();
          }
      } else { // Default to light mode
          body.classList.add('light-mode');
          themeToggle.setAttribute('aria-pressed', 'false');
          // Destroy particles when switching to light mode to save resources
          if (window.pJSDom && window.pJSDom.length > 0) {
              window.pJSDom[0].pJS.fn.vendors.destroypJS();
              window.pJSDom = [];
          }
      }
  };
  
  // --- Theme Initialization on Page Load ---
  // Check for a saved theme preference in local storage.
  const savedTheme = localStorage.getItem('siteTheme');
  
  // If a theme is saved ('neon' or 'light'), apply it.
  // Otherwise, the default 'light-mode' class on the <body> tag will be used.
  if (savedTheme) {
      applyTheme(savedTheme);
  } else {
      // No theme saved, ensure we are in light mode.
      applyTheme('light');
  }


  // --- Theme Toggle Event Listener ---
  themeToggle.addEventListener('click', () => {
      // Check the body's current state to determine the new theme.
      const isLightMode = body.classList.contains('light-mode');
      const newTheme = isLightMode ? 'neon' : 'light';
      
      // Apply the new theme.
      applyTheme(newTheme);
      
      // Save the user's choice to local storage for persistence.
      localStorage.setItem('siteTheme', newTheme);
  });

  // =================================================================
  // PARTICLES.JS INITIALIZATION (FOR DARK MODE)
  // =================================================================
  const initParticles = () => {
      if (document.getElementById('particles-js')) {
          particlesJS('particles-js', {
              "particles": { "number": { "value": 60, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#00ffff" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "random": true }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#ff00ff", "opacity": 0.2, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "out_mode": "out" } },
              "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } }, "push": { "particles_nb": 4 } } }
          });
      }
  };
});