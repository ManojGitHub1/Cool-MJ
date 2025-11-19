/**
 * Meta Configuration for Portfolio Website
 * 
 * Contains page-specific meta tag configurations for SEO and social media sharing.
 * Used by MetaManager to dynamically set meta tags on each page.
 * 
 * @version 1.0.0
 * @author Manoj Jivanagi
 */

// Global site configuration
const SITE_CONFIG = {
  siteName: 'Manoj Jivanagi',
  siteUrl: 'https://manojgithub1.github.io/Cool-MJ', // Update with your actual GitHub Pages URL
  author: 'Manoj Jivanagi',
  twitterHandle: '', // Add your Twitter handle (without @) if you have one
  defaultImage: '/Cool-MJ/images/og-default.jpg', // Update with actual OG image path
  locale: 'en_US'
};

// Social media links for Person schema
const SOCIAL_LINKS = [
  'https://github.com/ManojGitHub1',
  'https://linkedin.com/in/manoj-jivanagi', // Update with your actual LinkedIn URL
  // Add more social media profiles here
];

/**
 * Home Page Meta Configuration
 */
const HOME_META = {
  title: 'Manoj Jivanagi - Full Stack Developer & Tech Enthusiast',
  description: 'Welcome to my portfolio! I\'m a passionate full-stack developer specializing in modern web technologies, cloud solutions, and innovative software development. Explore my projects, blog, and developer journey.',
  keywords: ['Manoj Jivanagi', 'Full Stack Developer', 'Web Developer', 'Portfolio', 'Software Engineer', 'Cloud Developer'],
  
  openGraph: {
    title: 'Manoj Jivanagi - Full Stack Developer',
    description: 'Passionate full-stack developer specializing in modern web technologies and cloud solutions.',
    image: `${SITE_CONFIG.siteUrl}/images/og-home.jpg`, // Update with actual image
    type: 'website',
    url: `${SITE_CONFIG.siteUrl}/index.html`
  },
  
  twitterCard: {
    card: 'summary_large_image',
    title: 'Manoj Jivanagi - Full Stack Developer',
    description: 'Passionate full-stack developer specializing in modern web technologies and cloud solutions.',
    image: `${SITE_CONFIG.siteUrl}/images/og-home.jpg` // Update with actual image
  },
  
  schema: [
    // Person Schema
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Manoj Jivanagi',
      url: SITE_CONFIG.siteUrl,
      image: `${SITE_CONFIG.siteUrl}/images/profile.jpg`, // Update with actual image
      jobTitle: 'Full Stack Developer',
      description: 'Passionate full-stack developer specializing in modern web technologies and cloud solutions.',
      sameAs: SOCIAL_LINKS
    },
    // WebSite Schema
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Manoj Jivanagi Portfolio',
      url: SITE_CONFIG.siteUrl,
      description: 'Portfolio website showcasing projects, blog posts, and technical expertise of Manoj Jivanagi.',
      author: {
        '@type': 'Person',
        name: 'Manoj Jivanagi'
      }
    }
  ]
};

/**
 * Developer Zone Page Meta Configuration
 */
const DEVELOPER_META = {
  title: 'Developer Zone - Skills & Tech Stack',
  description: 'Explore my technical skills, programming languages, frameworks, and technologies. Discover the tools and technologies I use to build modern web applications and cloud solutions.',
  keywords: ['Skills', 'Tech Stack', 'Programming', 'Web Development', 'Cloud Technologies', 'Certifications'],
  
  openGraph: {
    title: 'Developer Zone - Manoj Jivanagi',
    description: 'Explore my technical skills, programming languages, frameworks, and certifications.',
    image: `${SITE_CONFIG.siteUrl}/images/og-developer.jpg`,
    type: 'website',
    url: `${SITE_CONFIG.siteUrl}/pages/developer.html`
  },
  
  twitterCard: {
    card: 'summary',
    title: 'Developer Zone - Manoj Jivanagi',
    description: 'Explore my technical skills, programming languages, frameworks, and certifications.',
    image: `${SITE_CONFIG.siteUrl}/images/og-developer.jpg`
  },
  
  schema: {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'Developer Zone',
    description: 'Technical skills and expertise of Manoj Jivanagi',
    mainEntity: {
      '@type': 'Person',
      name: 'Manoj Jivanagi',
      jobTitle: 'Full Stack Developer',
      knowsAbout: ['Web Development', 'Cloud Computing', 'JavaScript', 'Python', 'React', 'Node.js']
    }
  }
};

/**
 * Projects Page Meta Configuration
 */
const PROJECTS_META = {
  title: 'Projects - Portfolio Showcase',
  description: 'Browse through my portfolio of web development projects, cloud solutions, and software applications. See the innovative solutions I\'ve built using modern technologies.',
  keywords: ['Projects', 'Portfolio', 'Web Applications', 'Software Development', 'Case Studies'],
  
  openGraph: {
    title: 'Projects - Manoj Jivanagi',
    description: 'Browse through my portfolio of web development projects and innovative solutions.',
    image: `${SITE_CONFIG.siteUrl}/images/og-projects.jpg`,
    type: 'website',
    url: `${SITE_CONFIG.siteUrl}/pages/projects.html`
  },
  
  twitterCard: {
    card: 'summary_large_image',
    title: 'Projects - Manoj Jivanagi',
    description: 'Browse through my portfolio of web development projects and innovative solutions.',
    image: `${SITE_CONFIG.siteUrl}/images/og-projects.jpg`
  },
  
  schema: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects Portfolio',
    description: 'Collection of web development projects by Manoj Jivanagi',
    author: {
      '@type': 'Person',
      name: 'Manoj Jivanagi'
    }
  }
};

