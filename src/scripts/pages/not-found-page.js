export default class NotFoundPage {
    async render() {
      return `
        <section style="padding:2rem; text-align:center;">
          <h2>404 — Halaman Tidak Ditemukan</h2>
          <p>Maaf, halaman yang Anda tuju tidak tersedia.</p>
          <p><a href="#/" style="color:#3b82f6; text-decoration:none;">← Kembali ke Beranda</a></p>
        </section>
      `;
    }
    async afterRender() {
      // Tidak ada behaviour dinamis
    }
  }
  