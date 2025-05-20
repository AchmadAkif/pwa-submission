import { registerRoute } from 'workbox-routing';
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import CONFIG from '../scripts/config';
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => {
    return (
      url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com'
    );
  },
  new CacheFirst({
    cacheName: 'google-fonts',
  })
);

registerRoute(
  ({ url }) => {
    return (
      url.origin === 'https://cdnjs.cloudflare.com' ||
      url.origin.includes('fontawesome')
    );
  },
  new CacheFirst({
    cacheName: 'fontawesome',
  })
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'story-api',
  })
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'story-api-images',
  })
);

registerRoute(
  ({ url }) => {
    return url.origin.includes('openstreetmap');
  },
  new CacheFirst({
    cacheName: 'osm-api',
  })
);

self.addEventListener('push', async event => {
  // Check notification permission
  const permission = await self.registration.pushManager.permissionState({
    userVisibleOnly: true,
  });

  if (permission !== 'granted') {
    console.log('Notifications blocked - not showing notification');
    return;
  }

  console.log('Service worker pushing...');

  const chainPromise = async () => {
    try {
      const data = await event.data.json();

      // Double check Notification permission
      if (Notification.permission !== 'granted') {
        console.log('Notification permission revoked');
        return;
      }

      await self.registration.showNotification(data.title, {
        body: data.options.body,
        requireInteraction: false, // Don't persist notification
        silent: false, // Respect system notification settings
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  };

  event.waitUntil(chainPromise());
});

// Handle permission changes
self.addEventListener('pushsubscriptionchange', event => {
  console.log('Push subscription changed or expired');
  // Unsubscribe from push when permissions change
  event.waitUntil(
    self.registration.pushManager.getSubscription().then(subscription => {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
  );
});
