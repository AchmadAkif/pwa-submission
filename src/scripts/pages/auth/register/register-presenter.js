export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async handleRegister({ username, email, password }) {
    this.#view.showLoading();
    try {
      const response = await this.#model.postRegistration({
        username,
        email,
        password,
      });

      if (response.error) {
        console.error('API error:', response.message);
        return;
      }

      console.log(response);
      this.#view.handleSuccessRegister();
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      this.#view.hideLoading();
    }
  }
}
