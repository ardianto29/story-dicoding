// src/scripts/index.js

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

  // Render halaman pertama kali
  app.renderPage();

  // Re-render saat hash berubah
  window.addEventListener("hashchange", () => {
    app.renderPage();
  });
});
