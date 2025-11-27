/**
 * @file Blog Page Initialization
 * @description Initializes the blog page with BlogManager, search, and meta tags
 * @author Manoj Jivanagi
 * @version 1.1.0
 */

import { BlogManager } from './blog-renderer.js';

// Helper functions for blog post meta tags
function getBlogPostOpenGraph(post) {
  return {
    title: post.title,
    description: post.excerpt,
    image: post.coverImage || 'https://manojgithub1.github.io/Cool-MJ/images/ShareCard.png',
    url: `https://manojgithub1.github.io/Cool-MJ/pages/blog.html?post=${post.slug}`,
    type: 'article'
  };
}

function getBlogPostTwitterCard(post) {
  return {
    card: 'summary_large_image',
    title: post.title,
    description: post.excerpt,
    image: post.coverImage || 'https://manojgithub1.github.io/Cool-MJ/images/ShareCard.png'
  };
}

function createBlogPostSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    author: {
      '@type': 'Person',
      name: post.author
    },
    datePublished: post.date,
    dateModified: post.date,
    description: post.excerpt,
    image: post.coverImage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://manojgithub1.github.io/Cool-MJ/pages/blog.html?post=${post.slug}`
    }
  };
}

/**
 * Track search in Google Analytics
 * @param {string} query - Search query
 * @param {number} resultsCount - Number of results
 */
function trackSearch(query, resultsCount) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'search', {
      search_term: query,
      results_count: resultsCount
    });
  }
}

/**
 * Initialize search functionality
 * @param {BlogManager} blogManager - The blog manager instance
 */
function initBlogSearch(blogManager) {
  const searchInput = document.getElementById('blog-search');
  const clearBtn = document.getElementById('search-clear');
  const resultsCount = document.getElementById('search-results-count');
  const container = document.getElementById('blog-posts-container');
  
  if (!searchInput) return;
  
  let searchTimeout;
  let allPosts = blogManager.posts;
  
  /**
   * Perform search and update UI
   * @param {string} query - Search query
   */
  function performSearch(query) {
    const trimmedQuery = query.trim();
    
    // Show/hide clear button
    clearBtn.style.display = trimmedQuery ? 'flex' : 'none';
    
    if (!trimmedQuery) {
      // Reset to show all posts
      resultsCount.style.display = 'none';
      blogManager.renderBlogList('blog-posts-container');
      return;
    }
    
    // Search posts
    const results = blogManager.searchPosts(trimmedQuery);
    
    // Show results count
    resultsCount.style.display = 'block';
    resultsCount.innerHTML = `Found <span class="highlight">${results.length}</span> ${results.length === 1 ? 'post' : 'posts'} for "<span class="highlight">${trimmedQuery}</span>"`;
    
    // Track search in analytics (debounced)
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      trackSearch(trimmedQuery, results.length);
    }, 1000);
    
    // Render results or show no results message
    if (results.length > 0) {
      // Temporarily replace posts to render filtered list
      const originalPosts = blogManager.posts;
      blogManager.posts = results;
      blogManager.renderBlogList('blog-posts-container');
      blogManager.posts = originalPosts;
    } else {
      container.innerHTML = `
        <div class="no-results">
          <i class='bx bx-search-alt-2'></i>
          <h3>No posts found</h3>
          <p>Try searching with different keywords</p>
        </div>
      `;
    }
  }
  
  // Search on input
  searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });
  
  // Clear search
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    performSearch('');
    searchInput.focus();
  });
  
  // Keyboard shortcut: Ctrl+K or Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    
    // Escape to clear and blur
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      performSearch('');
      searchInput.blur();
    }
  });
}

/**
 * Initialize share functionality for single post
 */
