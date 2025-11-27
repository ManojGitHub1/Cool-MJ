/**
 * Global Error Tracking for Google Analytics 4
 * Tracks JavaScript errors and unhandled promise rejections
 */

// Track global JavaScript errors
window.addEventListener('error', (event) => {
  if (typeof gtag === 'function') {
    gtag('event', 'exception', {
      type: 'javascript_error',
      description: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
      fatal: false
    });
  }
});

// Track unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (typeof gtag === 'function') {
    gtag('event', 'exception', {
      type: 'promise_rejection',
      description: `Unhandled promise rejection: ${event.reason}`,
      fatal: false
    });
  }
});
