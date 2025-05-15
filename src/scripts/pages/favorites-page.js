import FavoritesPresenter from "../presenters/favorites-presenter.js";

export default class FavoritesPage {
  async render() {
    const presenter = new FavoritesPresenter("#app");
    await presenter.init();
    return "";
  }
  async afterRender() {}
}
