// Guarda el juego en el celular para que funcione aunque no haya internet.
const CACHE="tablas-v19";
const FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","favicon-64.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  // Primero intenta internet (para recibir actualizaciones); si no hay, usa la copia guardada.
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();if(r.ok&&new URL(e.request.url).origin===location.origin)caches.open(CACHE).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));
});
