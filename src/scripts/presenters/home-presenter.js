import { getAllStories } from "../data/api.js";
import { getToken } from "../utils/index.js";
import { subscribePush, unsubscribePush } from "../utils/push-notification.js";
import { addFavorite, addBookmark } from "../utils/db.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this._stories = []; // untuk menyimpan list story
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

    // simpan stories untuk keperluan binding menu
    this._stories = listStory;

    // render stories & peta
    this.view.showStories(listStory);
    this.view.initMap(listStory);

    // bind notifikasi
    this.view.bindSubscribe(this._onSubscribe.bind(this));
    this.view.bindUnsubscribe(this._onUnsubscribe.bind(this));

    // **binding tambahan untuk menu Favorit & Bookmark**
    this._bindStoryMenu();
    this._bindFavoriteButtons();
    this._bindBookmarkButtons();
  }

  // toggle dropdown saat tombol “⋮” diklik
  _bindStoryMenu() {
    document.querySelectorAll(".story-menu-button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const dd = document.getElementById(`dropdown-${id}`);
        dd.classList.toggle("show");
      });
    });
  }

  // tombol “Tambahkan Favorit”
  _bindFavoriteButtons() {
    document.querySelectorAll(".btn-add-favorite").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const story = this._stories.find((s) => s.id == id);
        try {
          await addFavorite(story);
          // langsung navigasi ke halaman Favorit
          window.location.hash = "#/favorites";
        } catch (err) {
          this.view.showMessage("Gagal menambahkan ke Favorit");
        }
      });
    });
  }

  // tombol “Tambahkan ke Bookmark”
  _bindBookmarkButtons() {
    document.querySelectorAll(".btn-add-bookmark").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const story = this._stories.find((s) => s.id == id);
        try {
          await addBookmark(story);
          this.view.showMessage("Story berhasil ditambahkan ke Bookmark");
        } catch (err) {
          this.view.showMessage("Gagal menambahkan ke Bookmark");
        }
      });
    });
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
