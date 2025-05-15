// src/scripts/presenters/favorites-presenter.js
import FavoritesView from "../views/favorites-view.js";
import { getAllFavorites, removeFavorite } from "../utils/db.js";

export default class FavoritesPresenter {
  constructor(containerSelector) {
    this.view = new FavoritesView();
    this.view.mount(containerSelector);
  }

  async init() {
    const data = await getAllFavorites();
    this.view.renderFavorites(data, {
      onRemove: (id) => {
        removeFavorite(id).then(() => this.init());
      }
    });
  }
}
