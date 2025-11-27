/**
 * MetaManager Class
 * 
 * Manages dynamic meta tags for SEO and social media sharing.
 * Handles title, description, Open Graph, Twitter Cards, and Schema.org structured data.
 * 
 * @class MetaManager
 * @version 1.0.0
 * @author Manoj Jivanagi
 */
class MetaManager {
  /**
   * Create a MetaManager instance
   * @param {Object} config - Configuration object for meta tags
   * @param {string} config.siteName - Name of the website
   * @param {string} config.siteUrl - Base URL of the website
   * @param {string} config.defaultImage - Default Open Graph image URL
   * @param {string} config.twitterHandle - Twitter username (without @)
   * @param {string} config.author - Author name
   */
  constructor(config = {}) {
    this.config = {
      siteName: config.siteName || 'Manoj Jivanagi',
      siteUrl: config.siteUrl || window.location.origin,
      defaultImage: config.defaultImage || '/images/og-default.jpg',
      twitterHandle: config.twitterHandle || '',
      author: config.author || 'Manoj Jivanagi',
      locale: config.locale || 'en_US',
      type: config.type || 'website'
    };
  }

  /**
   * Set the page title
   * Updates both <title> tag and og:title
   * @param {string} title - Page title
   * @param {boolean} includeSiteName - Whether to append site name (default: true)
   */
  setTitle(title, includeSiteName = true) {
    const fullTitle = includeSiteName ? `${title} | ${this.config.siteName}` : title;
    
    // Update document title
    document.title = fullTitle;
    
    // Update or create og:title meta tag
    this._setMetaTag('og:title', title, 'property');
    
    // Update or create twitter:title meta tag
    this._setMetaTag('twitter:title', title, 'name');
  }

  /**
   * Set the page description
   * Updates meta description, og:description, and twitter:description
   * @param {string} description - Page description (recommended: 150-160 characters)
   */
  setDescription(description) {
    // Update or create meta description
    this._setMetaTag('description', description, 'name');
    
    // Update or create og:description
    this._setMetaTag('og:description', description, 'property');
    
    // Update or create twitter:description
    this._setMetaTag('twitter:description', description, 'name');
  }

  /**
   * Set canonical URL
   * Helps prevent duplicate content issues
   * @param {string} url - Canonical URL (default: current page URL)
   */
  setCanonicalURL(url = window.location.href) {
    // Remove existing canonical link if present
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Create new canonical link
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = url;
    document.head.appendChild(link);

    // Also set og:url
    this._setMetaTag('og:url', url, 'property');
  }

  /**
   * Set Open Graph meta tags for social media sharing
   * @param {Object} options - Open Graph options
   * @param {string} options.title - OG title
   * @param {string} options.description - OG description
   * @param {string} options.image - OG image URL
   * @param {string} options.url - Page URL
   * @param {string} options.type - Content type (website, article, etc.)
   * @param {string} options.imageAlt - Alt text for OG image
   * @param {number} options.imageWidth - Image width in pixels
   * @param {number} options.imageHeight - Image height in pixels
   */
  setOpenGraph(options = {}) {
    const ogData = {
      title: options.title || document.title,
      description: options.description || '',
      image: options.image || this.config.defaultImage,
      url: options.url || window.location.href,
      type: options.type || this.config.type,
      siteName: this.config.siteName,
      locale: this.config.locale
    };

    // Set basic OG tags
    this._setMetaTag('og:title', ogData.title, 'property');
    this._setMetaTag('og:description', ogData.description, 'property');
    this._setMetaTag('og:image', ogData.image, 'property');
    this._setMetaTag('og:url', ogData.url, 'property');
    this._setMetaTag('og:type', ogData.type, 'property');
    this._setMetaTag('og:site_name', ogData.siteName, 'property');
    this._setMetaTag('og:locale', ogData.locale, 'property');

    // Optional image properties
    if (options.imageAlt) {
      this._setMetaTag('og:image:alt', options.imageAlt, 'property');
    }
    if (options.imageWidth) {
      this._setMetaTag('og:image:width', options.imageWidth.toString(), 'property');
    }
    if (options.imageHeight) {
      this._setMetaTag('og:image:height', options.imageHeight.toString(), 'property');
    }

    // For article type, add additional properties
    if (ogData.type === 'article' && options.article) {
      if (options.article.publishedTime) {
        this._setMetaTag('article:published_time', options.article.publishedTime, 'property');
      }
      if (options.article.modifiedTime) {
        this._setMetaTag('article:modified_time', options.article.modifiedTime, 'property');
      }
      if (options.article.author) {
        this._setMetaTag('article:author', options.article.author, 'property');
      }
      if (options.article.tags && Array.isArray(options.article.tags)) {
        // Remove existing article:tag meta tags
        document.querySelectorAll('meta[property="article:tag"]').forEach(tag => tag.remove());
        // Add new tags
        options.article.tags.forEach(tag => {
          this._setMetaTag('article:tag', tag, 'property', false);
        });
      }
    }
  }

