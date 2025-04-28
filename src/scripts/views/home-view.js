// src/scripts/views/home-view.js
import L from "leaflet";

export default class HomeView {
  getTemplate() {
    return `
      <section class="home">
        <h2>Home Page</h2>
        <button id="btn-subscribe">Aktifkan Notifikasi</button>
        <button id="btn-unsubscribe">Nonaktifkan Notifikasi</button>
        <div id="map" style="width:100%;height:300px;margin-bottom:1rem;"></div>
        <div id="stories-list"></div>
      </section>
    `;
  }

  bindSubscribe(handler) {
    const btn = document.getElementById("btn-subscribe");
    if (btn) btn.addEventListener("click", handler);
  }

  bindUnsubscribe(handler) {
    const btn = document.getElementById("btn-unsubscribe");
    if (btn) btn.addEventListener("click", handler);
  }

  showStories(stories) {
    const container = document.getElementById("stories-list");
    if (!stories || stories.length === 0) {
      container.innerHTML = "<p>Tidak ada story untuk ditampilkan.</p>";
      return;
    }
    container.innerHTML = stories
      .map(
        (story) => `
      <article class="story-item">
        <img src="${story.photoUrl}" alt="${story.description}" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
      </article>
    `
      )
      .join("");
  }

  initMap(stories) {
    // 1) Definisikan dua tile layer
    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors"
      }
    );
    const topo = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenTopoMap contributors"
      }
    );

    // 2) Inisialisasi map dengan OSM default dan custom zoom posisi
    const map = L.map("map", {
      center: [0, 0],
      zoom: 2,
      layers: [osm],
      zoomControl: false
    });

    // pindahkan control zoom ke pojok kiri atas
    L.control.zoom({ position: "topleft" }).addTo(map);

    // 3) Tambahkan layer control (switcher)
    L.control
      .layers({ OpenStreetMap: osm, Topographic: topo }, null, {
        collapsed: false,
        position: "topright"
      })
      .addTo(map);

    // 4) Tambahkan marker untuk setiap story dengan lat/lon
    const markers = stories
      .filter((s) => s.lat != null && s.lon != null)
      .map((s) => {
        const marker = L.marker([s.lat, s.lon]).addTo(map);
        const popupContent = `
          <div class="popup-story" style="text-align:center;">
            <h3>${s.name}</h3>
            <p><small>${new Date(s.createdAt).toLocaleString()}</small></p>
            <img 
              src="${s.photoUrl}" 
              alt="${s.description}" 
              style="width:100%;max-width:200px;margin:5px auto;display:block;"
            />
            <p>${s.description}</p>
            <a href="#/detail/${s.id}">Lihat detail</a>
          </div>
        `;
        marker.bindPopup(popupContent, { maxWidth: 220 });
        return marker;
      });

    // 5) Fit bounds jika ada marker
    if (markers.length) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.5));
    }
  }

  showMessage(message) {
    alert(message);
  }
}
