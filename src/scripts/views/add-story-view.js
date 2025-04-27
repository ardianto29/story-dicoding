import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default class AddStoryView {
  getTemplate() {
    return `
        <section>
      <h2>Tambah Story</h2>
      <div id="map" style="height: 400px; margin-bottom: 1rem;"></div>

      <form id="add-story-form">
        <div>
          <label for="description">Deskripsi:</label>
          <textarea id="description" name="description" rows="2" style="width: 100%;"></textarea>
        </div>
        <div>
          <label for="lat">Latitude:</label>
          <input type="text" id="lat" name="lat" readonly style="width: 150px;" />
        </div>
        <div>
          <label for="lon">Longitude:</label>
          <input type="text" id="lon" name="lon" readonly style="width: 150px;" />
        </div>
        <div>
          <label for="photo">Foto:</label>
          <input type="file" id="photo" name="photo" accept="image/*" />
        </div>
        <button type="submit">Kirim</button>
      </form>
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

  showMessage(msg) {
    alert(msg);
  }

  redirectToHome() {
    window.location.hash = "/";
  }
}
  