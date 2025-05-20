import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import {
  generateSubscribeBtnTemplate,
  generateUnsubscribeBtnTemplate,
} from '../template';
import { isServiceWorkerAvailable } from '../utils';
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from '../utils/notification-helper';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', event => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach(link => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById(
      'push-notification-tools'
    );
    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeBtnTemplate();
      document
        .getElementById('unsubscribe-button')
        .addEventListener('click', () => {
          unsubscribe().finally(() => {
            this.#setupPushNotification();
          });
        });

      return;
    }

    pushNotificationTools.innerHTML = generateSubscribeBtnTemplate();
    document
      .getElementById('subscribe-button')
      .addEventListener('click', () => {
        subscribe().finally(() => this.#setupPushNotification());
      });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];
    const page = route();

    if (!page || typeof page.render !== 'function') {
      return;
    }

    if (isServiceWorkerAvailable()) {
      await this.#setupPushNotification();
    }

    if (!document.startViewTransition) {
      this.#content.innerHTML = await page.render();
      await page.afterRender();

      return;
    }

    document.startViewTransition(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    });
  }

  updateNavigationVisibility() {
    const currentHash = window.location.hash;

    const navList = document.querySelector('#nav-list');
    const createStoryButton = document.querySelector('.create-story__button');
    const homeLink = navList.querySelector('a[href="#/"]');
    const savedStoriesLink = navList.querySelector('a[href="#/saved-stories"]');
    const logoutButton = navList.querySelector('.logout-button');
    const drawerButton = document.querySelector('#drawer-button');

    if (currentHash === '#/login' || currentHash === '#/register') {
      createStoryButton.classList.add('hidden');
      homeLink.classList.add('hidden');
      savedStoriesLink.classList.add('hidden');
      logoutButton.classList.add('hidden');
      drawerButton.classList.add('hidden');
    } else {
      // Show buttons
      createStoryButton.classList.remove('hidden');
      homeLink.classList.remove('hidden');
      savedStoriesLink.classList.remove('hidden');
      logoutButton.classList.remove('hidden');
      drawerButton.classList.remove('hidden');
    }
  }
}

export default App;
