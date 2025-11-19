/**
 * @file Storage Utilities - localStorage abstraction with error handling
 * @description Provides safe wrapper functions for localStorage operations
 * with try-catch error handling for private browsing mode and quota limits
 * @author Manoj Jivanagi
 * @version 1.0.0
 * @license MIT
 */

/**
 * Retrieves a value from localStorage
 * @param {string} key - The storage key to retrieve
 * @param {*} [defaultValue=null] - Default value if key doesn't exist or error occurs
 * @returns {*} The parsed value from storage or defaultValue
 * @example
 * const theme = getFromStorage('siteTheme', 'light');
 */
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to get item from localStorage: ${key}`, error);
    return defaultValue;
  }
}

/**
 * Stores a value in localStorage
 * @param {string} key - The storage key
 * @param {*} value - The value to store (will be JSON stringified)
 * @returns {boolean} True if successful, false if error occurred
 * @example
 * setToStorage('siteTheme', 'neon');
 */
export function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to set item in localStorage: ${key}`, error);
    return false;
  }
}

/**
 * Removes a value from localStorage
 * @param {string} key - The storage key to remove
 * @returns {boolean} True if successful, false if error occurred
 * @example
 * removeFromStorage('oldTheme');
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove item from localStorage: ${key}`, error);
    return false;
  }
}

/**
 * Clears all items from localStorage
 * @returns {boolean} True if successful, false if error occurred
 * @example
 * clearStorage(); // Clears all localStorage data
 */
export function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.warn('Failed to clear localStorage', error);
    return false;
  }
}

/**
 * Checks if localStorage is available and working
 * @returns {boolean} True if localStorage is available
 * @example
 * if (isStorageAvailable()) {
 *   // Use localStorage
 * }
 */
export function isStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}