/**
 * About Page Meta Configuration
 */
const ABOUT_META = {
  title: 'About Me - Background & Journey',
  description: 'Learn more about my journey as a developer, my background, education, and what drives my passion for technology and software development.',
  keywords: ['About', 'Biography', 'Background', 'Education', 'Developer Journey', 'Career'],
  
  openGraph: {
    title: 'About Manoj Jivanagi',
    description: 'Learn more about my journey as a developer and what drives my passion for technology.',
    image: `${SITE_CONFIG.siteUrl}/images/og-about.jpg`,
    type: 'profile',
    url: `${SITE_CONFIG.siteUrl}/pages/about.html`
  },
  
  twitterCard: {
    card: 'summary',
    title: 'About Manoj Jivanagi',
    description: 'Learn more about my journey as a developer and what drives my passion for technology.',
    image: `${SITE_CONFIG.siteUrl}/images/og-about.jpg`
  },
  
  schema: {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Me',
    description: 'Background and journey of Manoj Jivanagi as a full-stack developer',
    mainEntity: {
      '@type': 'Person',
      name: 'Manoj Jivanagi',
      url: SITE_CONFIG.siteUrl,
      sameAs: SOCIAL_LINKS
    }
  }
};

/**
 * Blog Page Meta Configuration
 */
const BLOG_META = {
  title: 'Blog - Tech Articles & Insights',
  description: 'Read my latest blog posts about web development, programming tutorials, tech insights, and software engineering best practices. Stay updated with the latest in technology.',
  keywords: ['Blog', 'Articles', 'Tech Blog', 'Programming', 'Web Development', 'Tutorials', 'Tech Insights'],
  
  openGraph: {
    title: 'Blog - Manoj Jivanagi',
    description: 'Read my latest blog posts about web development, programming tutorials, and tech insights.',
    image: `${SITE_CONFIG.siteUrl}/images/og-blog.jpg`,
    type: 'website',
    url: `${SITE_CONFIG.siteUrl}/pages/blog.html`
  },
  
  twitterCard: {
    card: 'summary_large_image',
    title: 'Blog - Manoj Jivanagi',
    description: 'Read my latest blog posts about web development, programming tutorials, and tech insights.',
    image: `${SITE_CONFIG.siteUrl}/images/og-blog.jpg`
  },
  
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Manoj Jivanagi\'s Tech Blog',
    description: 'Blog posts about web development, programming, and technology',
    author: {
      '@type': 'Person',
      name: 'Manoj Jivanagi',
      url: SITE_CONFIG.siteUrl
    },
    url: `${SITE_CONFIG.siteUrl}/pages/blog.html`
  }
};

/**
 * Get meta configuration for a specific page
 * @param {string} page - Page identifier (home, developer, projects, about, blog)
 * @returns {Object} Meta configuration object
 */
function getMetaConfig(page) {
  const configs = {
    home: HOME_META,
    developer: DEVELOPER_META,
    projects: PROJECTS_META,
    about: ABOUT_META,
    blog: BLOG_META
  };
  
  return configs[page] || HOME_META;
}

/**
 * Create Article schema for blog posts
 * @param {Object} post - Blog post object from blog-posts.json
 * @returns {Object} Article schema
 */
function createBlogPostSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      '@type': 'Person',
      name: post.author || SITE_CONFIG.author
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.siteUrl}/images/logo.png` // Update with actual logo
      }
    },
    datePublished: post.date,
    dateModified: post.dateModified || post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.siteUrl}/pages/blog.html?post=${post.slug}`
    },
    keywords: post.tags ? post.tags.join(', ') : '',
    articleSection: post.category || 'Technology'
  };
}

/**
 * Get Open Graph configuration for a blog post
 * @param {Object} post - Blog post object from blog-posts.json
 * @returns {Object} Open Graph configuration
 */
function getBlogPostOpenGraph(post) {
  return {
    title: post.title,
    description: post.excerpt,
    image: post.ogImage || post.image,
    imageAlt: post.imageAlt || post.title,
    url: `${SITE_CONFIG.siteUrl}/pages/blog.html?post=${post.slug}`,
    type: 'article',
    article: {
      publishedTime: post.date,
      modifiedTime: post.dateModified || post.date,
      author: post.author || SITE_CONFIG.author,
      tags: post.tags || []
    }
  };
}

/**
 * Get Twitter Card configuration for a blog post
 * @param {Object} post - Blog post object from blog-posts.json
 * @returns {Object} Twitter Card configuration
 */
function getBlogPostTwitterCard(post) {
  return {
    card: 'summary_large_image',
    title: post.title,
    description: post.excerpt,
    image: post.image,
    imageAlt: post.imageAlt || post.title
  };
}

// Export configurations
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SITE_CONFIG,
    SOCIAL_LINKS,
    getMetaConfig,
    createBlogPostSchema,
    getBlogPostOpenGraph,
    getBlogPostTwitterCard
  };
}
