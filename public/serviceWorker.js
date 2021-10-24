const CACHE_FILES = [
    "/",
    "/index.html",
    "/assets/style.css",
    "/favicon.ico",    
    "/assets/images/Angular-icon.png",
    "/assets/images/React-icon.png",
    "/assets/images/Vue.js-icon.png",
    "/assets/images/icons/icon-72x72.png",
    "/assets/images/icons/icon-96x96.png",
    "/assets/images/icons/icon-128x128.png",
    "/assets/images/icons/icon-144x144.png",
    "/assets/images/icons/icon-152x152.png",
    "/assets/images/icons/icon-192x192.png",
    "/assets/images/icons/icon-384x384.png",
    "/assets/images/icons/icon-512x512.png",
    "/service-worker.js",
    "/assets/js/loadPosts.js"
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