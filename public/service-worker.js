var doCache = true;
var CACHE_NAME = 'InterfaceBuilder-v1';

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(keyList =>
                Promise.all(keyList.map(key => {
                    if (!cacheWhitelist.includes(key)) {
                        console.log('Deleting cache: ' + key);
                        return caches.delete(key);
                    }
                }))
            )
    );
});

self.addEventListener('install', function (event) {
    if (doCache) {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function (cache) {
                    fetch('manifest.json')
                        .then(response => {
                            response.json();
                        })
                        .then(assets => {
                            const urlsToCache = [
                                'favicon.ico',
                                'manifest.json',
                                'android-chrome-192x192.png',
                                'android-chrome-512x512.png',
                                'maskable_icon.png',
                                'apple-touch-icon.png',
                                'favicon-16x16.png',
                                'favicon-32x32.png',
                                'safari-pinned-tab.svg',
                                'mstile-150x150.png',
                                'browserconfig.xml',
                                'logo.svg',
                                'wave.svg',
                                'service-worker.js',
                                'icons.woff',
                                'icons.woff2',
                                'icons.css',
                                'theme.css',
                                'app.css',
                                'app.js',
                                'main.js',
                                '../v1/app'
                            ];
                            cache.addAll(urlsToCache);
                            console.log('cached');
                        })
                })
        );
    }
});

self.addEventListener('fetch', function (event) {
    if (doCache) {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request);
            })
        );
    }
});
