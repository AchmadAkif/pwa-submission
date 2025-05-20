// CSS imports
import '../../node_modules/leaflet/dist/leaflet.css';
import '../styles/styles.css';
import '../styles/pages/login-page.css';
import '../styles/pages/register-page.css';
import '../styles/pages/home-page.css';
import '../styles/pages/create-story-page.css';
import '../styles/pages/saved-stories-page.css';

import App from './pages/app';
import Camera from './utils/camera';
import { isServiceWorkerAvailable } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  if (isServiceWorkerAvailable()) {
    try {
      const { registerSW } = await import('virtual:pwa-register');
      await registerSW({
        immediate: true,
        onRegistered(registration) {
          console.log('SW registered:', registration);
        },
        onRegisterError(error) {
          console.error('SW registration error:', error);
        },
      });
    } catch (error) {
      console.error('SW registration error:', error);
    }
  }

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();
  app.updateNavigationVisibility();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    Camera.stopAllStream();
    app.updateNavigationVisibility();
  });
});
