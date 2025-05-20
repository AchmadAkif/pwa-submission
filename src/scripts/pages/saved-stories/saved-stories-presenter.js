export default class SavedStoriesPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async handleGetAllSavedStories() {
    try {
      const stories = await this.#model.getAllStoriesFromIdb();

      await this.#view.populateSavedStories(stories);
    } catch (error) {
      console.error('Failed to get saved stories:', error);
      this.#view.showErrorMessage(error.message);
    }
  }

  async removeStory(id, buttonElement) {
    try {
      await this.#model.removeStory(id);
      this.#view.removeStorySuccess(buttonElement);
    } catch (error) {
      console.error('removeStory: error:', error);
      this.#view.showSaveStoryFailureMsg(error.message);
    }
  }
}
