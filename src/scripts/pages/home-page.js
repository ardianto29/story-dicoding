import HomeView from "../views/home-view.js";
import HomePresenter from "../presenters/home-presenter.js";

export default class HomePage {
  async render() {
    const view = new HomeView();
    return view.getTemplate();
  }

  async afterRender() {
    const view = new HomeView();
    const presenter = new HomePresenter(view);
    presenter.init();
  }
}
