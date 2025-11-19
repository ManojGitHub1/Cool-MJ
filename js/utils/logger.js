/**
 * @file Logger Utilities - Centralized logging system
 * @description Provides logging functions with different levels (info, warn, error, debug)
 * Supports conditional logging based on environment and can be easily extended
 * @author Manoj Jivanagi
 * @version 1.0.0
 * @license MIT
 */

/**
 * Logging configuration
 * @type {Object}
 */
const config = {
  /** Enable/disable debug logging */
  debug: false,
  /** Prefix for all log messages */
  prefix: '[Portfolio]',
};

/**
 * Logs an informational message
 * @param {...any} args - Arguments to log
 * @example
 * info('User clicked button');
 */
export function info(...args) {
  console.log(`${config.prefix} ℹ️`, ...args);
}

/**
 * Logs a warning message
 * @param {...any} args - Arguments to log
 * @example
 * warn('Missing optional field:', fieldName);
 */
export function warn(...args) {
  console.warn(`${config.prefix} ⚠️`, ...args);
}

/**
 * Logs an error message
 * @param {...any} args - Arguments to log
 * @example
 * error('Form submission failed:', error);
 */
export function error(...args) {
  console.error(`${config.prefix} ❌`, ...args);
}

/**
 * Logs a debug message (only if debug mode is enabled)
 * @param {...any} args - Arguments to log
 * @example
 * debug('Theme state:', themeManager.getCurrentTheme());
 */
export function debug(...args) {
  if (config.debug) {
    console.log(`${config.prefix} 🐛`, ...args);
  }
}

/**
 * Logs a success message
 * @param {...any} args - Arguments to log
 * @example
 * success('Form submitted successfully');
 */
export function success(...args) {
  console.log(`${config.prefix} ✅`, ...args);
}

/**
 * Enables debug logging
 * @example
 * enableDebug();
 */
export function enableDebug() {
  config.debug = true;
  info('Debug logging enabled');
}

/**
 * Disables debug logging
 * @example
 * disableDebug();
 */
export function disableDebug() {
  config.debug = false;
}

/**
 * Sets a custom prefix for log messages
 * @param {string} newPrefix - New prefix to use
 * @example
 * setPrefix('[MyApp]');
 */
export function setPrefix(newPrefix) {
  config.prefix = newPrefix;
}

/**
 * Groups related log messages
 * @param {string} label - Group label
 * @param {Function} callback - Function containing logs to group
 * @example
 * group('Form Validation', () => {
 *   info('Checking email...');
 *   info('Checking name...');
 * });
 */
export function group(label, callback) {
  console.group(`${config.prefix} ${label}`);
  callback();
  console.groupEnd();
}
