const CACHE_NAME="nst-quiz-pwa-v6";
const APP_SHELL=["./","./index.html","./manifest.webmanifest","./icon-180.png","./icon-192.png","./icon-512.png","./mascot/stage1.png","./mascot/stage2.png","./mascot/stage3.png","./mascot/stage4.png","./mascot/stage5.png","./mascot/stage6.png","./mascot/stage7.png"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).then(response=>{
      const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put("./index.html",copy));return response;
    }).catch(()=>caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response&&response.status===200&&response.type==="basic"){
      const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
    }
    return response;
  })));
});
