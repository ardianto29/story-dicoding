import CONFIG from "../config.js";
// Tambahan untuk IndexedDB caching
import { saveStories, getAllCachedStories } from "../utils/db.js";

const BASE_URL = CONFIG.BASE_URL;

const ENDPOINT = {
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  STORIES: `${BASE_URL}/stories`,
  STORIES_GUEST: `${BASE_URL}/stories/guest`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  NOTIF_SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  NOTIF_UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`
};

export async function register({ name, email, password }) {
  const res = await fetch(ENDPOINT.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch(ENDPOINT.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

/**
 * Fetch semua stories:
 * - Jika online: fetch dari API, simpan ke IndexedDB, lalu return JSON.
 * - Jika offline / error: ambil dari IndexedDB lewat getAllCachedStories()
 */
export async function getAllStories(token, page = 1, size = 10, location = 0) {
  const url = new URL(ENDPOINT.STORIES);
  url.searchParams.set("page", page);
  url.searchParams.set("size", size);
  url.searchParams.set("location", location);

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const resJson = await res.json();

    // jika berhasil dan ada listStory, simpan ke IndexedDB
    if (!resJson.error && Array.isArray(resJson.listStory)) {
      await saveStories(resJson.listStory);
    }

    return resJson;
  } catch (error) {
    console.warn("Fetch STORIES gagal, fallback ke cache IndexedDB:", error);
    const cached = await getAllCachedStories();
    return { error: false, listStory: cached };
  }
}

export async function getStoryDetail(token, id) {
  const res = await fetch(ENDPOINT.STORY_DETAIL(id), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return res.json();
}

export async function addNewStory(token, { description, photo, lat, lon }) {
  const form = new FormData();
  form.append("description", description);
  form.append("photo", photo);
  if (lat != null) form.append("lat", lat);
  if (lon != null) form.append("lon", lon);

  const res = await fetch(ENDPOINT.STORIES, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  return res.json();
}

export async function addNewStoryGuest({ description, photo, lat, lon }) {
  const form = new FormData();
  form.append("description", description);
  form.append("photo", photo);
  if (lat != null) form.append("lat", lat);
  if (lon != null) form.append("lon", lon);

  const res = await fetch(ENDPOINT.STORIES_GUEST, {
    method: "POST",
    body: form
  });
  return res.json();
}

export async function subscribeNotification(token, subscription) {
  const res = await fetch(ENDPOINT.NOTIF_SUBSCRIBE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(subscription)
  });
  return res.json();
}

export async function unsubscribeNotification(token, { endpoint }) {
  const res = await fetch(ENDPOINT.NOTIF_UNSUBSCRIBE, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ endpoint })
  });
  return res.json();
}
