import SavedStoriesPresenter from './saved-stories-presenter';
import { generateStoriesCard } from '../../template';
import Database from '../../data/database';

export default class SavedStories {
  #presenter;

  async render() {
    return `
      <section class="saved-stories-container">
        <h1 tabindex="-1" class="section-title">Stories you saved</h1>
        <div id="saved-story-list__container"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new SavedStoriesPresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.handleGetAllSavedStories();
  }

  async populateSavedStories(stories) {
    const savedStories = await Database.getAllStoriesFromIdb();
    const savedStoryIds = savedStories.map(story => story.id);

    const storiesWithSavedState = stories.map(story => ({
      ...story,
      isSaved: savedStoryIds.includes(story.id),
    }));

    const htmlContent = storiesWithSavedState
      .map(story => generateStoriesCard({ ...story }))
      .join('');
    document.querySelector('#saved-story-list__container').innerHTML =
      htmlContent;

    this.setupSaveStoryBtn();
  }

  setupSaveStoryBtn() {
    const saveButtons = document.querySelectorAll('#save-story__button');

    saveButtons.forEach(btn => {
      btn.addEventListener('click', async event => {
        const button = event.target.closest('#save-story__button');
        if (!button) return;

        const id = event.target.dataset.reportid;
        const action = event.target.dataset.action;

        if (!id) return;

        if (action === 'save') {
          await this.#presenter.saveStory(id, button);
        } else if (action === 'remove') {
          await this.#presenter.removeStory(id, button);
        }
      });
    });
  }

  async removeStorySuccess(button) {
    button.classList.remove('saved');
    button.dataset.action = 'save';
    button.innerHTML = '<i class="far fa-bookmark"></i> Save This Story';
  }

  showSaveStoryFailureMsg(msg) {
    alert(msg);
  }
}
