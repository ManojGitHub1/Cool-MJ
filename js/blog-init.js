/**
 * @file Blog Page Initialization
 * @description Initializes the blog page with BlogManager and handles meta tags
 * @author Manoj Jivanagi
 * @version 1.0.0
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

// Initialize blog when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize MetaManager (already loaded globally)
  const metaManager = new MetaManager(SITE_CONFIG);
  
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
        }
      }
    } else {
      // Render all blog posts as cards
      blogManager.renderBlogList('blog-posts-container');
      
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
