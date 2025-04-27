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

  showMessage(msg) {
    alert(msg);
  }

  redirectToHome() {
    window.location.hash = "/";
  }
}
