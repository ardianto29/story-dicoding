// src/scripts/views/bookmark-view.js

import { getAllBookmarks, removeBookmark } from '../utils/db.js';

export default class BookmarkView {
  constructor() {
    this._containerId = 'bookmarks-list';
  }

  /**
   * Kembalikan HTML untuk halaman Bookmark
   */
  getTemplate() {
    return `
      <section class="bookmark-page">
        <div class="container">
          <h2>Bookmark</h2>
          <div id="${this._containerId}"></div>
        </div>
      </section>
    `;
  }

  /**
   * Render semua bookmark ke dalam #bookmarks-list
   */
  async renderBookmarks() {
    const container = document.getElementById(this._containerId);
    const stories = await getAllBookmarks();

    // kalau kosong
    if (!stories || stories.length === 0) {
      container.innerHTML = `
        <p class="empty-message">Belum ada bookmark untuk ditampilkan.</p>
      `;
      return;
    }

    // bangun markup setiap story
    container.innerHTML = stories
      .map((story) => {
        const dateStr = new Date(story.createdAt).toLocaleString();
        return `
          <article class="bookmark-item">
            <img src="${story.photoUrl}" alt="${story.description}">
            <h3>${story.name}</h3>
            <p class="date">${dateStr}</p>
            <button class="btn-remove-bookmark" data-id="${story.id}">
              Hapus Bookmark
            </button>
          </article>
        `;
      })
      .join('');

    // pasang listener tombol hapus
    container
      .querySelectorAll('.btn-remove-bookmark')
      .forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          const id = e.currentTarget.dataset.id;
          await removeBookmark(id);
          alert('Bookmark dihapus');
          this.renderBookmarks(); // re-render ulang
        });
      });
  }

  /**
   * Entry point, dipanggil oleh router/controller
   */
  async render() {
    // render struktur dasar
    const app = document.getElementById('app');
    app.innerHTML = this.getTemplate();
    // lalu render isinya
    await this.renderBookmarks();
  }
}
