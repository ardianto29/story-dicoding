import { getAllStories } from "../data/api.js";
import { getToken } from "../utils/index.js";
import { subscribePush, unsubscribePush } from "../utils/push-notification.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
  }

  async init() {
    const token = getToken();
    if (!token) {
      window.location.href = "#/login";
      return;
    }
    const { error, listStory } = await getAllStories(token, 1, 10, 1);
    if (error) {
      console.error("Gagal fetch story:", listStory);
      this.view.showMessage("Gagal memuat story, silakan coba lagi nanti.");
      return;
    }

    this.view.showStories(listStory);
    this.view.initMap(listStory);

    this.view.bindSubscribe(this._onSubscribe.bind(this));
    this.view.bindUnsubscribe(this._onUnsubscribe.bind(this));
  }

  async _onSubscribe() {
    try {
      const { error, message } = await subscribePush();
      this.view.showMessage(error ? message : "Berhasil subscribe notifikasi");
    } catch (err) {
      this.view.showMessage(err.message);
    }
  }
  async _onUnsubscribe() {
    try {
      await unsubscribePush();
      this.view.showMessage("Berhasil unsubscribe notifikasi");
    } catch (err) {
      this.view.showMessage(err.message);
    }
  }
}
