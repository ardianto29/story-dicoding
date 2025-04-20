import { getToken } from '../utils/index.js';
import { getStoryDetail } from '../data/api.js';
import { parseActivePathname } from '../routes/url-parser.js';
import L from 'leaflet';

class DetailPage {
  async render() {
    return `<section id="detail-page"><h2>Loading...</h2></section>`;
  }

  async afterRender() {
    const { id } = parseActivePathname();
    const token = getToken();
    const { error, story } = await getStoryDetail(token, id);
    if (error) {
      document.querySelector('#detail-page').innerHTML = `<p>Error loading story.</p>`;
      return;
    }

    document.querySelector('#detail-page').innerHTML = `
      <h2>${story.name}</h2>
      <img src="${story.photoUrl}" alt="${story.name}" />
      <p>${story.description}</p>
      <p>${new Date(story.createdAt).toLocaleString()}</p>
      <div id="map" style="height:400px;"></div>
    `;

    // init leaflet map
    const map = L.map('map').setView([story.lat, story.lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([story.lat, story.lon]).addTo(map);
  }
}

export default DetailPage;
