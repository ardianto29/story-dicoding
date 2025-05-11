import "../styles/styles.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// === Leaflet Marker Icon Fix ===
// Pastikan marker image muncul setelah build Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href
});
// === end Leaflet fix ===

// === IndexedDB helper ===
const DB_NAME = "StoryDicodingDB";
const DB_VERSION = 1;
const STORE_NAME = "stories";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Simpan data Story di IndexedDB (offline fallback)
 * @param {{ title: string, body: string, [key: string]: any }} data
 */
export async function saveStoryOffline(data) {
  const db = await openDatabase();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
    tx.objectStore(STORE_NAME).add(data);
  });
}

/**
 * Ambil semua Story yang tersimpan di IndexedDB
 */
export async function getAllStoriesOffline() {
  const db = await openDatabase();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

/**
 * Hapus Story tertentu dari IndexedDB
 * @param {number} id
 */
export async function deleteStoryOffline(id) {
  const db = await openDatabase();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
    tx.objectStore(STORE_NAME).delete(id);
  });
}
// === end IndexedDB helper ===

// Daftarkan Service Worker (jika didukung)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW terdaftar:", reg))
      .catch((err) => console.error("SW gagal daftar:", err));
  });
}

import App from "./pages/app";

document.addEventListener("DOMContentLoaded", () => {
  const drawerButton = document.querySelector("#drawer-button");
  const navigationDrawer = document.querySelector("#navigation-drawer");
  const content = document.querySelector("#main-content");

  const skipLink = document.querySelector(".skip-link");
  if (skipLink && content) {
    skipLink.addEventListener("click", (e) => {
      e.preventDefault();
      content.focus();
    });
  }

  const app = new App({ drawerButton, navigationDrawer, content });

  // Bungkus app.renderPage() dengan View Transition API
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
