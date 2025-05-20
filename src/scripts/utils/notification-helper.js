import { convertBase64ToUint8Array } from './index';
import CONFIG from '../config';
import {
  subscribePushNotification,
  unsubscribePushNotification,
} from '../data/api';

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    alert('Notification request rejected.');
    return false;
  }

  if (status === 'default') {
    alert('Notification request prompt closed or ignored.');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  try {
    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration) {
      console.log('No service worker registration found');
      return null;
    }

    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting push subscription:', error);
    return null;
  }
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubsOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    alert('Already subscribing to push notification.');
    return;
  }

  console.log('Start subscribing push notification...');

  const failureSubsErrMessage =
    'Failed to start subscription to push notification.';
  const successSubsMessage = 'Subscription to push notification successful.';

  let pushSubscription;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(
      generateSubsOptions()
    );
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });

    if (!response.ok) {
      console.error('subscribe: response:', response);
      alert(failureSubsErrMessage);
      // Undo subscribe to push notification
      await pushSubscription.unsubscribe();
      return;
    }

    console.log(response);
    alert(successSubsMessage);
  } catch (error) {
    console.error('subscribe: error:', error);
    alert(failureSubsErrMessage);
    await pushSubscription.unsubscribe();
  }
}

export async function unsubscribe() {
  const failureUnsubsErrMessage =
    'Unable to deactivate push notification subscription.';
  const successSubsMessage = 'Subcription to notification stopped.';
  try {
    const pushSubscription = await getPushSubscription();
    if (!pushSubscription) {
      alert(
        'Unable to deactivate notification subscription because you havent subscribing before.'
      );
      return;
    }
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });
    if (!response.ok) {
      alert(failureUnsubsErrMessage);
      console.error('unsubscribe: response:', response);
      return;
    }
    const unsubscribed = await pushSubscription.unsubscribe();
    if (!unsubscribed) {
      alert(failureUnsubsErrMessage);
      await subscribePushNotification({ endpoint, keys });
      return;
    }
    alert(successSubsMessage);
  } catch (error) {
    alert(failureUnsubsErrMessage);
    console.error('unsubscribe: error:', error);
  }
}
