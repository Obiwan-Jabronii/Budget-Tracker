const APP_PREFIX = 'my-site-cache-';
const VERSION = 'v1';
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE_NAME = 'data-cache-' + VERSION;

const FILES_TO_CACHE = [
  "/",
  "./index.html",
  "./css/styles.css",
  "./js/idb.js",
  "./js/index.js",
  "./manifest.json",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-128x128.png",
  "./icons/icon-144x144.png",
  "./icons/icon-152x152.png",
  "./icons/icon-192x192.png",
  "./icons/icon-384x384.png",
  "./icons/icon-512x512.png"

];

self.addEventListener('fetch', (event) => {
    if(event.request.url.includes('/api/')) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                .then(response => {
                    if(response.ok) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(event.request);
                })
            })
            .catch(err => console.log(err))
        );
        return;
    }
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then((respnse) => {
                if(response) {
                    return response;
                } else if(event.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/")
                }
            });
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keylist) => {
            let cacheKeeplist = keylist.filter((key) => {
                return key.indexOf(APP_PREFIX);
            })
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(keylist.map((key,i) => {
                if(cacheKeeplist,indexOf(key) === -1) {
                    console.log('deleting cache: ' + keylist[i]);
                    return caches.delete(keylist[i]);
                }
            }));
        })
    )
})