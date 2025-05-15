import BookmarkView from "../views/bookmark-view.js";
import { getAllBookmarks, removeBookmark } from "../utils/db.js";

export default class BookmarkPresenter {
  constructor(containerSelector) {
    this.view = new BookmarkView();
    this.view.mount(containerSelector);
  }

  async init() {
    // 1. Buat instance View dan inject template dasar ke <div id="app">
    const view = new BookmarkView();
    view.mount("#app");

    // 2. Bind callback onRemove → Presenter
    view.onRemove = async (id) => {
      try {
        await removeBookmark(id);
        alert("Bookmark dihapus");
        // refresh daftar setelah berhasil hapus
        const updated = await getAllBookmarks();
        view.render(updated);
      } catch (err) {
        console.error("Gagal menghapus bookmark:", err);
        alert("Gagal menghapus bookmark");
      }
    };

    // 3. Fetch data awal dan render
    try {
      const items = await getAllBookmarks();
      view.render(items);
    } catch (err) {
      console.error("Gagal memuat data bookmark:", err);
      alert("Gagal memuat bookmark");
    }
  }
}
