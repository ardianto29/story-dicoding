export default class BookmarkView {
  constructor() {
    this._containerId = "bookmarks-list";
    this.onRemove = null;
  }

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

  render(items) {
    const container = document.getElementById(this._containerId);

    if (!items || items.length === 0) {
      container.innerHTML = `
        <p class="empty-message">Belum ada bookmark untuk ditampilkan.</p>
      `;
      return;
    }

    container.innerHTML = items
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
      .join("");

    // Pasang listener tombol hapus, yang memanggil callback Presenter
    container.querySelectorAll(".btn-remove-bookmark").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (typeof this.onRemove === "function") {
          this.onRemove(id);
        }
      });
    });
  }

  mount(appSelector) {
    const app = document.querySelector(appSelector);
    app.innerHTML = this.getTemplate();
  }
}
