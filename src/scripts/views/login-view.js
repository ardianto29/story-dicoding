export default class LoginView {
    getTemplate() {
      return `
        <section class="login">
          <h2>Login</h2>
          <form id="login-form">
            <label>Email:
              <input type="email" name="email" required>
            </label>
            <label>Password:
              <input type="password" name="password" required>
            </label>
            <button type="submit">Masuk</button>
          </form>
        </section>
      `;
    }
  
    bindLogin(handler) {
      const form = document.getElementById('login-form');
      form.addEventListener('submit', e => {
        e.preventDefault();
        handler({
          email:    form.email.value,
          password: form.password.value,
        });
      });
    }
  
    showError(msg) {
      alert(msg);
    }
  
    redirectToHome() {
      window.location.hash = '/';
    }
  }
  