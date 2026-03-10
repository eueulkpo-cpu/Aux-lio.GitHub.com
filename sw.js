const CACHE_NAME = "aim-engine-v1"

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/engine.js",
  "/enginebundle.js",
  "/style.css",
  "/manifest.json"
]

// instala o service worker
self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE)
    })
  )

  self.skipWaiting()

})

// ativa o cache
self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )

  self.clients.claim()

})

// estratégia de cache inteligente
self.addEventListener("fetch", (event) => {

  event.respondWith(

    caches.match(event.request).then((cached) => {

      if (cached) {
        return cached
      }

      return fetch(event.request).then((response) => {

        return caches.open(CACHE_NAME).then((cache) => {

          cache.put(event.request, response.clone())

          return response

        })

      })

    })

  )

})