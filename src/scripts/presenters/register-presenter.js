import { register } from "../data/api.js";

export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    // render sudah di-handle di page, setelah page-masuk baru bind
    this.view.bindSubmit(this.handleRegister.bind(this));
  }

  async handleRegister({ name, email, password }) {
    const { error, message } = await register({ name, email, password });
    this.view.showMessage(message);
    if (!error) {
      this.view.redirectToLogin();
    }
  }
}
