export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async handleLogin({ email, password }) {
    this.#view.showLoading();
    try {
      const response = await this.#model.postLogin({ email, password });

      if (response.error) {
        console.error('API error:', response.message);
        return;
      }

      this.#authModel.storeAccessToken(response.loginResult.token);
      this.#view.loginSuccess();
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      this.#view.hideLoading();
    }
  }
}
