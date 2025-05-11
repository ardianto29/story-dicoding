import BookmarkView from '../views/bookmark-view.js';

export default class BookmarkPage {
  constructor() {
    this.view = new BookmarkView();
  }

  /**
   * Di sini hanya RETURN string HTML,
   * jangan langsung inject ke DOM.
   */
  render() {
    return this.view.getTemplate();
  }

  /**
   * Setelah container.innerHTML di-setup,
   * panggil renderBookmarks untuk mengisi grid.
   */
  async afterRender() {
    await this.view.renderBookmarks();
  }
}
