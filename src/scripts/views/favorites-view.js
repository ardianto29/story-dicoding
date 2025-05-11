import { getAllFavorites, removeFavorite } from "../utils/db.js";

export default class FavoritesView {
  constructor() {
    this._init();
  }

  async _init() {
    const stories = await getAllFavorites();
    this.renderFavorites(stories);
  }

  getTemplate() {
    return `
      <section class="favorites bg-gray-50 py-6">
        <div class="max-w-screen-xl mx-auto px-4 w-full">
          <h2 class="text-2xl font-semibold mb-6">Favorit</h2>
          <div id="favorites-list" class="flex flex-wrap -mx-2 gap-y-6"></div>
        </div>
      </section>
    `;
  }

  /**
   * Menerima array stories dari DB dan merendernya
   */
  renderFavorites(stories) {
    const container = document.getElementById("favorites-list");
    if (!stories || stories.length === 0) {
      container.innerHTML = `
        <p class="w-full text-center text-gray-600">Tidak ada favorit untuk ditampilkan.</p>
      `;
      return;
    }

    container.innerHTML = stories
      .map((story) => {
        const dateStr = new Date(story.createdAt).toLocaleString();
        return `
          <article class="story-item w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2">
            <div class="relative bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
              <img
                src="${story.photoUrl}"
                alt="${story.description}"
                class="w-full h-48 object-cover"
                onerror="this.src='assets/fallback-image.png'"
              />
              <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">${story.name}</h3>
                  <p class="text-sm text-gray-600">${dateStr}</p>
                </div>
                <button
                  class="mt-4 self-start bg-teal-600 hover:bg-teal-700 text-white p-2 rounded flex items-center justify-center story-menu-button"
                  aria-label="Menu"
                  data-id="${story.id}"
                >⋮</button>
              </div>

              <!-- dropdown menu Hapus Favorit -->
              <div
                id="dropdown-${story.id}"
                class="story-dropdown hidden absolute top-8 right-4 w-40 bg-white border rounded shadow-md z-10"
              >
                <button
                  class="block w-full text-left px-4 py-2 hover:bg-gray-100 btn-remove-favorite"
                  data-id="${story.id}"
                >Hapus Favorit</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    // Toggle dropdown menu
    container.querySelectorAll(".story-menu-button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const dd = document.getElementById(`dropdown-${id}`);
        dd.classList.toggle("show");
      });
    });

    // Hapus favorit
    container.querySelectorAll(".btn-remove-favorite").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.dataset.id;
        try {
          await removeFavorite(id);
          alert("Berhasil dihapus dari favorit");
          const stories = await getAllFavorites();
          this.renderFavorites(stories);
        } catch (error) {
          console.error(error);
          alert("Gagal menghapus favorit, silakan coba lagi.");
        }
      });
    });
  }

  /**
   * Menampilkan pesan sederhana lewat alert
   */
  showMessage(message) {
    alert(message);
  }
}
