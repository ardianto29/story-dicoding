export default class CachedStoriesView {
  constructor() {
    this._containerId = "cached-stories-list";
    this.onClear = null;
  }

  getTemplate() {
    return `
      <section class="cached-stories bg-gray-50 py-6">
        <div class="max-w-screen-xl mx-auto px-4">
          <h2>Cerita Tersimpan</h2>
          <div id="${this._containerId}"></div>
          <button id="btn-clear-cache" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Bersihkan Cache
          </button>
        </div>
      </section>
    `;
  }

  render(items) {
    const container = document.getElementById(this._containerId);
    if (!items || items.length === 0) {
      container.innerHTML = `<p class="empty-message">Tidak ada cerita yang di-cache.</p>`;
    } else {
      container.innerHTML = items
        .map(
          (story) => `
          <article class="story-item mb-6 p-4 bg-white rounded shadow">
            <img src="${story.photoUrl}" alt="${story.description}"
                 class="w-full h-48 object-cover rounded" />
            <h3 class="mt-2 font-semibold">${story.name}</h3>
            <p class="text-sm text-gray-600">${story.description}</p>
            <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
          </article>
        `
        )
        .join("");
    }

    const btnClear = document.getElementById("btn-clear-cache");
    if (btnClear && typeof this.onClear === "function") {
      btnClear.addEventListener("click", () => this.onClear());
    }
  }

  mount(appSelector) {
    document.querySelector(appSelector).innerHTML = this.getTemplate();
  }

  showMessage(message) {
    alert(message);
  }
}
