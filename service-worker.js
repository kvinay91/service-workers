// service worker is the event driven - it is not work of random code
const CACHE_NAME = "demo/v2";
const CACHE_FILES = ["./index.html", "./style.css", "./app.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener("activate", (e) => {
  //Clean to the useless cache
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key != CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  /*
    offline experience 
    whenever file is requested
    Good Way  
    1. fetch from the network and update my cache.
    2.cache is the fallback
    ! - Bad way 
    1. check the cache, and retuen from the cache
    2. if not available ,fetch from the network 
    */
  if (e.request.url.startsWith("http")) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const cloneData = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, cloneData);
          });
          console.log("Returning from the network");
          return res;
        })
        .catch(() => {
          console.log("Returning from cache");
          return caches.match(e.request).then((file) => file);
        })
    );
  } else {
    // If the request scheme is not supported, just fetch the request without caching
    e.respondWith(fetch(e.request));
  }
});
