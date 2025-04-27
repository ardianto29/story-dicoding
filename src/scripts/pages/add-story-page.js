import AddStoryView from "../views/add-story-view.js";
import AddStoryPresenter from "../presenters/add-story-presenter.js";

export default class AddStoryPage {
  async render() {
    const view = new AddStoryView();
    return view.getTemplate();
  }

  async afterRender() {
    const view = new AddStoryView();
    const presenter = new AddStoryPresenter(view);
    presenter.init();
  }
}
