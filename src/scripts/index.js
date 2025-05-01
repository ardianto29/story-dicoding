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
  const drawerButton = document.querySelector("#drawer-button");
  const navigationDrawer = document.querySelector("#navigation-drawer");
  const content = document.querySelector("#main-content");

  const app = new App({ drawerButton, navigationDrawer, content });

  // Fungsi pembungkus renderPage dengan View Transition API
  const renderWithTransition = async () => {
    const doRender = () => app.renderPage();
    if ("startViewTransition" in document) {
      await document.startViewTransition(doRender);
    } else {
      doRender();
    }
  };

  // Render halaman pertama kali
  renderWithTransition();

  // Re-render saat hash berubah (navigasi SPA)
  window.addEventListener("hashchange", () => {
    renderWithTransition();
  });
});
