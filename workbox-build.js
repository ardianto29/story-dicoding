import { generateSW } from 'workbox-build';

const { count, size } = await generateSW({
  globDirectory: 'dist',
  globPatterns: [
    '**/*.{html,js,css,png,svg,webmanifest}'
  ],
  swDest: 'dist/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // SPA navigation (refresh/direct URL)
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-cache',
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 10, maxAgeSeconds: 24 * 60 * 60 }
      }
    },
    {
      // Static resources (JS/CSS)
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: { maxEntries: 50 }
      }
    },
    {
      // Images
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }
      }
    },
    {
      // API calls
      urlPattern: new RegExp('https://story-api\\.dicoding\\.dev/v1/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 30, maxAgeSeconds: 5 * 60 }
      }
    }
  ]
});

console.log(`✅ Workbox: precached ${count} files, totaling ${size} bytes`);
