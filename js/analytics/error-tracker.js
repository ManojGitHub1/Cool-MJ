/**
 * Global Error Tracking for Google Analytics 4
 * Tracks JavaScript errors, unhandled promise rejections, and network errors
 */

class ErrorTracker {
  constructor() {
    this.init();
  }

  init() {
    // Track global JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'javascript_error',
        description: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        fatal: false,
        page_path: window.location.pathname
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'promise_rejection',
        description: `Unhandled promise rejection: ${event.reason}`,
        fatal: false,
        page_path: window.location.pathname
      });
    });

    // Monitor fetch API for network errors
    this.monitorFetchErrors();
  }

  trackError(errorData) {
    if (typeof gtag === 'function') {
      gtag('event', 'exception', errorData);
      console.log('[Analytics] Error tracked:', errorData);
    }
  }

  monitorFetchErrors() {
    if (typeof window.fetch === 'undefined') return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.trackError({
            type: 'network_error',
            description: `HTTP ${response.status} - ${args[0]}`,
            fatal: false,
            page_path: window.location.pathname
          });
        }
        return response;
      } catch (error) {
        this.trackError({
          type: 'network_error',
          description: `Fetch failed: ${error.message} - ${args[0]}`,
          fatal: false,
          page_path: window.location.pathname
        });
        throw error;
      }
    };
  }
}

// Initialize error tracker
const errorTracker = new ErrorTracker();
export default errorTracker;
