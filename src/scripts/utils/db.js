const DB_NAME = "story-dicoding-db";
const DB_VERSION = 3;
const STORE_NAME = "favorites";
const BOOKMARK_STORE = "bookmarks";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // existing favorites store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
      // new bookmarks store
      if (!db.objectStoreNames.contains(BOOKMARK_STORE)) {
        db.createObjectStore(BOOKMARK_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

/** Ambil semua story yang di–bookmark */
export async function getAllFavorites() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Ambil satu story berdasarkan ID (atau undefined jika belum di–bookmark) */
export async function getFavorite(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Tambah atau update satu story ke favorites */
export async function addFavorite(story) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(story);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Hapus story dari favorites */
export async function removeFavorite(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** =============================== */
/** Fungsi–fungsi baru untuk Bookmark */
/** =============================== */

// --- BOOKMARK (baru ditambahkan) ---
export async function getAllBookmarks() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKMARK_STORE, "readonly");
    const store = tx.objectStore(BOOKMARK_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addBookmark(story) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKMARK_STORE, "readwrite");
    const store = tx.objectStore(BOOKMARK_STORE);
    const req = store.put(story);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function removeBookmark(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BOOKMARK_STORE, "readwrite");
    const store = tx.objectStore(BOOKMARK_STORE);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
