(function () {
    var link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/assets/frappe_pwa/manifest/manifest.json';
    document.head.appendChild(link);
    console.log("Manifest loaded");

    // Register the service worker only if it's supported by the browser
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Register the service worker
            navigator.serviceWorker.register('/assets/frappe_pwa/js/service-worker.js', {
                scope: '/'  // Ensures the service worker controls the entire site
            })
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
        });
    } else {
        console.log("Service Worker not supported in this browser.");
    }
})();
