import { login } from '../data/api.js';
import { setToken } from '../utils/index.js';

export default class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    // Bind event login
    this.view.bindLogin(this.handleLogin.bind(this));
  }

  async handleLogin({ email, password }) {
    const { error, loginResult } = await login({ email, password });
    if (error) {
      this.view.showError('Login gagal');
    } else {
      setToken(loginResult.token);
      this.view.redirectToHome();
    }
  }
}
