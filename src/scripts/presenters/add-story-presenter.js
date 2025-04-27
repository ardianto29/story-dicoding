import { getToken } from "../utils/index.js";
import { addNewStory } from "../data/api.js";

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    // Pasang listener map click & form submit
    this.view.bindMapClick(this._onMapClick.bind(this));
    this.view.bindSubmit(this._onSubmit.bind(this));
  }

  _onMapClick({ lat, lon }) {
    // (opsional) bisa tampilkan koordinat di UI atau log
    console.log("Koordinat dipilih:", lat, lon);
  }

  async _onSubmit({ description, photo, lat, lon }) {
    if (photo.size > 1_000_000) {
      return this.view.showMessage("Ukuran foto tidak boleh lebih dari 1 MB");
    }

    const token = getToken();
    const { error, message } = await addNewStory(token, {
      description,
      photo,
      lat,
      lon
    });
    this.view.showMessage(message);
    if (!error) this.view.redirectToHome();
  }
}
