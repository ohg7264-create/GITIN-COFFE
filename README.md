# ☕ Aksara POS - Sistem Kasir & Manajemen Stok Pintar

Aplikasi Point of Sale (POS) modern berbasis web yang dirancang khusus untuk kafe, coffee shop, restoran, dan gerai FnB. Dilengkapi dengan kustomisasi minuman/makanan, manajemen stok otomatis, pencetakan struk printer thermal (58mm/80mm), pembayaran digital QRIS dinamis, dasbor analitik real-time, dan sistem backup database berkala.

---

## ✨ Fitur Utama

- **🛒 Antarmuka Kasir (POS) Responsif**
  - Kustomisasi ukuran (*Size* S/M/L), takaran gula (*Sugar* 25%/50%/75%), dan es batu (*Ice* 25%/50%/75%).
  - Pilihan topping interaktif (*Gold Pearl, Rainbow Jelly, Cherry Pearl, Pearl, Mango Pudding, Aloe Vera*).
  - Panel rincian pesanan (*Bill*) yang rapi dengan kalkulasi subtotal, pajak PPN, dan diskon otomatis.

- **📦 Manajemen Stok Barang Real-Time**
  - Pengurangan stok otomatis setiap kali transaksi berhasil diselesaikan.
  - Peringatan stok menipis (*Low Stock Alert*) dan indikator stok habis.
  - Fitur **Restock Cepat (+)** dan **Koreksi Stok Keluar (-)** beserta pencatatan alasan.
  - Log audit perpindahan dan mutasi stok (*Stock Movement History*).

- **🖨️ Dukungan Cetak Struk Printer Thermal**
  - Format cetak standar ESC/POS untuk ukuran kertas **58mm** (printer Bluetooth mini) dan **80mm** (printer kasir standar).
  - Tampilan struk rapi dengan font monospace, garis putus-putus, rincian item, subtotal, pajak, kembalian, simulasi barcode, dan catatan kaki kustom.
  - Terintegrasi langsung dengan dialog print browser (`window.print()` dengan styling khusus `@media print`).
  - Fitur salin teks struk ke clipboard.

- **💳 Pembayaran Fleksibel (Tunai & Digital)**
  - **Tunai / Cash**: Tombol nominal cepat (*Uang Pas, Rp 50.000, Rp 100.000, dst.*) dan kalkulator uang kembalian otomatis.
  - **QRIS Dinamis**: Tampilan kode QRIS resmi dengan batas waktu pembayaran (*countdown timer*) dan simulasi konfirmasi instan.
  - **Kartu EDC / Debit**: Pilihan bank penerbit (BCA, Mandiri, BRI, BNI) dan pencatatan nomor otorisasi EDC.
  - **E-Wallet**: Dukungan GoPay, OVO, dan DANA.

- **📊 Laporan Penjualan Harian Otomatis**
  - Rekap harian otomatis (pendapatan kotor, penjualan bersih, total transaksi, rata-rata nilai struk, dan pajak terkumpul).
  - Pembagian omzet berdasarkan metode pembayaran.
  - Peringkat 5 produk terlaris (*Top Selling Products*).
  - Filter riwayat transaksi berdasarkan tanggal & tombol **Ekspor CSV**.

- **📈 Dasbor Analitik Real-Time**
  - Grafik distribusi penjualan per jam untuk memantau jam sibuk kafe (*Peak Hours*).
  - Proporsi kontribusi pendapatan antara kategori minuman (*Drink*) dan makanan (*Food*).
  - Peringkat menu favorit pelanggan.

- **🗂️ CRUD Master Data Lengkap**
  - Kelola Master Produk, Kategori, Topping Add-on, dan Pengguna/Kasir.

- **💾 Sistem Backup & Pemulihan Database**
  - Unduh cadangan seluruh data ke dalam file `.JSON` kapan saja.
  - Pulihkan / Restore database dari file cadangan `.JSON`.
  - Opsi reset ke data awal demo.

- **🌓 Mode Gelap & Bahasa Indonesia**
  - Dukungan tema Gelap (Dark Mode) dan Terang (Light Mode).
  - Bahasa Indonesia standar dengan format mata uang Rupiah (`Rp`).

---

## 🔐 Akun Demo Bawaan

| Nama Pengguna | Username | Peran (Role) | PIN Keamanan |
| :--- | :--- | :--- | :--- |
| **Gitin Arifysa Fadilah** | `gitin` | Kasir | `1234` |
| **Budi Santoso** | `admin` | Administrator | `8888` |

---

## 🚀 Panduan Menjalankan Proyek Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18+ disarankan)
- [npm](https://www.npmjs.com/) atau [bun](https://bun.sh/)

### 1. Klon Repositori
```bash
git clone https://github.com/<username>/<nama-repo>.git
cd <nama-repo>
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses `http://localhost:3000`.

### 4. Build untuk Produksi
```bash
npm run build
```
Hasil build akan tersimpan di direktori `dist/` dan siap dideploy ke platform hosting seperti Vercel, Netlify, atau Cloudflare Pages.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Testing**: Node.js Test Runner (`node:test`) + `tsx`

---

## 📄 Lisensi

Distributed under the Apache-2.0 License.
