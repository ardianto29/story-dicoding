import { getToken } from "../utils/index.js";
import { addNewStory } from "../data/api.js";

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
  }

  // Jadikan init() async agar bisa await camera setup
  async init() {
    this.view.bindMapClick(this._onMapClick.bind(this));
    this.view.bindSubmit(this._onSubmit.bind(this));

    await this._initCamera();
    this.view.bindCapture(this._onCapture.bind(this));
  }

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

  _onCapture() {
    const video = document.getElementById("camera-preview");
    const container = document.getElementById("camera-container");

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    this.stream?.getTracks().forEach((t) => t.stop());

    video.style.display = "none";

    container.appendChild(canvas);

    canvas.toBlob(
      (blob) => {
        this.photoBlob = blob;
        this.view.showMessage("Foto berhasil diambil");
      },
      "image/jpeg",
      0.9
    );

    // Hentikan kamera
    this.stream?.getTracks().forEach((track) => track.stop());
  }

  // Handler klik di peta (sudah ada)
  _onMapClick({ lat, lon }) {
    console.log("Koordinat dipilih:", lat, lon);
  }

  // Handler submit form
  async _onSubmit({ description, photo, lat, lon }) {
    // jika user sudah capture, utamakan blob itu
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
