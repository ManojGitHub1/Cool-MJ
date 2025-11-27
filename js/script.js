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
  // ENHANCED PAGE VIEW TRACKING
  // =================================================================
  
  /**
   * Track enhanced page views with metadata
   */
  function trackEnhancedPageView() {
    const pageData = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_referrer: document.referrer,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`
    };
    
    // Determine page category
    const path = window.location.pathname;
    if (path.includes('blog')) pageData.page_category = 'blog';
    else if (path.includes('developer')) pageData.page_category = 'skills';
    else if (path.includes('projects')) pageData.page_category = 'portfolio';
    else if (path.includes('about')) pageData.page_category = 'about';
    else pageData.page_category = 'home';
    
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', pageData);
      
      // Also set as user property for segmentation
      gtag('set', 'user_properties', {
        preferred_theme: document.body.classList.contains('light-mode') ? 'light' : 'dark'
      });
      
      console.log('[Analytics] Enhanced page view tracked:', pageData);
    }
  }
  
  // Track page view
  trackEnhancedPageView();
  
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
  
  // Debug: Check if form elements are found
  if (!form) {
    console.error(`[Form] Contact form not found. Looking for ID: ${ELEMENTS.CONTACT_FORM}`);
  } else {
    console.log('[Form] Contact form found successfully');
  }

  // =================================================================
  // FORM FUNNEL TRACKING
  // =================================================================
  
  /**
   * Enhanced Form Tracking for GA4
   */
  class FormTracker {
    constructor(formElement) {
      this.form = formElement;
      if (!this.form) return;
      
      this.formStarted = false;
      this.fieldsCompleted = new Set();
      this.init();
    }

    init() {
      // Track form start (first field focus)
      const fields = this.form.querySelectorAll('input, textarea');
      fields.forEach(field => {
        // Skip honeypot field
        if (field.name === '_gotcha') return;
        
        field.addEventListener('focus', () => {
          if (!this.formStarted) {
            this.trackFormStart();
            this.formStarted = true;
          }
        }, { once: true });

        // Track field completion
        field.addEventListener('blur', () => {
          if (field.value.trim() && !this.fieldsCompleted.has(field.name)) {
            this.trackFieldComplete(field.name);
            this.fieldsCompleted.add(field.name);
          }
        });

        // Track field errors
        field.addEventListener('invalid', () => {
          this.trackFieldError(field.name, field.validationMessage);
        });
      });

      // Track form submission
      this.form.addEventListener('submit', () => {
        this.trackFormSubmit();
      });
    }

    trackFormStart() {
      if (typeof gtag === 'function') {
        gtag('event', 'form_start', {
          form_name: 'contact',
          page_path: window.location.pathname
        });
        console.log('[Analytics] Form start tracked');
      }
    }

    trackFieldComplete(fieldName) {
      if (typeof gtag === 'function') {
        gtag('event', 'form_field_complete', {
          form_name: 'contact',
          field_name: fieldName,
          fields_completed: this.fieldsCompleted.size + 1
        });
        console.log(`[Analytics] Field complete tracked: ${fieldName}`);
      }
    }

    trackFieldError(fieldName, errorMessage) {
      if (typeof gtag === 'function') {
        gtag('event', 'form_error', {
          form_name: 'contact',
          field_name: fieldName,
          error_message: errorMessage
        });
        console.log(`[Analytics] Field error tracked: ${fieldName}`);
      }
    }

    trackFormSubmit() {
      if (typeof gtag === 'function') {
        gtag('event', 'form_submit', {
          form_name: 'contact',
          fields_completed: this.fieldsCompleted.size,
          conversion: true
        });
        console.log('[Analytics] Form submit tracked');
      }
    }
  }

  // Initialize form tracker
  if (form) {
    const formTracker = new FormTracker(form);
  }

  /**
   * Clear error state from a form field
   * @param {HTMLElement} field - Input or textarea element
   */
  function clearError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('error');
      const errorSpan = formGroup.querySelector('.error-message');
      if (errorSpan) errorSpan.textContent = '';
    }
  }

  /**
   * Show error state on a form field
   * @param {HTMLElement} field - Input or textarea element
   * @param {string} message - Error message to display
   */
  function showError(field, message) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('error');
      const errorSpan = formGroup.querySelector('.error-message');
      if (errorSpan) errorSpan.textContent = message;
    }
  }

  /**
   * Validates form fields before submission with inline errors
   * @returns {boolean} True if form is valid
   */
  function validateContactForm() {
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');
    const honeypot = form.querySelector('input[name="_gotcha"]');
    
    let isValid = true;

    // Clear all previous errors
    [nameInput, emailInput, messageInput].forEach(clearError);

    // Check honeypot (if filled, it's spam)
    if (honeypot?.value) {
      return false; // Silently reject spam
    }

    // Validate name
    if (!isNotEmpty(nameInput?.value)) {
      showError(nameInput, 'Name is required');
      isValid = false;
    }

    // Validate email
    if (!isNotEmpty(emailInput?.value)) {
      showError(emailInput, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(emailInput?.value)) {
      showError(emailInput, 'Invalid email format (e.g., user@example.com)');
      isValid = false;
    }

    // Validate message
    if (!isNotEmpty(messageInput?.value)) {
      showError(messageInput, 'Message is required');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'Message must be at least 10 characters');
      isValid = false;
    }

    return isValid;
  }

  // Add real-time validation on blur
  if (form) {
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    nameInput?.addEventListener('blur', () => {
      clearError(nameInput);
      if (!isNotEmpty(nameInput.value)) {
        showError(nameInput, 'Name is required');
      }
    });

    emailInput?.addEventListener('blur', () => {
      clearError(emailInput);
      if (!isNotEmpty(emailInput.value)) {
        showError(emailInput, 'Email is required');
      } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, 'Invalid email format (e.g., user@example.com)');
      }
    });

    messageInput?.addEventListener('blur', () => {
      clearError(messageInput);
      if (!isNotEmpty(messageInput.value)) {
        showError(messageInput, 'Message is required');
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters');
      }
    });
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

    // Clear status message
    statusDiv.innerHTML = '';
    statusDiv.className = '';

    // Validate form before submission
    if (!validateContactForm()) {
      return;
    }

    const data = new FormData(event.target);

    // Update UI to show loading state with spinner
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    if (btnText) btnText.style.display = 'none';
    if (btnSpinner) btnSpinner.style.display = 'inline-flex';

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
        
        // Update button to show success
        if (btnText) btnText.textContent = "Message Sent!";
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btnText) btnText.style.display = 'inline';
        
        // Track successful form submission
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', {
            event_category: 'Contact Form',
            event_label: 'success'
          });
          console.log('[Analytics] Form submission tracked');
        } else {
          console.warn('[Analytics] Google Analytics not loaded');
        }
      } else {
        // Handle server-side validation errors
        console.error('[Form] Submission failed with status:', response.status);
        
        // Reset button state
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
        
        if (response.status === 404) {
          statusDiv.innerHTML = "Form endpoint not found. Please verify your Formspree form ID.";
        } else {
          try {
            const responseData = await response.json();
            if (Object.hasOwn(responseData, "errors")) {
              statusDiv.innerHTML = responseData["errors"].map((error) => error["message"]).join(", ");
            } else {
              statusDiv.innerHTML = MESSAGES.FORM_ERROR;
            }
          } catch (e) {
            statusDiv.innerHTML = MESSAGES.FORM_ERROR;
          }
        }
        statusDiv.className = "error";
      }
    } catch (error) {
      // Handle network errors
      console.error("Form submission error:", error);
      statusDiv.innerHTML = MESSAGES.NETWORK_ERROR;
      statusDiv.className = "error";
      submitBtn.disabled = false;
      if (btnText) btnText.style.display = 'inline';
      if (btnSpinner) btnSpinner.style.display = 'none';
    }
  }
  
  // Attach submit event listener to form (if form exists on page)
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }

  // =================================================================
  // SERVICE WORKER REGISTRATION (PWA)
  // =================================================================
  
  /**
   * Register service worker for PWA functionality
   * Provides offline caching and app-like experience
   */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Use relative path for local development and absolute for production
      const swPath = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? './service-worker.js'
        : '/Cool-MJ/service-worker.js';
      
      navigator.serviceWorker.register(swPath)
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New version available! Refresh to update.');
              }
            });
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    });
  }
});