  /**
   * Set Twitter Card meta tags
   * @param {Object} options - Twitter Card options
   * @param {string} options.card - Card type (summary, summary_large_image, etc.)
   * @param {string} options.title - Card title
   * @param {string} options.description - Card description
   * @param {string} options.image - Card image URL
   * @param {string} options.imageAlt - Alt text for image
   * @param {string} options.creator - Twitter handle of content creator
   */
  setTwitterCard(options = {}) {
    const cardData = {
      card: options.card || 'summary_large_image',
      title: options.title || document.title,
      description: options.description || '',
      image: options.image || this.config.defaultImage,
      creator: options.creator || this.config.twitterHandle
    };

    this._setMetaTag('twitter:card', cardData.card, 'name');
    this._setMetaTag('twitter:title', cardData.title, 'name');
    this._setMetaTag('twitter:description', cardData.description, 'name');
    this._setMetaTag('twitter:image', cardData.image, 'name');
    
    if (options.imageAlt) {
      this._setMetaTag('twitter:image:alt', options.imageAlt, 'name');
    }
    
    if (cardData.creator) {
      const creatorHandle = cardData.creator.startsWith('@') ? cardData.creator : `@${cardData.creator}`;
      this._setMetaTag('twitter:creator', creatorHandle, 'name');
    }
    
    if (this.config.twitterHandle) {
      const siteHandle = this.config.twitterHandle.startsWith('@') ? 
        this.config.twitterHandle : `@${this.config.twitterHandle}`;
      this._setMetaTag('twitter:site', siteHandle, 'name');
    }
  }

  /**
   * Set Schema.org structured data (JSON-LD)
   * @param {Object|Array} schema - Schema.org object(s) or array of objects
   */
  setStructuredData(schema) {
    // Remove existing schema script if present
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Create new schema script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Create a Person schema for author information
   * @param {Object} options - Person schema options
   * @returns {Object} Person schema object
   */
  createPersonSchema(options = {}) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: options.name || this.config.author,
      url: options.url || this.config.siteUrl,
      image: options.image || this.config.defaultImage,
      jobTitle: options.jobTitle || '',
      description: options.description || '',
      sameAs: options.socialLinks || []
    };
  }

  /**
   * Create a WebSite schema
   * @param {Object} options - WebSite schema options
   * @returns {Object} WebSite schema object
   */
  createWebSiteSchema(options = {}) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: options.name || this.config.siteName,
      url: this.config.siteUrl,
      description: options.description || ''
    };

    // Add search action if provided
    if (options.searchUrl) {
      schema.potentialAction = {
        '@type': 'SearchAction',
        target: `${options.searchUrl}?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      };
    }

    return schema;
  }

  /**
   * Create an Article schema for blog posts
   * @param {Object} options - Article schema options
   * @returns {Object} Article schema object
   */
  createArticleSchema(options = {}) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: options.headline || options.title,
      description: options.description || '',
      image: options.image || this.config.defaultImage,
      author: {
        '@type': 'Person',
        name: options.author || this.config.author
      },
      publisher: {
        '@type': 'Organization',
        name: this.config.siteName,
        logo: {
          '@type': 'ImageObject',
          url: options.publisherLogo || this.config.defaultImage
        }
      },
      datePublished: options.datePublished || new Date().toISOString(),
      dateModified: options.dateModified || options.datePublished || new Date().toISOString()
    };

    // Optional properties
    if (options.url) {
      schema.url = options.url;
      schema.mainEntityOfPage = {
        '@type': 'WebPage',
        '@id': options.url
      };
    }

    if (options.keywords && Array.isArray(options.keywords)) {
      schema.keywords = options.keywords.join(', ');
    }

    if (options.wordCount) {
      schema.wordCount = options.wordCount;
    }

    return schema;
  }

  /**
   * Create a BreadcrumbList schema
   * @param {Array} breadcrumbs - Array of breadcrumb objects {name, url}
   * @returns {Object} BreadcrumbList schema object
   */
  createBreadcrumbSchema(breadcrumbs = []) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    };
  }

  /**
   * Set all meta tags for a page with a single configuration object
   * Convenience method that calls all relevant methods
   * @param {Object} config - Page meta configuration
   */
  setPageMeta(config = {}) {
    // Set title and description
    if (config.title) {
      this.setTitle(config.title, config.includeSiteName !== false);
    }
    if (config.description) {
      this.setDescription(config.description);
    }

    // Set canonical URL
    if (config.canonicalUrl) {
      this.setCanonicalURL(config.canonicalUrl);
    }

    // Set Open Graph
    if (config.openGraph) {
      this.setOpenGraph(config.openGraph);
    }

    // Set Twitter Card
    if (config.twitterCard) {
      this.setTwitterCard(config.twitterCard);
    }

    // Set structured data
    if (config.schema) {
      this.setStructuredData(config.schema);
    }
  }

  /**
   * Helper method to set or update a meta tag
   * @private
   * @param {string} key - Meta tag name or property
   * @param {string} value - Meta tag content
   * @param {string} attribute - Attribute type ('name' or 'property')
   * @param {boolean} replace - Whether to replace existing tag (default: true)
   */
  _setMetaTag(key, value, attribute = 'name', replace = true) {
    if (!value) return;

    const selector = `meta[${attribute}="${key}"]`;
    let metaTag = document.querySelector(selector);

    if (metaTag && replace) {
      // Update existing tag
      metaTag.setAttribute('content', value);
    } else if (!metaTag) {
      // Create new tag
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, key);
      metaTag.setAttribute('content', value);
      document.head.appendChild(metaTag);
    } else if (!replace) {
      // Add another tag with same key (for multiple values like article:tag)
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, key);
      metaTag.setAttribute('content', value);
      document.head.appendChild(metaTag);
    }
  }

  /**
   * Remove all dynamically created meta tags (useful for cleanup)
   */
  clearDynamicMeta() {
    // Remove OG tags
    document.querySelectorAll('meta[property^="og:"]').forEach(tag => tag.remove());
    
    // Remove Twitter tags
    document.querySelectorAll('meta[name^="twitter:"]').forEach(tag => tag.remove());
    
    // Remove article tags
    document.querySelectorAll('meta[property^="article:"]').forEach(tag => tag.remove());
    
    // Remove canonical link
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.remove();
    
    // Remove structured data
    const schema = document.querySelector('script[type="application/ld+json"]');
    if (schema) schema.remove();
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MetaManager;
} else if (typeof window !== 'undefined') {
  window.MetaManager = MetaManager;
}
