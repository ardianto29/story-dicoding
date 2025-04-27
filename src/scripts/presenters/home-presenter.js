import { getAllStories } from "../data/api.js";
import { getToken } from "../utils/index.js";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
  }

  async init() {
    const token = getToken();
    const { error, listStory } = await getAllStories(token, 1, 10, 1);
    if (error) {
      console.error("Gagal fetch story:", listStory);
      return;
    }
    this.view.showStories(listStory);
    this.view.initMap(listStory);
  }
}
