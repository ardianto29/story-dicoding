import CONFIG from "../config.js";
const VAPID_PUBLIC_KEY = CONFIG.VAPID_PUBLIC_KEY;
import { getToken } from "./index.js";
import { subscribeNotification, unsubscribeNotification } from "../data/api.js";

// helper untuk convert key VAPID
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// helper untuk mendapatkan atau mendaftarkan SW
async function getSWRegistration() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker tidak didukung di browser ini.");
  }
  // coba ambil registrasi yang sudah ada
  let registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    try {
      registration = await navigator.serviceWorker.register("/sw.js");
    } catch (err) {
      throw new Error(
        "Gagal memuat Service Worker. Pastikan dijalankan di HTTPS atau di localhost."
      );
    }
  }
  return registration;
}

export async function subscribePush() {
    // 1️⃣ Minta izin notifikasi dulu
    if (Notification.permission === 'default') {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        // kalau user tolak, hentikan
        throw new Error('Izin notifikasi ditolak.');
      }
    }
    if (Notification.permission !== 'granted') {
      throw new Error(
        'Notifikasi belum diizinkan. Silakan cek pengaturan browser Anda.'
      );
    }
  
    // 2️⃣ Dapatkan ServiceWorker registration (atau daftar jika belum)
    const registration = await getSWRegistration();
  
    // 3️⃣ Baru subscribe ke PushManager
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  
    // 4️⃣ Kirim info subscription ke backend
    const token = getToken();
    const payload = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(sub.getKey('p256dh')))),
        auth:   btoa(String.fromCharCode(...new Uint8Array(sub.getKey('auth')))),
      },
    };
    return subscribeNotification(token, payload);
  }

export async function unsubscribePush() {
  const registration = await getSWRegistration();
  const sub = await registration.pushManager.getSubscription();
  if (!sub) {
    throw new Error("Belum berlangganan notifikasi.");
  }

  const token = getToken();
  await unsubscribeNotification(token, { endpoint: sub.endpoint });
  return sub.unsubscribe();
}
