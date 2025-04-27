import "../styles/styles.css";
import "leaflet/dist/leaflet.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => console.log("SW registered:", reg))
    .catch((err) => console.error("SW registration failed:", err));
}

import App from "./pages/app";

document.addEventListener("DOMContentLoaded", () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer")
  });

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      app.renderPage();
    });
  } else {
    app.renderPage();
  }

  window.addEventListener("hashchange", () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        app.renderPage();
      });
    } else {
      app.renderPage();
    }
  });
});
