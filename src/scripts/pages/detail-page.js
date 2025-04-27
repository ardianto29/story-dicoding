import DetailView from "../views/detail-view.js";
import DetailPresenter from "../presenters/detail-presenter.js";

export default class DetailPage {
  async render() {
    const view = new DetailView();
    return view.getTemplate();
  }

  async afterRender() {
    const view = new DetailView();
    const presenter = new DetailPresenter(view);
    await presenter.init();
  }
}
