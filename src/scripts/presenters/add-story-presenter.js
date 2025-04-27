import { getToken } from "../utils/index.js";
import { addNewStory } from "../data/api.js";

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
  }

  async init() {
    // 1) Map click & form submit binding
    this.view.bindMapClick(this._onMapClick.bind(this));
    this.view.bindSubmit(this._onSubmit.bind(this));

    // 2) Camera setup & capture binding
    await this._initCamera();
    this.view.bindCapture(this._onCapture.bind(this));
  }

  // Inisialisasi MediaStream ke <video>
  async _initCamera() {
    const video = document.getElementById("camera-preview");
    if (!video || !navigator.mediaDevices) return;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.stream;
    } catch (err) {
      console.error("Gagal akses kamera:", err);
      this.view.showMessage("Tidak dapat mengakses kamera");
    }
  }

  // Ambil foto dari video preview
  _onCapture() {
    const video = document.getElementById("camera-preview");
    const container = document.getElementById("camera-container");
    if (!video) return;

    // 1) Buat canvas dan gambar
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    // 2) Stop stream kamera
    this.stream?.getTracks().forEach((t) => t.stop());

    // 3) Hide video, tampilkan canvas
    video.style.display = "none";
    container.appendChild(canvas);

    // 4) Simpan blob untuk form submit
    canvas.toBlob(
      (blob) => {
        this.photoBlob = blob;
        this.view.showMessage("Foto berhasil diambil");
      },
      "image/jpeg",
      0.9
    );
  }

  _onMapClick({ lat, lon }) {
    // isi handler map klik (sudah ada sebelumnya)
    console.log("Koordinat dipilih:", lat, lon);
  }

  async _onSubmit({ description, photo, lat, lon }) {
    // utamakan foto dari kamera jika ada
    const file = this.photoBlob || photo;
    if (!file) {
      return this.view.showMessage(
        "Silakan ambil atau pilih foto terlebih dahulu"
      );
    }
    if (file.size > 1_000_000) {
      return this.view.showMessage("Ukuran foto tidak boleh lebih dari 1 MB");
    }

    const token = getToken();
    const { error, message } = await addNewStory(token, {
      description,
      photo: file,
      lat,
      lon
    });

    this.view.showMessage(message);
    if (!error) this.view.redirectToHome();
  }
}
