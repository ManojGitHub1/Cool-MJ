/**
 * Blog Page Initialization - Simplified
 */

import { BlogManager } from './blog-renderer.js';

// Initialize blog when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize MetaManager
    const metaManager = new window.MetaManager(window.SITE_CONFIG);
    
    // Create BlogManager
    const blogManager = new BlogManager('../blog-posts.json');
    
    // Check if viewing single post or list
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    
    // Show loading state
    blogManager.showLoading('blog-posts-container');
    
    // Load posts
    await blogManager.loadPosts();
    
    if (postSlug) {
      // Single post view
      const searchContainer = document.querySelector('.blog-search-container');
      if (searchContainer) searchContainer.style.display = 'none';
      
      // Render single post using slug
      const postFound = blogManager.renderSinglePost(postSlug, 'blog-posts-container');
      
      if (postFound) {
        const post = blogManager.posts.find(p => p.slug === postSlug);
        
        // Set meta tags
        metaManager.setTitle(post.title);
        metaManager.setDescription(post.excerpt);
        if (post.coverImage) metaManager.setImage(post.coverImage);
        metaManager.setOpenGraph({
          title: post.title,
          description: post.excerpt,
          image: post.coverImage,
          url: `${window.SITE_CONFIG.siteUrl}/pages/blog.html?post=${post.slug}`,
          type: 'article'
        });
        
        // Track blog view
        if (typeof gtag === 'function') {
          gtag('event', 'blog_view', {
            post_title: post.title,
            post_slug: post.slug
          });
        }
        
        // Initialize and update reading progress bar
        window.addEventListener('scroll', updateReadingProgress, { passive: true });
        // Call once on load to set initial state
        setTimeout(updateReadingProgress, 100);
      }
    } else {
      // Blog list view
      blogManager.renderBlogList('blog-posts-container');
      initSearch(blogManager);
      
      // Set default meta
      const blogMeta = window.getMetaConfig('blog');
      metaManager.setPageMeta(blogMeta);
    }
  } catch (error) {
    console.error('Error loading blog:', error);
    document.getElementById('blog-posts-container').innerHTML = 
      '<p class="error-message">Failed to load blog posts. Please try again later.</p>';
  }
});

// Simple search function
function initSearch(blogManager) {
  const searchInput = document.getElementById('blog-search');
  const clearBtn = document.getElementById('search-clear');
  const resultsCount = document.getElementById('search-results-count');
  
  if (!searchInput) return;
  
  function performSearch(query) {
    const trimmedQuery = query.trim();
    clearBtn.style.display = trimmedQuery ? 'flex' : 'none';
    
    if (!trimmedQuery) {
      resultsCount.style.display = 'none';
      blogManager.renderBlogList('blog-posts-container');
      return;
    }
    
    const results = blogManager.searchPosts(trimmedQuery);
    resultsCount.style.display = 'block';
    resultsCount.innerHTML = `Found <span class="highlight">${results.length}</span> ${results.length === 1 ? 'post' : 'posts'}`;
    
    if (results.length > 0) {
      const originalPosts = blogManager.posts;
      blogManager.posts = results;
      blogManager.renderBlogList('blog-posts-container');
      blogManager.posts = originalPosts;
    } else {
      document.getElementById('blog-posts-container').innerHTML = `
        <div class="no-results">
          <i class='bx bx-search-alt-2'></i>
          <h3>No posts found</h3>
          <p>Try different keywords</p>
        </div>
      `;
    }
    
    // Track search
    if (typeof gtag === 'function') {
      gtag('event', 'search', { search_term: trimmedQuery });
    }
  }
  
  searchInput.addEventListener('input', (e) => performSearch(e.target.value));
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    performSearch('');
  });
  
  // Ctrl+K shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

// Simple page scroll progress bar
function updateReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;
  
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const scrollableHeight = docHeight - windowHeight;
  
  if (scrollableHeight <= 0) {
    progressBar.style.width = '100%';
    return;
  }
  
  const percent = (scrollTop / scrollableHeight) * 100;
  progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
}
