/**
 * Blog Renderer Module
 * Handles dynamic loading and rendering of blog posts from JSON data
 * 
 * @author Manoj
 * @version 1.0.0
 */

import { error as logError } from './utils/logger.js';

/**
 * LikeManager Class
 * Manages blog post likes using localStorage
 */
class LikeManager {
  /**
   * Initialize the LikeManager
   */
  constructor() {
    this.storagePrefix = 'blog_like_';
  }

  /**
   * Get the total like count for a post (base + user like)
   * @param {number} postId - Post ID
   * @param {number} baseLikes - Base like count from JSON
   * @returns {number} Total like count
   */
  getLikeCount(postId, baseLikes) {
    const userLiked = this.hasUserLiked(postId);
    return baseLikes + (userLiked ? 1 : 0);
  }

  /**
   * Check if the current user has liked a post
   * @param {number} postId - Post ID
   * @returns {boolean} True if user has liked this post
   */
  hasUserLiked(postId) {
    try {
      const liked = localStorage.getItem(`${this.storagePrefix}${postId}`);
      return liked === 'true';
    } catch (err) {
      logError('LikeManager: Error reading localStorage', err);
      return false;
    }
  }

  /**
   * Toggle like status for a post
   * @param {number} postId - Post ID
   * @param {number} baseLikes - Base like count from JSON
   * @returns {Object} Updated state { liked: boolean, count: number }
   */
  toggleLike(postId, baseLikes) {
    try {
      const currentlyLiked = this.hasUserLiked(postId);
      const newLikedState = !currentlyLiked;
      
      // Save new state
      localStorage.setItem(`${this.storagePrefix}${postId}`, newLikedState.toString());
      
      // Calculate new count
      const newCount = baseLikes + (newLikedState ? 1 : 0);
      
      return {
        liked: newLikedState,
        count: newCount
      };
    } catch (err) {
      logError('LikeManager: Error toggling like', err);
      return {
        liked: this.hasUserLiked(postId),
        count: this.getLikeCount(postId, baseLikes)
      };
    }
  }

  /**
   * Clear all likes (for testing)
   */
  clearAllLikes() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (err) {
      logError('LikeManager: Error clearing likes', err);
    }
  }
}

/**
 * BlogManager Class
 * Manages blog post loading, rendering, filtering, and search functionality
 */
class BlogManager {
  /**
   * Initialize the BlogManager
   * @param {string} jsonPath - Path to the blog-posts.json file
   */
  constructor(jsonPath = '../blog-posts.json') {
    this.jsonPath = jsonPath;
    this.posts = [];
    this.isLoading = false;
    this.error = null;
    this.likeManager = new LikeManager();
  }

  /**
   * Load blog posts from JSON file
   * @returns {Promise<Array>} Array of blog post objects
   * @throws {Error} If fetch fails or JSON is invalid
   */
  async loadPosts() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch(this.jsonPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.posts || !Array.isArray(data.posts)) {
        throw new Error('Invalid JSON structure: "posts" array not found');
      }

