const CACHE_NAME = 'baracho-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/script.js',
  '/images/BARACHO.png',
  '/images/banner.png',
  '/images/sobre.jpg',
  '/images/projetos/serviço de solda e caldeira.jpg',
  '/images/projetos/serviço de solda e caldeira 2.jpg',
  '/images/projetos/pintura industrial.jpg',
  '/images/projetos/pintura industrial 2.jpg',
  '/images/projetos/alphinismo 1.jpg',
  '/images/projetos/alphinismo 2.jpg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Instalar service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retornar cache se disponível
        if (response) {
          return response;
        }
        
        // Fazer requisição para rede
        return fetch(event.request)
          .then(response => {
            // Verificar se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar a resposta
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
  );
});

// Atualizar cache quando nova versão estiver disponível
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Notificações push (para futuras implementações)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nova mensagem da Baracho',
    icon: '/images/BARACHO.png',
    badge: '/images/BARACHO.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver mais',
        icon: '/images/BARACHO.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/images/BARACHO.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Baracho Soluções', options)
  );
});

// Responder a cliques em notificações
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 