import HomePage from '../pages/home/home-page';
import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page';
import CreateStoryPage from '../pages/create-story/create-story_page';
import SavedStories from '../pages/saved-stories/saved-stories-page';

import {
  checkAuthenticatedRoutes,
  checkPublicRoutes,
  deleteAccessToken,
} from '../utils/auth';

const routes = {
  // PUBLIC ROUTES
  '/login': () => checkPublicRoutes(new LoginPage()),
  '/register': () => checkPublicRoutes(new RegisterPage()),

  // PRIVATE ROUTES
  '/': () => checkAuthenticatedRoutes(new HomePage()),
  '/saved-stories': () => checkAuthenticatedRoutes(new SavedStories()),
  '/create-story': () => checkAuthenticatedRoutes(new CreateStoryPage()),
  '/logout': () => deleteAccessToken(),
};

export default routes;
