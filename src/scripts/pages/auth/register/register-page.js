import RegisterPresenter from './register-presenter';
import * as UserStoriesAPI from '../../../data/api';

export default class RegisterPage {
  #presenter;

  async render() {
    return `
      <section class="register-container">
        <section class="register-title">
          <h1>Create an Account</h1>
          <h2>Enter your email and password to create an account</h2>
        </section>
        <form id="register-form">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required />
          <label for="email">Email</label>
          <input type="text" id="email" required />
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />
          <section class="submit-button-container">
            <button type="submit">Register</button>
          </section>
        </form>
        <p>Already have an account? <a href="#/login">Log in</a>.</p>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: UserStoriesAPI,
    });

    this.#formAction();
  }

  #formAction() {
    document
      .querySelector('#register-form')
      .addEventListener('submit', async event => {
        event.preventDefault();
        const username = document.querySelector('#username').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        this.#presenter.handleRegister({
          username,
          email,
          password,
        });
      });
  }

  handleSuccessRegister() {
    alert('Registration Success! You can now log in to your account');
    location.hash = '/login';
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
      <button type="submit">Register</button>`;
  }
}
