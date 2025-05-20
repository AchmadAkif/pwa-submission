import CONFIG from '../config';
import { getActiveRoute } from '../routes/url-parser';

export function getAccessToken() {
  try {
    return localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function storeAccessToken(token) {
  try {
    localStorage.setItem(CONFIG.ACCESS_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function deleteAccessToken() {
  try {
    localStorage.removeItem(CONFIG.ACCESS_TOKEN_KEY);
    location.hash = '/login';
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const publicRoutes = ['/login', '/register'];

export function checkPublicRoutes(page) {
  const activeRoute = getActiveRoute();
  const isLoggedIn = getAccessToken();

  if (publicRoutes.includes(activeRoute) && isLoggedIn) {
    location.hash('/');
    return;
  }

  return page;
}

export function checkAuthenticatedRoutes(page) {
  if (!getAccessToken()) {
    location.hash = '/login';
    return;
  }

  return page;
}
