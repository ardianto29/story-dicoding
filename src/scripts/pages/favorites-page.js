// src/scripts/pages/favorites-page.js

import FavoritesPresenter from "../presenters/favorites-presenter.js";

export default {
  async render() {
    // Presenter yg mengurus mount + fetch + render
    await FavoritesPresenter.init();
    // Karena Presenter sudah inject ke #app, kita kembalikan string kosong
    return "";
  },
  async afterRender() {
    // tidak perlu implementasi tambahan
  }
};
