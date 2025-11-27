# Development Guide

## Cache Management

### Problem
When you make CSS/JS changes, browsers and service workers cache old versions, so users don't see updates immediately.

### Solutions

#### 1. **Version Bumping** (Recommended for Production)
Every time you make changes, update the version in:

**Service Worker** (`service-worker.js`):
```javascript
const CACHE_NAME = 'cool-mj-v1.0.7'; // Change to v1.0.8, v1.0.9, etc.
```

**HTML Files** (update `?v=` parameter):
```html
<link rel="stylesheet" href="../css/pages/blog.css?v=1.0.7">
<script src="../js/blog-init.js?v=1.0.7"></script>
```

#### 2. **Development Server Cache Control**
When testing locally, always use **Hard Refresh**:
- **Windows**: `Ctrl + F5` or `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

Or open **Incognito/Private Window** to bypass cache completely.

#### 3. **Disable Service Worker During Development**
In browser DevTools:
1. Open **Application** tab
2. Go to **Service Workers**
3. Check **"Update on reload"**
4. Or click **Unregister** to remove it temporarily

#### 4. **Clear Cache Manually**
- **Chrome/Edge**: Settings → Privacy → Clear browsing data → Cached images and files
- **Firefox**: Settings → Privacy & Security → Clear Data → Cached Web Content

### Best Practice
**Before pushing to GitHub:**
1. Bump version in `service-worker.js`
2. Update all `?v=` parameters in HTML files
3. Test in incognito window
4. Commit and push

This ensures all users get the latest version automatically!

## How Cache Updates Work for Users

### Automatic Update Process
When you push a new version (e.g., v1.0.7), existing users with cached versions (v1.0.6) will automatically get updates:

1. **User visits your site** with old cache (v1.0.6)
2. **Browser checks** for new service worker file
3. **Detects change:** `CACHE_NAME = 'cool-mj-v1.0.7'` (was v1.0.6)
4. **Service worker updates automatically:**
   - Installs new service worker
   - Downloads fresh files (CSS, JS, HTML)
   - Deletes old cache (v1.0.6)
   - Activates new cache (v1.0.7)
5. **User gets updated website** - typically on **next page load** or refresh

### User Update Timeline

| Scenario | When They Get Updates |
|----------|----------------------|
| **First visit after push** | Next refresh or page navigation |
| **Have site open** | Close & reopen, or hard refresh (Ctrl+F5) |
| **Next day** | Automatically on any visit |
| **Worst case** | Within 24 hours (browsers check SW updates regularly) |

### Mobile Users Experience
- Open your site → sees old version
- **Close tab and reopen** → ✅ New version
- Or just navigate to another page → ✅ New version

### Desktop Users Experience
- Refresh (F5) → ✅ New version immediately
- Or close/reopen browser → ✅ New version

### Why It's Automatic
The service worker's `activate` event automatically deletes old caches:
```javascript
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Old cache deleted automatically
          }
        })
      );
    })
  );
});
```

### Additional Safety: Version Parameters
The `?v=1.0.7` parameters on blog.html force fresh downloads even if service worker is slow to update:
```html
<link rel="stylesheet" href="../css/pages/blog.css?v=1.0.7">
<script src="../js/blog-init.js?v=1.0.7"></script>
```

### Testing After Push
1. Visit your GitHub Pages site
2. Open DevTools → Application → Service Workers
3. Click **"Update"** button
4. Refresh page
5. Verify new version in Network tab

**Bottom Line:** Version bumping ensures all users get updates automatically within 24 hours, usually immediately on next page load.

## Local Testing

### Start Server
```bash
python -m http.server 8000
```

### Access Site
- Blog: `http://localhost:8000/pages/blog.html`
- Home: `http://localhost:8000/index.html`

### Force Refresh
Always use `Ctrl + F5` after making changes!
