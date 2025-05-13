// src/scripts/views/favorites-view.js

export default class FavoritesView {
  constructor() {
    this._containerId = "favorites-list";
    // Presenter akan assign handler ini:
    this.onRemove = null;
  }

  /**
   * Kembalikan HTML untuk container Favorites
   */
  getTemplate() {
    return `
      <section class="favorites bg-gray-50 py-6">
        <div class="max-w-screen-xl mx-auto px-4">
          <h2 class="text-2xl font-semibold mb-6">Favorit</h2>
          <div id="${this._containerId}" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"></div>
        </div>
      </section>
    `;
  }

  /**
   * Render daftar items (diberikan oleh Presenter) ke dalam #favorites-list
   * @param {Array} items  Array of story objects
   */
  render(items) {
    const container = document.getElementById(this._containerId);

    if (!items || items.length === 0) {
      container.innerHTML = `
        <p class="empty-message">Belum ada favorit untuk ditampilkan.</p>
      `;
      return;
    }

    container.innerHTML = items
      .map(
        (story) => `
        <article class="favorite-item">
          <img src="${story.photoUrl}" alt="${story.description}" class="w-full h-32 object-cover rounded">
          <h3 class="mt-2 font-medium">${story.name}</h3>
          <button class="btn-remove-favorite mt-1 text-sm text-red-600" data-id="${story.id}">
            Hapus Favorit
          </button>
        </article>
      `
      )
      .join("");

    // Pasang listener tombol hapus ke callback Presenter
    container.querySelectorAll(".btn-remove-favorite").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (typeof this.onRemove === "function") {
          this.onRemove(id);
        }
      });
    });
  }

  /**
   * Inject template dasar ke dalam elemen appSelector
   */
  mount(appSelector) {
    const app = document.querySelector(appSelector);
    app.innerHTML = this.getTemplate();
  }
}
