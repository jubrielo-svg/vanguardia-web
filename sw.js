self.addEventListener('install', (e) => {
  console.log('[Vanguardia] Service Worker Instalado');
});

self.addEventListener('fetch', (e) => {
  // PWA básica (pasa las peticiones directo a la red)
});