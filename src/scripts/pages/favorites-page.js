import FavoritesView      from "../views/favorites-view.js";
import FavoritesPresenter from "../presenters/favorites-presenter.js";

export default class FavoritesPage {
  async render() {
    const view = new FavoritesView();
    return view.getTemplate();
  }

  async afterRender() {
    const view      = new FavoritesView();
    const presenter = new FavoritesPresenter(view);
    await presenter.init();
  }
}
