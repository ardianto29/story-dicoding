import RegisterView      from '../views/register-view.js';
import RegisterPresenter from '../presenters/register-presenter.js';

export default class RegisterPage {
    // Hanya kembalikan template HTML
    async render() {
      const view = new RegisterView();
      return view.getTemplate();
    }
  
    // Setelah HTML terpasang, panggil presenter untuk bind event
    async afterRender() {
      const view = new RegisterView();
      const presenter = new RegisterPresenter(view);
      presenter.init();
    }
  }