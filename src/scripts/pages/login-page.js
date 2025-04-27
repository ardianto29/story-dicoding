import LoginView      from '../views/login-view.js';
import LoginPresenter from '../presenters/login-presenter.js';

export default class LoginPage {
  async render() {
    const view = new LoginView();
    return view.getTemplate();
  }

  async afterRender() {
    const view = new LoginView();
    const presenter = new LoginPresenter(view);
    presenter.init();
  }
}