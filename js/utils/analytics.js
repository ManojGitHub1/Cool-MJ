/**
 * @file Google Analytics Integration
 * @description Custom event tracking for user interactions
 * @author Manoj Jivanagi
 * @version 1.0.0
 */

/**
 * Google Analytics 4 Helper Functions
 * Tracks custom events for better insights
 */

/**
 * Track music widget interactions
 * @param {string} action - Action type (play, pause, next, previous, volume)
 * @param {string} trackName - Name of the track (optional)
 */
export function trackMusicEvent(action, trackName = '') {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'music_interaction', {
      event_category: 'Music Widget',
      event_label: action,
      music_track: trackName,
      page_path: window.location.pathname
    });
  }
}

/**
 * Track theme toggle
 * @param {string} newTheme - Theme switched to ('light' or 'neon')
 */
export function trackThemeToggle(newTheme) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'theme_change', {
      event_category: 'Theme',
      event_label: newTheme,
      page_path: window.location.pathname
    });
  }
}

/**
 * Track blog post views
 * @param {string} postSlug - Blog post slug
 * @param {string} postTitle - Blog post title
 */
export function trackBlogView(postSlug, postTitle) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'blog_post_view', {
      event_category: 'Blog',
      event_label: postTitle,
      post_slug: postSlug,
      page_path: window.location.pathname
    });
  }
}

/**
 * Track blog post likes
 * @param {string} postId - Blog post ID
 * @param {boolean} liked - Whether post was liked or unliked
 */
export function trackBlogLike(postId, liked) {
  if (typeof gtag !== 'undefined') {
    gtag('event', liked ? 'blog_like' : 'blog_unlike', {
      event_category: 'Blog',
      event_label: postId,
      action_type: liked ? 'like' : 'unlike'
    });
  }
}

/**
 * Track project link clicks
 * @param {string} projectName - Name of the project
 * @param {string} linkType - Type of link ('demo', 'github', 'details')
 */
export function trackProjectClick(projectName, linkType) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'project_click', {
      event_category: 'Projects',
      event_label: projectName,
      link_type: linkType
    });
  }
}

/**
 * Track form submissions
 * @param {string} formName - Name of the form
 * @param {boolean} success - Whether submission was successful
 */
export function trackFormSubmission(formName, success) {
  if (typeof gtag !== 'undefined') {
    gtag('event', success ? 'form_submit_success' : 'form_submit_error', {
      event_category: 'Form',
      event_label: formName,
      status: success ? 'success' : 'error'
    });
  }
}

/**
 * Track search queries
 * @param {string} searchTerm - Search query
 * @param {number} resultsCount - Number of results found
 */
export function trackSearch(searchTerm, resultsCount) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount,
      event_category: 'Blog Search'
    });
  }
}

/**
 * Track outbound links
 * @param {string} url - External URL clicked
 * @param {string} label - Link label or context
 */
export function trackOutboundLink(url, label = '') {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'click', {
      event_category: 'Outbound Link',
      event_label: label || url,
      transport_type: 'beacon',
      destination_url: url
    });
  }
}

/**
 * Track page timing (Core Web Vitals)
 * Automatically tracks performance metrics
 */
export function trackWebVitals() {
  if (typeof gtag !== 'undefined' && 'PerformanceObserver' in window) {
    // Track Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      gtag('event', 'LCP', {
        event_category: 'Web Vitals',
        value: Math.round(lastEntry.renderTime || lastEntry.loadTime),
        metric_id: 'LCP'
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Track First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        gtag('event', 'FID', {
          event_category: 'Web Vitals',
          value: Math.round(entry.processingStart - entry.startTime),
          metric_id: 'FID'
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      gtag('event', 'CLS', {
        event_category: 'Web Vitals',
        value: Math.round(clsValue * 1000),
        metric_id: 'CLS'
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
}
