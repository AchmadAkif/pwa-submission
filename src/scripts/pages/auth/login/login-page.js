import LoginPresenter from './login-presenter.js';

import * as UserStoriesAPI from '../../../data/api.js';
import * as AuthModel from '../../../utils/auth.js';

export default class LoginPage {
  #presenter;

  async render() {
    return `
      <section class="login-container">
        <section class="login-title">
          <h1>Welcome Back!</h1>
          <h2>Enter your email and password to access your account</h2>
        </section>
        <form id="login-form">
          <label for="email">Email</label>
          <input type="text" id="email" name="email" required />
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />
          <section class="submit-button-container">
            <button type="submit">Login</button>
          </section>
        </form>
        <p>Don't have an account? <a href="#/register">Register Now</a>.</p>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: UserStoriesAPI,
      authModel: AuthModel,
    });

    this.#formAction();
  }

  #formAction() {
    document
      .querySelector('#login-form')
      .addEventListener('submit', async event => {
        event.preventDefault();
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        this.#presenter.handleLogin({
          email,
          password,
        });
      });
  }

  loginSuccess() {
    location.hash = '/';
  }

  loginFailed() {
    alert('Login failed!');
  }

  showLoading() {
    document.querySelector('.submit-button-container').innerHTML = `
      <button type="submit">
        <i class="fa-solid fa-circle-notch loading-spinner"></i>
      </button>
      `;
  }

  hideLoading() {
    document.querySelector('.submit-button-container').innerHTML = `
      <button type="submit">Login</button>`;
  }
}
