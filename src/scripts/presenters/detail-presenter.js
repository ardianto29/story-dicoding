import { getToken } from '../utils/index.js';
import { getStoryDetail } from '../data/api.js';
import { parseActivePathname } from '../routes/url-parser.js';

// import fungsi IndexedDB
import {
  getFavorite,
  addFavorite,
  removeFavorite,
} from '../utils/db.js';

export default class DetailPresenter {
  constructor(view) {
    this.view = view;
  }

  async init() {
    const { id } = parseActivePathname();
    const token  = getToken();
    const { error, story, message } = await getStoryDetail(token, id);

    if (error) {
      return this.view.showError(message || 'Gagal memuat detail story');
    }

    // render UI lama
    this.view.renderDetail(story);
    if (story.lat != null && story.lon != null) {
      this.view.initMap(story.lat, story.lon);
    }

    // --- mulai integrasi bookmark ---
    await this._initFavoriteButton(story);
  }

  // setup tombol favorite: inisialisasi label + event handler
  async _initFavoriteButton(story) {
    const btn = document.getElementById('btn-favorite');
    if (!btn) return;

    // cek state awal
    const existing = await getFavorite(story.id);
    btn.textContent = existing ? 'Unbookmark' : 'Bookmark';

    btn.addEventListener('click', async () => {
      if (await getFavorite(story.id)) {
        await removeFavorite(story.id);
        btn.textContent = 'Bookmark';
        alert('Story dihapus dari favorites');
      } else {
        await addFavorite(story);
        btn.textContent = 'Unbookmark';
        alert('Story berhasil di–bookmark');
      }
    });
  }
}
