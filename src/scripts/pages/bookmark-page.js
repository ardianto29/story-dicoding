import BookmarkPresenter from "../presenters/bookmark-presenter.js";

export default class BookmarkPage {
  async render() {
    const presenter = new BookmarkPresenter("#app");
    await presenter.init();
    return "";
  }

  async afterRender() {}
}
