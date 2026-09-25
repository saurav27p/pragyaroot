const CACHE = "pragyaroot-v1";

const ASSETS = [
  "/pragyaroot/",
  "/pragyaroot/index.html",
  "/pragyaroot/assets/css/shared.css",
  "/pragyaroot/assets/js/shared.js",
  "/pragyaroot/components/header.html",
  "/pragyaroot/components/sidebar.html",
  "/pragyaroot/components/drawer.html",
  "/pragyaroot/components/search.html",
  "/pragyaroot/components/footer.html",
  "/pragyaroot/components/back-to-top.html"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE).then(function(cache){
      return cache.addAll(ASSETS);
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(key){ return key !== CACHE; })
            .map(function(key){ return caches.delete(key); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event){
  if(event.request.method !== "GET") return;
  if(!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(function(cached){
      const network = fetch(event.request).then(function(response){
        if(response && response.status === 200 && response.type === "basic"){
          const copy = response.clone();
          caches.open(CACHE).then(function(cache){
            cache.put(event.request, copy);
          });
        }
        return response;
      }).catch(function(){
        return cached;
      });
      return cached || network;
    })
  );
});
