/**
 * Scroll Depth Tracking for Google Analytics 4
 * Tracks when users scroll to 25%, 50%, 75%, 90%, and 100% of page
 */

class ScrollTracker {
  constructor() {
    this.milestones = [25, 50, 75, 90, 100];
    this.tracked = new Set();
    this.init();
  }

  init() {
    // Throttle scroll events to every 100ms using requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  checkScroll() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const percentScrolled = Math.round((scrolled / scrollHeight) * 100);

    this.milestones.forEach(milestone => {
      if (percentScrolled >= milestone && !this.tracked.has(milestone)) {
        this.tracked.add(milestone);
        this.trackScrollMilestone(milestone);
      }
    });
  }

  trackScrollMilestone(percent) {
    if (typeof gtag === 'function') {
      gtag('event', 'scroll', {
        percent_scrolled: percent,
        page_title: document.title,
        page_path: window.location.pathname
      });
      console.log(`[Analytics] Scroll milestone tracked: ${percent}%`);
    }
  }
}

// Initialize scroll tracker
const scrollTracker = new ScrollTracker();
export default scrollTracker;
