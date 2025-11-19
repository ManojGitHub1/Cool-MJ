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
   */
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'siteTheme';
    this.defaultTheme = options.defaultTheme || 'light';
    this.toggleButtonId = options.toggleButtonId || 'themeToggle';
    
    this.themeToggle = document.getElementById(this.toggleButtonId);
    this.body = document.body;
    
    // Bind methods to preserve context
    this.handleToggle = this.handleToggle.bind(this);
  }

  /**
   * Initializes the theme manager
   * Loads saved theme and sets up event listeners
   */
  init() {
    // Load and apply saved theme
    const savedTheme = this.getSavedTheme();
    this.applyTheme(savedTheme);
    
    // Setup toggle button event listener
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', this.handleToggle);
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
   * Updates body class and ARIA attributes
   * @param {('light'|'neon')} theme - Theme to apply
   */
  applyTheme(theme) {
    if (theme === 'neon') {
      this.body.classList.remove('light-mode');
      if (this.themeToggle) {
        this.themeToggle.setAttribute('aria-pressed', 'true');
      }
    } else {
      this.body.classList.add('light-mode');
      if (this.themeToggle) {
        this.themeToggle.setAttribute('aria-pressed', 'false');
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
