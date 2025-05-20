import { showFormattedDate } from './utils';

export function generateStoriesCard({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  isSaved = false,
}) {
  const buttonClass = isSaved
    ? 'save-story__button saved'
    : 'save-story__button';
  const iconClass = isSaved ? 'fas fa-bookmark' : 'far fa-bookmark';
  const buttonText = isSaved ? 'Saved' : 'Save This Story';
  const action = isSaved ? 'remove' : 'save';

  return `
    <div tabindex="0" class="story-card">
      <img class="story-card__image" src="${photoUrl}" alt="${name}">
      <div class="story-card__body">
        <div class="story-card__main">
          <h2 class="story-title">${name}</h2>
          <div class="story-card__more-info">
            <div class="story-card__created-at">
              <i class="fas fa-calendar-alt"></i> 
              <p>${showFormattedDate(createdAt)}</p>
            </div>
          </div>
        </div>
        <div class="story-card__description">
          <p>${description}</p>
          <button id="save-story__button" class="${buttonClass}"  data-reportid="${id}" data-action="${action}">
            <i class="${iconClass}"></i> ${buttonText} 
          </button>
        </div>
      </div>
    </div>
  `;
}

export function generateSubscribeBtnTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeBtnTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Subscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}