      this.posts = data.posts;
      this.isLoading = false;
      return this.posts;
    } catch (err) {
      this.isLoading = false;
      this.error = err.message;
      logError('BlogManager: Error loading posts', err);
      throw err;
    }
  }

  /**
   * Render blog post list as cards
   * @param {string} containerId - ID of the container element
   * @param {Array} posts - Array of posts to render (optional, uses all posts if not provided)
   */
  renderBlogList(containerId = 'blog-posts-container', posts = null) {
    const container = document.getElementById(containerId);
    
    if (!container) {
      logError(`BlogManager: Container #${containerId} not found`);
      return;
    }

    const postsToRender = posts || this.posts;

    if (postsToRender.length === 0) {
      container.innerHTML = '<p class="no-posts-message">No blog posts found.</p>';
      return;
    }

    // Generate HTML for all blog cards
    const cardsHTML = postsToRender.map(post => this._createBlogCard(post)).join('');
    container.innerHTML = cardsHTML;
    
    // Attach like button event listeners
    this._attachLikeButtonListeners();
  }

  /**
   * Attach event listeners to like buttons
   * @private
   */
  _attachLikeButtonListeners() {
    const likeButtons = document.querySelectorAll('.like-button');
    
    likeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._handleLikeClick(button);
      });
    });
  }

  /**
   * Handle like button click
   * @private
   * @param {HTMLElement} button - The like button element
   */
  _handleLikeClick(button) {
    const postId = parseInt(button.dataset.postId);
    const baseLikes = parseInt(button.dataset.baseLikes);
    
    // Toggle like
    const { liked, count } = this.likeManager.toggleLike(postId, baseLikes);
    
    // Update button UI
    const icon = button.querySelector('.like-button__icon');
    const countSpan = button.querySelector('.like-button__count');
    
    // Animate heart
    button.classList.add('like-button--animating');
    
    setTimeout(() => {
      button.classList.remove('like-button--animating');
    }, 300);
    
    // Update heart icon
    if (liked) {
      icon.classList.remove('bx-heart');
      icon.classList.add('bxs-heart');
      button.classList.add('like-button--liked');
      button.title = 'Unlike this post';
    } else {
      icon.classList.remove('bxs-heart');
      icon.classList.add('bx-heart');
      button.classList.remove('like-button--liked');
      button.title = 'Like this post';
    }
    
    // Update count
    countSpan.textContent = count;
  }

  /**
   * Create HTML for a single blog card
   * @private
   * @param {Object} post - Blog post object
   * @returns {string} HTML string for the blog card
   */
  _createBlogCard(post) {
    const featuredBadge = post.featured ? '<span class="featured-badge">Featured</span>' : '';
    const tagsHTML = post.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('');
    
    // Get like count and status
    const likeCount = this.likeManager.getLikeCount(post.id, post.likes);
    const isLiked = this.likeManager.hasUserLiked(post.id);
    const heartIcon = isLiked ? 'bxs-heart' : 'bx-heart';
    const likedClass = isLiked ? 'like-button--liked' : '';

    return `
      <article class="blog-card blog-card--horizontal" data-aos="fade-up" data-post-id="${post.id}">
        ${featuredBadge}
        <div class="blog-card__image-wrapper">
          <img src="${post.image}" alt="${post.imageAlt}" class="blog-card__image" loading="lazy">
        </div>
        <div class="blog-card__content">
          <div class="blog-card__header">
            <h3 class="blog-card__title">${post.title}</h3>
            <div class="blog-card__meta">
              <span class="meta-item"><i class='bx bx-calendar'></i> ${this._formatDate(post.date)}</span>
              <span class="meta-item"><i class='bx bx-time-five'></i> ${post.readTime}</span>
            </div>
          </div>
          <div class="blog-card__body">
            <p class="blog-card__excerpt">${post.excerpt}</p>
          </div>
          <div class="blog-card__footer">
            <div class="blog-card__tags">
              ${tagsHTML}
            </div>
            <button 
              class="like-button ${likedClass}" 
              data-post-id="${post.id}" 
              data-base-likes="${post.likes}"
              aria-label="Like this post"
              title="${isLiked ? 'Unlike' : 'Like'} this post"
            >
              <i class='bx ${heartIcon} like-button__icon'></i>
              <span class="like-button__count">${likeCount}</span>
            </button>
          </div>
        </div>
        <a href="blog.html?post=${post.slug}" class="blog-card__link" aria-label="Read ${post.title}"></a>
      </article>
    `;
  }

  /**
   * Render a single blog post in full view
   * @param {string} slug - URL slug of the post to render
   * @param {string} containerId - ID of the container element
   * @returns {boolean} True if post was found and rendered, false otherwise
   */
  renderSinglePost(slug, containerId = 'blog-posts-container') {
    const container = document.getElementById(containerId);
    
    if (!container) {
      logError(`BlogManager: Container #${containerId} not found`);
      return false;
    }

    const post = this.posts.find(p => p.slug === slug);

    if (!post) {
      container.innerHTML = `
        <div class="post-not-found" data-aos="fade-up">
          <h2>Post Not Found</h2>
          <p>Sorry, the blog post you're looking for doesn't exist.</p>
          <a href="blog.html" class="btn-project">← Back to All Posts</a>
        </div>
      `;
      return false;
    }

    // Add body class to hide header/nav
    document.body.classList.add('single-post-view');

    // Generate single post HTML
    const postHTML = this._createSinglePostHTML(post);
    container.innerHTML = postHTML;
    
    // Add navigation buttons
    this._addPostNavigation(post, container);
    
    // Attach like button event listeners
    this._attachLikeButtonListeners();

    return true;
  }

  /**
   * Create HTML for single post view
   * @private
   * @param {Object} post - Blog post object
   * @returns {string} HTML string for the full post
   */
  _createSinglePostHTML(post) {
    const tagsHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    // Get like count and status
    const likeCount = this.likeManager.getLikeCount(post.id, post.likes);
    const isLiked = this.likeManager.hasUserLiked(post.id);
    const heartIcon = isLiked ? 'bxs-heart' : 'bx-heart';
    const likedClass = isLiked ? 'like-button--liked' : '';

    return `
      <a href="blog.html" class="single-post__back-btn">
        <i class='bx bx-arrow-back'></i>
        Back to Blog
      </a>
      
      <article class="single-post" data-aos="fade-up">
        <header class="single-post__hero">
          <div class="post-category">${post.category}</div>
          <h1 class="post-title">${post.title}</h1>
          <div class="blog-card__meta" style="justify-content: center;">
            <span class="meta-item"><i class='bx bx-user'></i> ${post.author}</span>
            <span class="meta-item"><i class='bx bx-calendar'></i> ${this._formatDate(post.date)}</span>
            <span class="meta-item"><i class='bx bx-time-five'></i> ${post.readTime}</span>
          </div>
          <div class="blog-card__tags" style="justify-content: center; margin-top: 15px;">
            ${tagsHTML}
          </div>
          <div style="margin-top: 20px;">
            <button 
              class="like-button ${likedClass}" 
              data-post-id="${post.id}" 
              data-base-likes="${post.likes}"
              aria-label="Like this post"
              title="${isLiked ? 'Unlike' : 'Like'} this post"
            >
              <i class='bx ${heartIcon} like-button__icon'></i>
              <span class="like-button__count">${likeCount}</span>
            </button>
          </div>
        </header>
        
        <div class="single-post__content" data-aos="fade-up" data-aos-delay="200">
          ${post.content}
        </div>
        
        <div class="share-section" data-aos="fade-up">
          <button class="share-post-btn" id="share-post-btn" data-url="${window.location.href}" data-title="${post.title}">
            <i class='bx bx-share-alt'></i>
            Share this post
          </button>
        </div>
        
        <footer class="post-footer" data-aos="fade-up">
          <div class="post-navigation" id="post-navigation"></div>
        </footer>
      </article>
    `;
  }

  /**
   * Add previous/next post navigation
   * @private
   * @param {Object} currentPost - Current post object
   * @param {HTMLElement} container - Container element
   */
  _addPostNavigation(currentPost, container) {
    const currentIndex = this.posts.findIndex(p => p.id === currentPost.id);
    const navContainer = container.querySelector('#post-navigation');
    
    if (!navContainer) return;

    let navHTML = '<div class="nav-posts">';

    // Previous post
    if (currentIndex > 0) {
      const prevPost = this.posts[currentIndex - 1];
      navHTML += `
        <a href="blog.html?post=${prevPost.slug}" class="nav-post nav-post-prev">
          <span class="nav-label">← Previous</span>
          <span class="nav-title">${prevPost.title}</span>
        </a>
      `;
    }

    // Next post
    if (currentIndex < this.posts.length - 1) {
      const nextPost = this.posts[currentIndex + 1];
      navHTML += `
        <a href="blog.html?post=${nextPost.slug}" class="nav-post nav-post-next">
          <span class="nav-label">Next →</span>
          <span class="nav-title">${nextPost.title}</span>
        </a>
      `;
    }

    navHTML += '</div>';
    navContainer.innerHTML = navHTML;
  }

  /**
   * Filter posts by tag
   * @param {string} tag - Tag to filter by
   * @returns {Array} Filtered posts
   */
  filterByTag(tag) {
    return this.posts.filter(post => 
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  /**
   * Filter posts by category
   * @param {string} category - Category to filter by
   * @returns {Array} Filtered posts
   */
  filterByCategory(category) {
    return this.posts.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Search posts by query string
   * @param {string} query - Search query
   * @returns {Array} Matching posts
   */
  searchPosts(query) {
    const lowerQuery = query.toLowerCase();
    
    return this.posts.filter(post => {
      return (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        post.category.toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * Get featured posts
   * @returns {Array} Featured posts
   */
  getFeaturedPosts() {
    return this.posts.filter(post => post.featured);
  }

  /**
   * Get post by slug
   * @param {string} slug - Post slug
   * @returns {Object|null} Post object or null if not found
   */
  getPostBySlug(slug) {
    return this.posts.find(p => p.slug === slug) || null;
  }

  /**
   * Format date string to readable format
   * @private
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @returns {string} Formatted date string
   */
  _formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Show loading state in container
   * @param {string} containerId - ID of the container element
   */
  showLoading(containerId = 'blog-posts-container') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading blog posts...</p>
        </div>
      `;
    }
  }

  /**
   * Show error state in container
   * @param {string} containerId - ID of the container element
   * @param {string} message - Error message to display
   */
  showError(containerId = 'blog-posts-container', message = null) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="error-state" data-aos="fade-up">
          <i class='bx bx-error-circle'></i>
          <h3>Oops! Something went wrong</h3>
          <p>${message || this.error || 'Failed to load blog posts. Please try again later.'}</p>
          <button onclick="location.reload()" class="btn-project">Retry</button>
        </div>
      `;
    }
  }
}

// Export for use in other files
export { BlogManager, LikeManager };
