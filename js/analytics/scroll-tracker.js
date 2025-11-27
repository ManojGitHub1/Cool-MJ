/**
 * Scroll Depth Tracking for Google Analytics 4
 * Tracks when users scroll to 25%, 50%, 75%, 90%, and 100% of page
 */

const milestones = [25, 50, 75, 90, 100];
const tracked = new Set();

function checkScroll() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;
  
  // Handle pages shorter than viewport
  if (scrollHeight <= 0) {
    if (!tracked.has(100)) {
      tracked.add(100);
      trackScrollMilestone(100);
    }
    return;
  }
  
  const percentScrolled = Math.round((scrolled / scrollHeight) * 100);

  milestones.forEach(milestone => {
    if (percentScrolled >= milestone && !tracked.has(milestone)) {
      tracked.add(milestone);
      trackScrollMilestone(milestone);
    }
  });
}

function trackScrollMilestone(percent) {
  if (typeof gtag === 'function') {
    gtag('event', 'scroll', {
      percent_scrolled: percent,
      page_title: document.title,
      page_path: window.location.pathname
    });
  }
}

// Throttle scroll events
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      checkScroll();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
