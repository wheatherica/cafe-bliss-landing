const CACHE_NAME = 'cafe-bliss-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/script.js',
  '/menu.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollTrigger.min.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback for images
        if (event.request.destination === 'image') {
          return caches.match('/offline-image.svg');
        }
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  const db = await openDB();
  const tx = db.transaction('pendingSubmissions', 'readonly');
  const store = tx.objectStore('pendingSubmissions');
  const submissions = await store.getAll();

  for (const submission of submissions) {
    try {
      // In a real app, this would send to a server
      console.log('Syncing submission:', submission);
      // Delete after successful sync
      const deleteTx = db.transaction('pendingSubmissions', 'readwrite');
      await deleteTx.objectStore('pendingSubmissions').delete(submission.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

// Push notification handler
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New offer available!',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=cafebliss&size=192',
    badge: 'https://api.dicebear.com/7.x/shapes/svg?seed=cafebliss&size=72',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Menu',
        icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=menu&size=24'
      },
      {
        action: 'close',
        title: 'Close',
        icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=close&size=24'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Café Bliss', options)
  );
});