function initShareFunctionality() {
  const shareBtn = document.getElementById('share-post-btn');
  if (!shareBtn) return;
  
  const url = shareBtn.dataset.url;
  const title = shareBtn.dataset.title;
  
  shareBtn.addEventListener('click', async () => {
    // Try Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
        
        // Track share event
        if (typeof gtag !== 'undefined') {
          gtag('event', 'share', {
            method: 'Web Share API',
            content_type: 'blog_post',
            item_id: url
          });
        }
      } catch (error) {
        // User canceled or error occurred
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      // Fallback: Copy to clipboard (desktop)
      try {
        await navigator.clipboard.writeText(url);
        showToast('Link copied to clipboard!');
        
        // Track share event
        if (typeof gtag !== 'undefined') {
          gtag('event', 'share', {
            method: 'clipboard',
            content_type: 'blog_post',
            item_id: url
          });
        }
      } catch (error) {
        console.error('Copy failed:', error);
        showToast('Failed to copy link', 'error');
      }
    }
  });
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type (success or error)
 */
function showToast(message, type = 'success') {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i>
    <span>${message}</span>
  `;
  
  // Add to body
  document.body.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/**
 * Initialize reading progress bar for single post view
 */
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;
  
  let ticking = false;
  
  /**
   * Calculate and update progress
   */
  function updateProgress() {
    // Get the content element (single post content)
    const postContent = document.querySelector('.single-post__content');
    if (!postContent) {
      progressBar.style.width = '0%';
      return;
    }
    
    // Calculate scroll percentage
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update progress bar width
    progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    
    ticking = false;
  }
  
  /**
   * Request animation frame for smooth updates
   */
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }
  
  // Update on scroll
  window.addEventListener('scroll', requestTick, { passive: true });
  
  // Initial update
  updateProgress();
}

// Initialize blog when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize MetaManager (already loaded globally)
  const metaManager = new MetaManager(SITE_CONFIG);
  
  // Use relative path that works both locally and on GitHub Pages
  const blogManager = new BlogManager('../blog-posts.json');
  
  // Check if we're viewing a single post or the list
  const urlParams = new URLSearchParams(window.location.search);
  const postSlug = urlParams.get('post');
  
  try {
    // Show loading state
    blogManager.showLoading('blog-posts-container');
    
    // Load posts from JSON
    await blogManager.loadPosts();
    
    if (postSlug) {
      // Hide search bar for single post view
      const searchContainer = document.querySelector('.blog-search-container');
      if (searchContainer) {
        searchContainer.style.display = 'none';
      }
      
      // Render single post view
      const postFound = blogManager.renderSinglePost(postSlug, 'blog-posts-container');
      
      // Update page title and meta tags if post found
      if (postFound) {
        const post = blogManager.getPostBySlug(postSlug);
        if (post) {
          // Set page title
          document.title = `${post.title} | Manoj`;
          
          // Set dynamic meta tags for the blog post
          metaManager.setTitle(post.title);
          metaManager.setDescription(post.excerpt);
          metaManager.setCanonicalURL(`${SITE_CONFIG.siteUrl}/pages/blog.html?post=${post.slug}`);
          
          // Set Open Graph tags
          metaManager.setOpenGraph(getBlogPostOpenGraph(post));
          
          // Set Twitter Card tags
          metaManager.setTwitterCard(getBlogPostTwitterCard(post));
          
          // Set Article structured data
          metaManager.setStructuredData(createBlogPostSchema(post));
          
          // Initialize reading progress bar for single post
          initReadingProgress();
          
          // Initialize share functionality
          initShareFunctionality();
        }
      }
    } else {
      // Render all blog posts as cards
      blogManager.renderBlogList('blog-posts-container');
      
      // Initialize search functionality for blog list view
      initBlogSearch(blogManager);
      
      // Set default blog page meta
      const blogMeta = getMetaConfig('blog');
      metaManager.setPageMeta(blogMeta);
    }
  } catch (error) {
    console.error('Error loading blog:', error);
    const container = document.getElementById('blog-posts-container');
    if (container) {
      container.innerHTML = '<p class="error-message">Failed to load blog posts. Please try again later.</p>';
    }
  }
});
