/**
 * @file Theme Manager - Centralized theme management
 * @description Handles theme switching between light and neon modes
 * with localStorage persistence across all pages
 * @author Manoj Jivanagi
 * @version 2.0.0
 * @license MIT
 */

/**
 * ThemeManager class - Manages application theme state
 * @class
 */
export class ThemeManager {
  /**
   * Creates a ThemeManager instance
   * @param {Object} options - Configuration options
   * @param {string} [options.storageKey='siteTheme'] - localStorage key for theme
   * @param {string} [options.defaultTheme='light'] - Default theme if none saved
   * @param {string} [options.toggleButtonId='themeToggle'] - Theme toggle button ID
   * @param {boolean} [options.respectSystemPreference=true] - Use system theme preference
   */
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'siteTheme';
    this.defaultTheme = options.defaultTheme || 'light';
    this.toggleButtonId = options.toggleButtonId || 'themeToggle';
    this.respectSystemPreference = options.respectSystemPreference !== false;
    
    this.themeToggle = document.getElementById(this.toggleButtonId);
    this.body = document.body;
    
    // Bind methods to preserve context
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
  }

  /**
   * Initializes the theme manager
   * Loads saved theme and sets up event listeners
   */
  init() {
    // Check for saved theme first, then system preference
    let themeToApply = this.getSavedTheme();
    
    // If no saved theme and system preference enabled, use system theme
    if (!localStorage.getItem(this.storageKey) && this.respectSystemPreference) {
      themeToApply = this.getSystemTheme();
    }
    
    this.applyTheme(themeToApply);
    
    // Setup toggle button event listener
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', this.handleToggle);
    }
    
    // Listen for system theme changes
    if (this.respectSystemPreference && window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', this.handleSystemThemeChange);
    }
  }

  /**
   * Gets the system's preferred theme
   * @returns {string} 'neon' if dark mode, 'light' otherwise
   */
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'neon';
    }
    return 'light';
  }

  /**
   * Handles system theme preference changes
   * Only applies if no user preference is saved
   * @param {MediaQueryListEvent} e - Media query change event
   */
  handleSystemThemeChange(e) {
    // Only auto-switch if user hasn't set a preference
    if (!localStorage.getItem(this.storageKey)) {
      const newTheme = e.matches ? 'neon' : 'light';
      this.applyTheme(newTheme);
    }
  }

  /**
   * Gets the saved theme from localStorage
   * @returns {string} The saved theme or default theme
   */
  getSavedTheme() {
    try {
      return localStorage.getItem(this.storageKey) || this.defaultTheme;
    } catch (error) {
      console.warn('Failed to get saved theme:', error);
      return this.defaultTheme;
    }
  }

  /**
   * Saves the current theme to localStorage
   * @param {string} theme - Theme to save ('light' or 'neon')
   * @returns {boolean} True if successful
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
      return true;
    } catch (error) {
      console.warn('Failed to save theme:', error);
      return false;
    }
  }

  /**
   * Applies the specified theme to the page
   * Updates body class and ARIA attributes with smooth transition
   * @param {('light'|'neon')} theme - Theme to apply
   */
  applyTheme(theme) {
    // Add transition class for smooth color changes
    this.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (theme === 'neon') {
      this.body.classList.remove('light-mode');
      if (this.themeToggle) {
        this.themeToggle.setAttribute('aria-pressed', 'true');
        this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
      }
    } else {
      this.body.classList.add('light-mode');
      if (this.themeToggle) {
        this.themeToggle.setAttribute('aria-pressed', 'false');
        this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  }

  /**
   * Gets the current theme
   * @returns {('light'|'neon')} Current theme
   */
  getCurrentTheme() {
    return this.body.classList.contains('light-mode') ? 'light' : 'neon';
  }

  /**
   * Toggles between light and neon themes
   */
  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'neon' : 'light';
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
    
    // Track theme change in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'theme_change', {
        event_category: 'Theme',
        event_label: newTheme
      });
    }
  }

  /**
   * Event handler for theme toggle button click
   * @private
   */
  handleToggle() {
    this.toggleTheme();
  }

  /**
   * Removes event listeners (cleanup)
   */
  destroy() {
    if (this.themeToggle) {
      this.themeToggle.removeEventListener('click', this.handleToggle);
    }
  }
}

// Export singleton instance for convenience
export default new ThemeManager();
