import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default class DetailView {
  getTemplate() {
    return `
      <section id="detail-page" class="detail-story">
        <h2>Memuat detail...</h2>
      </section>
    `;
  }

  renderDetail(story) {
    const container = document.getElementById('detail-page');
    container.innerHTML = `
      <a href="#/" style="display:block; margin-bottom:1rem;">← Kembali ke Home</a>
      <h2>Story by ${story.name}</h2>
      <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
      <img
        src="${story.photoUrl}"
        alt="${story.description}"
        style="max-width:100%; margin:1rem 0;"
      />
      <p>${story.description}</p>

      <!-- tombol bookmark baru -->
      <button id="btn-favorite" style="padding:0.5rem 1rem; margin-bottom:1rem;">
        Bookmark
      </button>

      <div id="map-detail" style="height:300px; margin-top:1rem;"></div>
    `;
  }

  initMap(lat, lon) {
    const el = document.getElementById('map-detail');
    el.innerHTML = ''; // kosongkan dulu
    const map = L.map('map-detail').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([lat, lon]).addTo(map);
  }

  showError(msg) {
    document.getElementById('detail-page').innerHTML =
      `<p style="color:red;">${msg}</p>`;
  }
}
