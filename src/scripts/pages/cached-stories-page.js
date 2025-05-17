// src/scripts/pages/cached-stories-page.js
import CachedStoriesView      from "../views/cached-stories-view.js";
import CachedStoriesPresenter from "../presenters/cached-stories-presenter.js";

export default class CachedStoriesPage {
  // 1) render hanya inject template HTML statis
  async render() {
    const view = new CachedStoriesView();
    return view.getTemplate();
  }

  // 2) afterRender baru mount & init presenter ke "#main-content"
  async afterRender() {
    const presenter = new CachedStoriesPresenter("#main-content");
    await presenter.init();
  }
}
