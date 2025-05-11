import { getAllFavorites, removeFavorite } from "../utils/db.js";

export default class FavoritesPresenter {
  constructor(view) {
    this.view = view;
  }

  async init() {
    const stories = await getAllFavorites();
    this.view.renderFavorites(stories);
    this._bindRemoveButtons();
  }

  _bindRemoveButtons() {
    document.querySelectorAll(".btn-remove-favorite").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = Number(btn.dataset.id);
        await removeFavorite(id);
        // rerender setelah hapus
        const updated = await getAllFavorites();
        this.view.renderFavorites(updated);
      });
    });
  }
}
