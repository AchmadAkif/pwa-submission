import HomePresenter from './home-presenter';
import * as UserStoriesAPI from '../../data/api';
import { generateStoriesCard } from '../../template';
import Database from '../../data/database';

export default class HomePage {
  #presenter;

  async render() {
    return `
      <section class="home-container">
        <div class="home-page__map__container" aria-label="map showing user stories location">
          <div id="map" class="story__location__map"></div>
        </div>
        <h1 tabindex="-1" class="section-title">Stories around you</h1>
        <div id="story-list__container"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: UserStoriesAPI,
      dbModel: Database,
    });

    this.skipToContentListen();
    this.#presenter.handleGetAllStories();
    this.#presenter.handleLoadMap('map');
  }

  skipToContentListen() {
    document.querySelector('.skip-to-content').addEventListener('click', () => {
      const mainContent = document.querySelector('.section-title');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Smooth scrolling
        mainContent.focus(); // Focus on the main content for accessibility
      }
    });
  }

  async populateUserStories(stories) {
    const savedStories = await Database.getAllStoriesFromIdb();
    const savedStoryIds = savedStories.map(story => story.id);

    const storiesWithSavedState = stories.map(story => ({
      ...story,
      isSaved: savedStoryIds.includes(story.id),
    }));

    const htmlContent = storiesWithSavedState
      .map(story => generateStoriesCard({ ...story }))
      .join('');
    document.querySelector('#story-list__container').innerHTML = htmlContent;

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

  saveStorySuccess(button) {
    button.classList.add('saved');
    button.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
    button.disabled = true;
  }

  removeStorySuccess(button) {
    button.classList.remove('saved');
    button.dataset.action = 'save';
    button.innerHTML = '<i class="far fa-bookmark"></i> Save This Story';
  }

  showSaveStoryFailureMsg(msg) {
    alert(msg);
  }
}
