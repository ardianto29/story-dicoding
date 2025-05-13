// src/scripts/presenters/favorites-presenter.js

import FavoritesView from "../views/favorites-view.js";
import { getAllFavorites, removeFavorite } from "../utils/db.js";

const FavoritesPresenter = {
  async init() {
    // 1. Prepare view
    const view = new FavoritesView();
    view.mount("#app");

    // 2. Bind handler hapus favorit ke Presenter
    view.onRemove = async (id) => {
      try {
        await removeFavorite(id);
        alert("Favorit dihapus");
        const updated = await getAllFavorites();
        view.render(updated);
      } catch (err) {
        console.error("Gagal menghapus favorit:", err);
        alert("Gagal menghapus favorit");
      }
    };

    // 3. Fetch data dan render list awal
    try {
      const items = await getAllFavorites();
      view.render(items);
    } catch (err) {
      console.error("Gagal memuat favorit:", err);
      alert("Gagal memuat favorit");
    }
  }
};

export default FavoritesPresenter;
