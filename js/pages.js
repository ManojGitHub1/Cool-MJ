/**
 * @file Subpages Script - Theme toggle and AOS initialization for all subpages
 * @description Handles theme switching and scroll animations for developer, projects, about, and blog pages
 * @author Manoj Jivanagi
 * @version 2.0.0
 * @license MIT
 */

import { ThemeManager } from './core/theme-manager.js';
import { ANIMATION } from './config/constants.js';

document.addEventListener("DOMContentLoaded", function() {
  // =================================================================
  // ANIMATE ON SCROLL (AOS) INITIALIZATION
  // =================================================================
  
  /**
   * Initialize AOS library for scroll animations
   * @see {@link https://michalsnik.github.io/aos/}
   */
  AOS.init({
      duration: ANIMATION.AOS_DURATION,
      easing: 'ease-in-out',
      once: true,
      mirror: false
  });

  // =================================================================
  // THEME TOGGLE FUNCTIONALITY (FOR ALL SUB-PAGES)
  // =================================================================
  
  // Initialize theme manager with centralized theme logic
  const themeManager = new ThemeManager();
  themeManager.init();
});