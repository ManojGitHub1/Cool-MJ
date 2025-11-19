/**
 * @file DOM Utilities - Helper functions for DOM manipulation
 * @description Provides safe wrapper functions for common DOM operations
 * with error handling and null checks
 * @author Manoj Jivanagi
 * @version 1.0.0
 * @license MIT
 */

/**
 * Safely selects a DOM element by ID or selector
 * @param {string} selector - CSS selector or element ID
 * @param {Element} [context=document] - Context to search within
 * @returns {Element|null} The selected element or null
 * @example
 * const button = getElement('#submitBtn');
 */
export function getElement(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (error) {
    console.warn(`Failed to select element: ${selector}`, error);
    return null;
  }
}

/**
 * Safely selects multiple DOM elements
 * @param {string} selector - CSS selector
 * @param {Element} [context=document] - Context to search within
 * @returns {NodeList|Array} NodeList of elements or empty array
 * @example
 * const buttons = getElements('.btn');
 */
export function getElements(selector, context = document) {
  try {
    return context.querySelectorAll(selector);
  } catch (error) {
    console.warn(`Failed to select elements: ${selector}`, error);
    return [];
  }
}

/**
 * Creates a new DOM element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} [attributes={}] - Element attributes
 * @param {string} [content=''] - Inner HTML content
 * @returns {Element} The created element
 * @example
 * const div = createElement('div', { class: 'card', id: 'myCard' }, '<p>Hello</p>');
 */
export function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  
  Object.keys(attributes).forEach(key => {
    if (key === 'class') {
      element.className = attributes[key];
    } else if (key === 'style' && typeof attributes[key] === 'object') {
      Object.assign(element.style, attributes[key]);
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });
  
  if (content) {
    element.innerHTML = content;
  }
  
  return element;
}

/**
 * Toggles a class on an element
 * @param {Element} element - Target element
 * @param {string} className - Class name to toggle
 * @param {boolean} [force] - Force add (true) or remove (false)
 * @returns {boolean} True if class is now present
 * @example
 * toggleClass(element, 'active');
 * toggleClass(element, 'hidden', false); // Force remove
 */
export function toggleClass(element, className, force) {
  if (!element) return false;
  
  try {
    return element.classList.toggle(className, force);
  } catch (error) {
    console.warn(`Failed to toggle class: ${className}`, error);
    return false;
  }
}

/**
 * Adds one or more classes to an element
 * @param {Element} element - Target element
 * @param {...string} classNames - Class names to add
 * @example
 * addClass(element, 'active', 'highlighted');
 */
export function addClass(element, ...classNames) {
  if (!element) return;
  
  try {
    element.classList.add(...classNames);
  } catch (error) {
    console.warn('Failed to add classes', error);
  }
}

/**
 * Removes one or more classes from an element
 * @param {Element} element - Target element
 * @param {...string} classNames - Class names to remove
 * @example
 * removeClass(element, 'active', 'highlighted');
 */
export function removeClass(element, ...classNames) {
  if (!element) return;
  
  try {
    element.classList.remove(...classNames);
  } catch (error) {
    console.warn('Failed to remove classes', error);
  }
}

/**
 * Checks if element has a class
 * @param {Element} element - Target element
 * @param {string} className - Class name to check
 * @returns {boolean} True if element has the class
 * @example
 * if (hasClass(element, 'active')) { }
 */
export function hasClass(element, className) {
  if (!element) return false;
  
  try {
    return element.classList.contains(className);
  } catch (error) {
    console.warn('Failed to check class', error);
    return false;
  }
}
