const CACHE_FILES = [
    "/",
    "/index.html",
    "/assets/styles.css",
    "/dist/index.bundle.js",
    "/dist/assets/icons/icon-192x192.png",
    "/dist/assets/icons/icon-512x512.png",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
    "/dist/manifest.webmanifest",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//install our cache files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(CACHE_FILES);
        })
    )

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if(key !== CACHE_NAME && key !== DATA_CACHE_NAME){
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
})

self.addEventListener("fetch", (event) => {
    if(event.request.url.includes("/api/")){
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                .then(response => {
                    if(response.status = 200){
                        cache.put(event.request.url, response.clone())
                    }

                    return response;
                })
                .catch(error => {
                    return cache.match(event.request);
                })
            }).catch(error => console.log(error))
        )

        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request)
        })
    )
})