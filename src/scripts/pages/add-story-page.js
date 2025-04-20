import { getToken } from '../utils/index.js';
import { addNewStory } from '../data/api.js';

class AddStoryPage {
  async render() {
    return `
      <section class="add-story">
        <h2>Tambah Story</h2>
        <form id="add-story-form" enctype="multipart/form-data">
          <label>Deskripsi:<textarea name="description" required></textarea></label>
          <label>Foto:<input type="file" name="photo" accept="image/*" required></label>
          <button type="submit">Kirim</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('add-story-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = getToken();
      const data = {
        description: form.description.value,
        photo: form.photo.files[0],
        // nanti kita tambah lat/lon
      };
      const { error, message } = await addNewStory(token, data);
      if (!error) {
        alert('Story berhasil ditambah');
        window.location.hash = '/';
      } else {
        alert('Gagal menambah story');
      }
    });
  }
}

export default AddStoryPage;
