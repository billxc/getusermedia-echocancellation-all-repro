// Minimal service worker so the page is installable as a PWA.
// (A registered fetch handler is required for installability; this one is a
// transparent pass-through so getUserMedia and everything else behave normally.)
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());
self.addEventListener('fetch', (e) => { /* pass-through */ });
