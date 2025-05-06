import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default class AddStoryView {
  getTemplate() {
    return `
      <section>
        <h2>Tambah Story</h2>
        <div id="camera-container" style="margin-bottom:1rem;">
          <video id="camera-preview" autoplay style="width:100%;max-width:400px;"></video>
          <button type="button" id="capture-btn">Ambil Foto</button>
        </div>
        <div id="map" style="height:400px;margin-bottom:1rem;"></div>
        <form id="add-story-form">
          <div>
            <label for="description">Deskripsi:</label>
            <textarea id="description" name="description" rows="2" style="width:100%;"></textarea>
          </div>
          <div>
            <label for="lat">Latitude:</label>
            <input id="lat" name="lat" type="text" />
          </div>
          <div>
            <label for="lon">Longitude:</label>
            <input id="lon" name="lon" type="text" />
          </div>
          <div>
            <label for="photo">Foto (jika tidak pakai kamera):</label>
            <input id="photo" name="photo" type="file" accept="image/*" />
          </div>
          <button type="submit">Kirim</button>
        </form>

        <!-- Daftar story offline -->
        <section style="margin-top:2rem;">
          <h3>Stories Tersimpan Offline</h3>
          <div id="offline-stories"></div>
        </section>
      </section>
    `;
  }

  bindMapClick(handler) {
    const map = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    let marker;
    map.on("click", (e) => {
      if (marker) marker.remove();
      marker = L.marker(e.latlng).addTo(map);
      const { lat, lng } = e.latlng;
      document.querySelector("[name=lat]").value = lat;
      document.querySelector("[name=lon]").value = lng;
      handler({ lat, lon: lng });
    });
  }

  bindCapture(handler) {
    const btn = document.getElementById("capture-btn");
    btn.addEventListener("click", handler);
  }

  bindSubmit(handler) {
    const form = document.getElementById("add-story-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handler({
        description: form.description.value,
        photo: form.photo.files[0],
        lat: form.lat.value ? Number(form.lat.value) : null,
        lon: form.lon.value ? Number(form.lon.value) : null
      });
    });
  }


  renderOfflineStories(items) {
    const container = document.getElementById("offline-stories");
    if (!items || items.length === 0) {
      container.innerHTML = "<p>Tidak ada story tersimpan offline.</p>";
      return;
    }
    container.innerHTML = items.map(item => `
      <div class="offline-item" style="border:1px solid #ddd; padding:0.5rem; margin-bottom:0.5rem;">
        <p><strong>ID:</strong> ${item.id}</p>
        <p><strong>Deskripsi:</strong> ${item.description}</p>
        <p><strong>Koordinat:</strong> ${item.lat}, ${item.lon}</p>
        <button data-id="${item.id}" class="delete-offline">Hapus Offline</button>
      </div>
    `).join("");
  }

  bindDeleteOffline(handler) {
    document.querySelectorAll("#offline-stories .delete-offline").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        handler(id);
      });
    });
  }

  showMessage(msg) {
    alert(msg);
  }

  redirectToHome() {
    window.location.hash = "/";
  }
}
