// public/sw.js
self.addEventListener('push', event => {
    let data = { title: 'Story Dicoding', options: {} };
    if (event.data) {
      data = event.data.json();
    }
    const { title, options } = data;
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  