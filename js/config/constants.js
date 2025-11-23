/**
 * @file Application Constants - Centralized configuration
 * @description Contains all constant values used across the application
 * including API endpoints, storage keys, and configuration values
 * @author Manoj Jivanagi
 * @version 2.0.0
 * @license MIT
 */

/**
 * Application version
 * @constant {string}
 */
export const APP_VERSION = '2.0.0';

/**
 * API endpoints
 * @constant {Object}
 */
export const API = {
  /** Formspree contact form endpoint */
  FORMSPREE: 'https://formspree.io/f/xkgqgwoj',
};

/**
 * localStorage keys
 * @constant {Object}
 */
export const STORAGE_KEYS = {
  /** Theme preference key */
  THEME: 'siteTheme',
  /** Music player state key */
  MUSIC_PLAYER: 'musicPlayerState',
};

/**
 * Theme configuration
 * @constant {Object}
 */
export const THEME = {
  /** Light mode identifier */
  LIGHT: 'light',
  /** Neon/dark mode identifier */
  NEON: 'neon',
  /** Default theme */
  DEFAULT: 'light',
};

/**
 * Animation durations (in milliseconds)
 * @constant {Object}
 */
export const ANIMATION = {
  /** AOS (Animate On Scroll) animation duration */
  AOS_DURATION: 800,
  /** Theme transition duration */
  THEME_TRANSITION: 300,
  /** Music player transition duration */
  MUSIC_TRANSITION: 400,
};

/**
 * Form configuration
 * @constant {Object}
 */
export const FORM = {
  /** Maximum message length */
  MAX_MESSAGE_LENGTH: 1000,
  /** Minimum message length */
  MIN_MESSAGE_LENGTH: 10,
  /** Form submission timeout (ms) */
  SUBMIT_TIMEOUT: 10000,
};

/**
 * Blog configuration
 * @constant {Object}
 */
export const BLOG = {
  /** Blog posts JSON file path */
  POSTS_FILE: '/blog-posts.json',
  /** Maximum posts per page */
  POSTS_PER_PAGE: 10,
  /** Default post excerpt length */
  EXCERPT_LENGTH: 150,
};

/**
 * Element IDs
 * @constant {Object}
 */
export const ELEMENTS = {
  /** Theme toggle button ID */
  THEME_TOGGLE: 'themeToggle',
  /** Contact form ID */
  CONTACT_FORM: 'contactForm',
  /** Form status div ID */
  FORM_STATUS: 'formStatus',
  /** Music player container ID */
  MUSIC_PLAYER: 'musicPlayer',
};

/**
 * CSS classes
 * @constant {Object}
 */
export const CSS_CLASSES = {
  /** Light mode body class */
  LIGHT_MODE: 'light-mode',
  /** Active element class */
  ACTIVE: 'active',
  /** Hidden element class */
  HIDDEN: 'hidden',
  /** Loading state class */
  LOADING: 'loading',
};

/**
 * HTTP status codes
 * @constant {Object}
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

/**
 * Error messages
 * @constant {Object}
 */
export const MESSAGES = {
  /** Form submission success */
  FORM_SUCCESS: 'Thanks for reaching out! I will get back to you soon.',
  /** Form submission error */
  FORM_ERROR: 'Oops! There was a problem submitting your form. Please try again.',
  /** Network error */
  NETWORK_ERROR: 'Oops! There was a network problem. Please check your connection and try again.',
  /** Validation error */
  VALIDATION_ERROR: 'Please fill in all required fields correctly.',
};

/**
 * Regex patterns
 * @constant {Object}
 */
export const PATTERNS = {
  /** Email validation pattern */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** Phone number pattern */
  PHONE: /^[\d\s\-()+]+$/,
  /** URL pattern */
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
};
