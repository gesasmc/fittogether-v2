const CACHE='zinkplan-v22';
const ASSETS=['./','./index.html','./app.js?v=2.2','./zinkplan-v22.webmanifest','./zinkplan-icon-192-v22.png','./zinkplan-apple-180-v22.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(resp=>{const clone=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));return resp;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));});