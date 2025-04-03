const CACHE_NAME = 'pwa-cache-v1';
const assetsDirectory = '/assets/'; // Directory where all your static files reside

const urlsToMustCache = [
    '/',
    '/assets/frappe_pwa/js/main.js',
    '/assets/frappe_pwa/css/style.css',
];

self.addEventListener('install', (event) => {
    const assetsDirectory = '/assets'; // Specify the correct path to the assets directory
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Fetch the assets directory or an HTML page that lists your assets
            return fetch(assetsDirectory)
                .then((response) => response.text()) // Get the HTML content
                .then((html) => {
                    // Parse the HTML content
                    const parser = new DOMParser();
                    const document = parser.parseFromString(html, 'text/html');

                    // Collect URLs from 'link', 'script', and 'img' elements
                    const links = Array.from(document.querySelectorAll('link, script, img'));
                    const urlsToCache = links
                        .map((link) => {
                            // Ensure URLs are absolute or properly relative to root
                            return link.href || link.src;
                        })
                        .filter(Boolean); // Filter out empty or invalid URLs

                    // Combine these URLs with must-cache URLs
                    const finalUrls = Array.from(new Set([...urlsToCache, ...urlsToMustCache]));

                    console.log('All URLs to cache:', finalUrls);

                    // Add all the URLs to the cache
                    return cache.addAll(finalUrls);
                });
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});



// During activate, clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME]; // Only keep the current version of the cache

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // If the cache is not in the whitelist, delete it
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});