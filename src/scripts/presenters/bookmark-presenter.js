import BookmarkView from '../views/bookmark-view.js';

const BookmarkPresenter = {
  async init() {
    // 1. siapkan view
    const view = new BookmarkView();
    // 2. render struktur dasar ke <div id="app">
    const app = document.getElementById('app');
    app.innerHTML = view.getTemplate();
    // 3. render isi bookmark
    await view.renderBookmarks();
  }
};

export default BookmarkPresenter;
