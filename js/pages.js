document.addEventListener("DOMContentLoaded", function() {
  // Initialize Animate On Scroll (AOS) library for scroll animations
  AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
  });

  // =================================================================
  // THEME TOGGLE FUNCTIONALITY (FOR ALL SUB-PAGES)
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
      } else { // Default to light mode
          body.classList.add('light-mode');
          themeToggle.setAttribute('aria-pressed', 'false');
      }
  };
  
  // --- Theme Initialization on Page Load ---
  const savedTheme = localStorage.getItem('siteTheme');
  if (savedTheme) {
      applyTheme(savedTheme);
  } else {
      applyTheme('light');
  }

  // --- Theme Toggle Event Listener ---
  themeToggle.addEventListener('click', () => {
      const isLightMode = body.classList.contains('light-mode');
      const newTheme = isLightMode ? 'neon' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('siteTheme', newTheme);
  });
});