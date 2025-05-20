import Map from '../../utils/map';

export default class HomePresenter {
  #map;
  #markersCoordinate;
  #initCoordinate = [-7.4539816101042895, 109.65614397503595];
  #view;
  #model;
  #dbModel;

  constructor({ view, model, dbModel }) {
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
  }

  async handleGetAllStories() {
    try {
      const response = await this.#model.getAllStories();
      const stories = response.listStory;

      if (response.error) {
        console.error('API Error:', response.message);
        return;
      }

      this.#markersCoordinate = stories
        .filter(story => story.lat !== null && story.lon !== null)
        .map(story => ({
          name: story.name,
          description: story.description,
          lat: story.lat,
          lng: story.lon,
        }));

      this.getStoriesLocation();
      this.#view.populateUserStories(stories);
    } catch (error) {
      console.error(error);
    }
  }

  async handleLoadMap(selector) {
    this.#map = await new Map({
      mapContainer: selector,
      options: {
        zoom: 8,
        center: this.#initCoordinate,
        scrollWheelZoom: false,
      },
    });
  }

  async getStoriesLocation() {
    await this.#markersCoordinate.forEach(item => {
      this.#map.generateMarkersFromAPI(item);
    });
  }

  async saveStory(id, buttonElement) {
    try {
      const response = await this.#model.getStoryById(id);
      const story = response.story;

      await this.#dbModel.putStory(story);
      this.#view.saveStorySuccess(buttonElement);
    } catch (error) {
      console.error('saveStory: error:', error);
      this.#view.showSaveStoryFailureMsg(error.message);
    }
  }

  async removeStory(id, buttonElement) {
    try {
      await this.#dbModel.removeStory(id);
      this.#view.removeStorySuccess(buttonElement);
    } catch (error) {
      console.error('removeStory: error:', error);
      this.#view.showSaveStoryFailureMsg(error.message);
    }
  }
}
