/**
 * Service Worker for Cool-MJ Portfolio
 * Provides offline caching and PWA functionality
 * @version 1.0.3
 */

const CACHE_NAME = 'cool-mj-v1.0.3';

// Detect if running locally or on GitHub Pages
const isLocal = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
const basePath = isLocal ? '' : '/Cool-MJ';
const OFFLINE_PAGE = `${basePath}/offline.html`;

// Assets to cache on install (will be prefixed with basePath)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/pages/developer.html',
  '/pages/projects.html',
  '/pages/about.html',
  '/pages/blog.html',
  // CSS - shared and imported files
  '/css/shared.css',
  '/css/base/variables.css',
  '/css/base/reset.css',
  '/css/layout/header.css',
  '/css/layout/navigation.css',
  '/css/layout/footer.css',
  '/css/components/theme-toggle.css',
  '/css/components/music-widget.css',
  '/css/pages/home.css',
  '/css/pages/developer.css',
  '/css/pages/projects.css',
  '/css/pages/about.css',
  '/css/pages/blog.css',
  // JavaScript files
  '/js/script.js',
  '/js/pages.js',
  '/js/music.js',
  '/js/blog-renderer.js',
  '/js/blog-init.js',
  '/js/meta-manager.js',
  '/js/core/theme-manager.js',
  '/js/utils/dom.js',
  '/js/utils/storage.js',
  '/js/utils/validators.js',
  '/js/utils/logger.js',
  '/js/utils/analytics.js',
  '/js/config/constants.js',
  '/js/config/meta-config.js',
  // Images
  '/images/Manoj.png',
  '/images/favicon.ico',
  '/offline.html'
].map(path => `${basePath}${path}`);

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('[ServiceWorker] Install failed:', error);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

/**
 * Fetch event - serve from cache, fallback to network
 * Strategy: Cache-first for static assets, Network-first for HTML
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // HTML: Network-first strategy
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache the response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache, then offline page
          return caches.match(request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match(OFFLINE_PAGE);
            });
        })
    );
    return;
  }

  // Static assets (CSS, JS, images): Cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone and cache the response
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          })
          .catch((error) => {
            console.log('[ServiceWorker] Network request failed, asset not cached:', request.url);
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match(OFFLINE_PAGE);
            }
            // For other requests, return a basic error response instead of undefined
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

/**
 * Message event - handle cache updates
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
