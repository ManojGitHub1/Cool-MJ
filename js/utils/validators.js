/**
 * @file Validators - Input validation utilities
 * @description Provides validation functions for forms and user input
 * @author Manoj Jivanagi
 * @version 1.0.0
 * @license MIT
 */

/**
 * Validates an email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 * @example
 * if (isValidEmail('user@example.com')) { }
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates if a string is not empty (after trimming)
 * @param {string} value - Value to validate
 * @returns {boolean} True if not empty
 * @example
 * if (isNotEmpty(name)) { }
 */
export function isNotEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates string length is within range
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {number} [max=Infinity] - Maximum length
 * @returns {boolean} True if length is valid
 * @example
 * if (isValidLength(message, 10, 500)) { }
 */
export function isValidLength(value, min, max = Infinity) {
  if (typeof value !== 'string') return false;
  
  const length = value.trim().length;
  return length >= min && length <= max;
}

/**
 * Sanitizes HTML by escaping special characters
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 * @example
 * const safe = sanitizeHTML('<script>alert("xss")</script>');
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Validates a URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL format is valid
 * @example
 * if (isValidURL('https://example.com')) { }
 */
export function isValidURL(url) {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validates a phone number (basic format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone format is valid
 * @example
 * if (isValidPhone('+1-555-123-4567')) { }
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  
  // Allows digits, spaces, dashes, parentheses, and plus sign
  const phoneRegex = /^[\d\s\-()+]+$/;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  return phoneRegex.test(phone) && cleaned.length >= 10;
}

/**
 * Validates all required fields in a form
 * @param {HTMLFormElement} form - Form to validate
 * @returns {Object} Validation result { valid: boolean, errors: Array }
 * @example
 * const result = validateForm(form);
 * if (result.valid) { }
 */
export function validateForm(form) {
  const errors = [];
  
  if (!form || !(form instanceof HTMLFormElement)) {
    return { valid: false, errors: ['Invalid form element'] };
  }
  
  const requiredFields = form.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    const name = field.name || field.id || 'unknown';
    const value = field.value;
    
    if (!isNotEmpty(value)) {
      errors.push(`${name} is required`);
    } else if (field.type === 'email' && !isValidEmail(value)) {
      errors.push(`${name} must be a valid email`);
    } else if (field.type === 'tel' && !isValidPhone(value)) {
      errors.push(`${name} must be a valid phone number`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
