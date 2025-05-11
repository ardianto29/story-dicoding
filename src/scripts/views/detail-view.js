import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { addBookmark } from "../utils/db.js";

export default class DetailView {
  constructor() {
    this._story = null; // untuk menyimpan data story saat render
  }

  getTemplate() {
    return `
      <section id="detail-page" class="detail-story">
        <h2>Memuat detail...</h2>
      </section>
    `;
  }

  /**
   * Render detail story, plus tombol bookmark
   */
  renderDetail(story) {
    this._story = story; // simpan untuk handler
    const container = document.getElementById("detail-page");
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

      <button id="bookmark-button" class="btn">Tambahkan ke Bookmark</button>

      <div id="map-detail" style="height:300px; margin-top:1rem;"></div>
    `;

    // Pasang handler bookmark setelah elemen dibuat
    const btn = document.getElementById("bookmark-button");
    btn.addEventListener("click", async () => {
      try {
        await addBookmark(this._story);
        alert("Berhasil menambahkan ke Bookmark");
      } catch (err) {
        console.error("Gagal bookmark:", err);
        alert("Gagal menambahkan ke Bookmark");
      }
    });
  }

  initMap(lat, lon) {
    const el = document.getElementById("map-detail");
    el.innerHTML = ""; // kosongkan dulu
    const map = L.map("map-detail").setView([lat, lon], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    L.marker([lat, lon]).addTo(map);
  }

  showError(msg) {
    document.getElementById(
      "detail-page"
    ).innerHTML = `<p style="color:red;">${msg}</p>`;
  }
}
