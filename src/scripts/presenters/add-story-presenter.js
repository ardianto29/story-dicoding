import { getToken } from "../utils/index.js";
import { addNewStory } from "../data/api.js";
import {
  saveStoryOffline,
  getAllStoriesOffline,
  deleteStoryOffline
} from "../index.js";

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.stream = null; // untuk menyimpan MediaStream
    this.photoBlob = null; // untuk menyimpan hasil capture
  }

  async init() {
    // 1) Bind klik peta & submit form
    this.view.bindMapClick(this._onMapClick.bind(this));
    this.view.bindSubmit(this._onSubmit.bind(this));

    // 2) Inisialisasi kamera & bind tombol capture
    await this._initCamera();
    this.view.bindCapture(this._onCapture.bind(this));

    // 3) Pastikan stream dihentikan saat pindah halaman
    window.addEventListener("hashchange", () => {
      if (this.stream) {
        this.stream.getTracks().forEach((t) => t.stop());
        this.stream = null;
      }
    });

    // 4) Muat dan tampilkan daftar story yang tersimpan offline
    await this._loadOfflineStories();
  }

  // Mengakses kamera dan menampilkan preview di <video id="camera-preview">
  async _initCamera() {
    const video = document.getElementById("camera-preview");
    if (!video || !navigator.mediaDevices) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.stream;
      video.play();
    } catch (err) {
      console.error("Gagal akses kamera:", err);
      this.view.showMessage("Tidak dapat mengakses kamera");
    }
  }

  // Menangkap gambar, menghentikan stream, dan menyimpan blob
  _onCapture() {
    const video = document.getElementById("camera-preview");
    const container = document.getElementById("camera-container");
    if (!video) return;

    // 1) Render frame video ke canvas
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    // 2) Stop semua track kamera
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;

    // 3) Sembunyikan video, tampilkan canvas
    video.style.display = "none";
    container.appendChild(canvas);

    // 4) Simpan hasil capture sebagai Blob
    canvas.toBlob(
      (blob) => {
        this.photoBlob = blob;
        this.view.showMessage("Foto berhasil diambil");
      },
      "image/jpeg",
      0.9
    );
  }

  // Handler klik peta: dapatkan koordinat
  _onMapClick({ lat, lon }) {
    this.selectedLat = lat;
    this.selectedLon = lon;
  }

  // Muat semua story yang tersimpan offline, kirim ke view, dan bind delete
  async _loadOfflineStories() {
    const items = await getAllStoriesOffline();
    this.view.renderOfflineStories(items);
    this.view.bindDeleteOffline(async (id) => {
      await deleteStoryOffline(id);
      await this._loadOfflineStories();
    });
  }

  // Submit story ke API atau fallback ke IndexedDB saat offline
  async _onSubmit({ description, photo, lat, lon }) {
    // utamakan foto dari kamera jika sudah capture
    const file = this.photoBlob || photo;
    if (!file) {
      return this.view.showMessage(
        "Silakan ambil atau pilih foto terlebih dahulu"
      );
    }
    if (file.size > 1_000_000) {
      return this.view.showMessage("Ukuran foto tidak boleh lebih dari 1 MB");
    }

    // gunakan koordinat klik peta jika ada
    const payload = {
      description,
      photo: file,
      lat: this.selectedLat ?? lat,
      lon: this.selectedLon ?? lon
    };

    try {
      const token = getToken();
      const { error, message } = await addNewStory(token, payload);
      this.view.showMessage(message);
      if (!error) {
        // pindah ke Home setelah sukses
        window.location.hash = "#/";
      }
    } catch (err) {
      // Jika network error (offline), simpan ke IndexedDB
      await saveStoryOffline(payload);
      this.view.showMessage("Story disimpan offline");
      // Refresh daftar yang tersimpan
      await this._loadOfflineStories();
    }
  }
}
