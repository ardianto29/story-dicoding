// src/scripts/pages/app.js
import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import "leaflet/dist/leaflet.css";

class App {
  #drawerButton;
  #navigationDrawer;
  #content;

  constructor({ drawerButton, navigationDrawer, content }) {
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#content = content;

    this.#setupDrawer();
  }

  #setupDrawer() {
    // 1) Toggle drawer + ikon hamburger ↔ X
    this.#drawerButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.#navigationDrawer.classList.toggle("open");
      const icon = this.#drawerButton.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    });

    // 2) Klik luar drawer → tutup + reset ikon
    document.body.addEventListener("click", (event) => {
      if (
        this.#navigationDrawer.classList.contains("open") &&
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
        const icon = this.#drawerButton.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });

    // 3) Klik link di drawer → tutup + reset ikon
    this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (this.#navigationDrawer.classList.contains("open")) {
          this.#navigationDrawer.classList.remove("open");
          const icon = this.#drawerButton.querySelector("i");
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];
    const container = this.#content;

    // 1) Fade‐out konten lama
    await container.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 200,
      fill: "forwards"
    }).finished;

    // 2) Ganti konten
    container.innerHTML = await page.render();
    await page.afterRender();

    // 3) Reset scroll & fade‐in konten baru
    container.scrollTop = 0;
    container.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 200,
      fill: "forwards"
    });
  }
}

export default App;
