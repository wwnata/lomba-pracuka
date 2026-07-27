# 🏕️ ITA JAMNAS & LT II - Sistem Manajemen Lomba Pramuka

Aplikasi web berbasis *frontend* mandiri (*standalone*) yang dirancang khusus untuk mendata peserta, menampilkan jadwal kegiatan, serta mengelola klasemen nilai secara *real-time* untuk ajang **Lomba Tingkat II & Ikut Serta Jambore Nasional (ITA JAMNAS) Kwartir Ranting**[cite: 1].

## ✨ Fitur Utama
* **Halaman Publik Interaktif**: Menyediakan informasi beranda, profil kegiatan, agenda jadwal, daftar peserta, dan klasemen nilai terpisah (Kategori SD & SMP)[cite: 1].
* **Panel Admin Terproteksi**: Digunakan untuk menambah, mengubah, atau menghapus data peserta dan nilai perlombaan[cite: 1].
* **Akses Admin Tersembunyi**: 
  * Menggunakan *shortcut* keyboard `Ctrl + Alt + A`[cite: 1].
  * Mengetuk logo utama sebanyak 5 kali secara cepat[cite: 1].
* **Penyimpanan Lokal (LocalStorage)**: Dirancang agar ringan dan dapat dioperasikan secara mandiri[cite: 1].

## 🛠️ Teknologi yang Digunakan
* **HTML5 & CSS3**: Desain antarmuka modern, bersih, dan responsif untuk berbagai ukuran layar (*mobile-friendly*).
* **JavaScript (Vanilla)**: Logika sistem, pengolahan data tabel, dan interaksi halaman dinamis.
* **Vercel Automation & Security**:
  * Menggunakan `javascript-obfuscator` untuk mengamankan skrip logika dari *Inspect Element*.
  * Menggunakan `html-minifier-terser` untuk memadatkan kode saat proses *deploy* otomatis.

## 🚀 Panduan Singkat
Repositori ini dikonfigurasi dengan *build script* kustom di Vercel untuk mengotomatiskan proses penyalinan aset gambar serta pengamanan kode secara berkala setiap kali ada pembaruan (*push*) ke GitHub.
