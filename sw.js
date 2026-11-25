const V="overkill-14656f1f";
const FILES=["./","index.html","manifest.webmanifest","src/style.css","src/core.js","src/labels.js","src/app.js","src/algebra.js","src/decimal.js","src/matrix.js","src/graph.js","src/tools.js","src/stats.js","src/symbolic.js","src/polynomial.js","src/notebook.js","src/academy-data.js","src/academy-lessons.js","src/academy.js","src/help.js","src/experience.js","MANUAL.md","src/pwa.js","fonts/metal-mania-latin.woff2","fonts/metal-mania-latin-ext.woff2","icons/icon-192.png","icons/icon-512.png","icons/icon-180.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}
    return r;
  }).catch(()=>caches.match(e.request).then(m=>{
    if(m)return m;
    // Só páginas de navegação recebem o HTML de reserva; arquivos estáticos recebem erro de rede
    if(e.request.mode==="navigate")return caches.match("index.html");
    return Response.error();
  })));
});
