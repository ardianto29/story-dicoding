import CachedStoriesView from "../views/cached-stories-view.js";
import { getAllCachedStories, clearCachedStories } from "../utils/db.js";

export default class CachedStoriesPresenter {
  constructor(containerSelector) {
    this.view = new CachedStoriesView();
    this.view.mount(containerSelector);
  }

  async init() {
    try {
      const stories = await getAllCachedStories();
      this.view.render(stories);

      // pasang handler untuk tombol bersihkan cache
      this.view.onClear = async () => {
        await clearCachedStories();
        this.init(); // reload ulang halaman
      };
    } catch (err) {
      this.view.showMessage("Gagal memuat data cache.");
    }
  }
}
