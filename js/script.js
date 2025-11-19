/**
 * @file Homepage Script - Theme toggle and contact form functionality
 * @description Handles theme switching between light/neon modes with localStorage persistence
 * and manages AJAX form submission with validation and user feedback
 * @author Manoj Jivanagi
 * @version 2.0.0
 * @license MIT
 */

import { ThemeManager } from './core/theme-manager.js';
import { getElement } from './utils/dom.js';
import { isValidEmail, isNotEmpty } from './utils/validators.js';
import { API, ANIMATION, MESSAGES, ELEMENTS } from './config/constants.js';

document.addEventListener("DOMContentLoaded", function () {
  // =================================================================
  // ANIMATE ON SCROLL (AOS) INITIALIZATION
  // =================================================================
  
  /**
   * Initialize AOS library for scroll animations
   * @see {@link https://michalsnik.github.io/aos/}
   */
  AOS.init({
    duration: ANIMATION.AOS_DURATION,     // Animation duration in milliseconds
    once: true,                           // Animation occurs only once
    offset: 100,                          // Offset from original trigger point
  });

  // =================================================================
  // THEME TOGGLE FUNCTIONALITY
  // =================================================================
  
  // Initialize theme manager with centralized theme logic
  const themeManager = new ThemeManager();
  themeManager.init();
  
  // =================================================================
  // CONTACT FORM SUBMISSION
  // =================================================================
  
  const form = getElement(`#${ELEMENTS.CONTACT_FORM}`);
  const statusDiv = getElement("#form-status");
  const submitBtn = getElement("#submitBtn");

  /**
   * Validates form fields before submission
   * @returns {Object} Validation result { valid: boolean, message: string }
   */
  function validateContactForm() {
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    if (!isNotEmpty(nameInput?.value)) {
      return { valid: false, message: 'Please enter your name.' };
    }

    if (!isValidEmail(emailInput?.value)) {
      return { valid: false, message: 'Please enter a valid email address.' };
    }

    if (!isNotEmpty(messageInput?.value)) {
      return { valid: false, message: 'Please enter a message.' };
    }

    return { valid: true, message: '' };
  }

  /**
   * Handles contact form submission via AJAX
   * Sends form data to Formspree, displays success/error messages
   * Prevents default form submission to avoid page reload
   * @async
   * @param {Event} event - Form submit event
   * @throws {Error} Network errors during form submission
   */
  async function handleSubmit(event) {
    event.preventDefault();

    // Validate form before submission
    const validation = validateContactForm();
    if (!validation.valid) {
      statusDiv.innerHTML = validation.message;
      statusDiv.className = "error";
      return;
    }

    const data = new FormData(event.target);

    // Update UI to show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      // Send form data to Formspree endpoint
      const response = await fetch(API.FORMSPREE, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      // Handle successful submission
      if (response.ok) {
        statusDiv.innerHTML = MESSAGES.FORM_SUCCESS;
        statusDiv.className = "success";
        form.reset();
        Array.from(form.elements).forEach(field => field.disabled = true);
        submitBtn.textContent = "Message Sent!";
      } else {
        // Handle server-side validation errors
        const responseData = await response.json();
        if (Object.hasOwn(responseData, "errors")) {
          statusDiv.innerHTML = responseData["errors"].map((error) => error["message"]).join(", ");
        } else {
          statusDiv.innerHTML = MESSAGES.FORM_ERROR;
        }
        statusDiv.className = "error";
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    } catch (error) {
      // Handle network errors
      console.error("Form submission error:", error);
      statusDiv.innerHTML = MESSAGES.NETWORK_ERROR;
      statusDiv.className = "error";
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  }
  
  // Attach submit event listener to form (if form exists on page)
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
});