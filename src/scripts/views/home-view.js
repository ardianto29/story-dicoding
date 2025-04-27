// src/scripts/views/home-view.js
import L from 'leaflet';

export default class HomeView {
  getTemplate() {
    return `
      <section class="home">
        <h2>Home Page</h2>
        <div id="map" style="height: 300px; margin-bottom: 1rem;"></div>
        <div id="stories-list" class="stories-list"></div>
      </section>
    `;
  }

  showStories(stories) {
    const container = document.getElementById('stories-list');
    if (!stories || stories.length === 0) {
      container.innerHTML = '<p>Tidak ada story untuk ditampilkan.</p>';
      return;
    }
    container.innerHTML = stories.map(story => `
      <article class="story-item">
        <img src="${story.photoUrl}" alt="${story.description}" width="200" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
      </article>
    `).join('');
  }

  initMap(stories) {
    // Inisialisasi peta
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const markers = [];

    stories.forEach(story => {
      if (story.lat != null && story.lon != null) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);

        // Konten popup
        const popupContent = `
          <div class="popup-story" style="text-align:center;">
            <h3>${story.name}</h3>
            <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
            <img 
              src="${story.photoUrl}" 
              alt="${story.description}" 
              style="width:100%;max-width:200px;margin:5px auto;display:block;"
            />
            <p>${story.description}</p>
           <a href="#/detail/${story.id}">Lihat detail</a>
          </div>
        `;
        marker.bindPopup(popupContent, { maxWidth: 220 });

        markers.push(marker);
      }
    });

    if (markers.length) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.5));
    }
  }
}
