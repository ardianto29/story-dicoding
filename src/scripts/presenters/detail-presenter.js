import { getToken } from '../utils/index.js';
import { getStoryDetail } from '../data/api.js';
import { parseActivePathname } from '../routes/url-parser.js';

export default class DetailPresenter {
  constructor(view) {
    this.view = view;
  }

  async init() {
    const { id } = parseActivePathname(); 
    const token = getToken();
    const { error, story, message } = await getStoryDetail(token, id);

    if (error) {
      return this.view.showError(message || 'Gagal memuat detail story');
    }
    this.view.renderDetail(story);
    if (story.lat != null && story.lon != null) {
      this.view.initMap(story.lat, story.lon);
    }
  }
}
