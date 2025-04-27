export default class RegisterView {
  getTemplate() {
    return `
        <section class="register">
          <h2>Register</h2>
          <form id="register-form">
            <label>Nama: <input name="name" required></label>
            <label>Email: <input type="email" name="email" required></label>
            <label>Password: <input type="password" name="password" minlength="8" required></label>
            <button type="submit">Daftar</button>
          </form>
        </section>
      `;
  }

  bindSubmit(handler) {
    const form = document.getElementById("register-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value
      };
      handler(data);
    });
  }

  showMessage(msg) {
    alert(msg);
  }

  redirectToLogin() {
    window.location.hash = "/login";
  }
}
