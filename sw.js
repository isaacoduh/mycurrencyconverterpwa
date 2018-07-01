const staticAssets = [
  '/',
  '/app.js',
];

self.addEventListener('install',async event => {
  const cache = await caches.open('converter-static');
  cache.addAll(staticAssets);
});

self.addEventListener('fetch',event => {
  const req = event.request;
  const url = new URL(req.url);

  if(url.origin === location.origin){
    event.respondWith(cacheFirst(req));
  }else{
    event.respondWith(networkFirst(req));
  }

  event.respondWith(cacheFirst(req));
});

async function cacheFirst(req){
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req){
  const cache = await caches.open('converter-static');
  try{
    const res = await fetch(req);
    cache.put(req,res.clone());
    return res;
  }catch(error){
    const cachedResponse = await cache.match(req);
    // return cachedResponse || await caches.match()
  }
}
