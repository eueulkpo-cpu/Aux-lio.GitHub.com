const CACHE_NAME = "engine-cache-v1"

const FILES = [
"/",
"/index.html",
"/manifest.json",
"/JS/engine.js",
"/JS/engineBundle.js",
"/JS/script.js",
"/JS/sw.js",
"/JS/engine.cpp"

]

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => cache.addAll(FILES))

)

})

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys => {

return Promise.all(

keys.map(key => {

if (key !== CACHE_NAME) {

return caches.delete(key)

}

})

)

})

)

})

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)
.then(response => {

return response || fetch(event.request)

})

)

})