# Final Project Sistem Basis Data

## Sistem Manajemen Perpustakaan

### Pengampu Mata Kuliah

Annisaa Sri Indrawanti, S. Kom., M. Kom

### Anggota

| Nama                     | NIM        |
| ------------------------ | ---------- |
| Binar Najmuddin Mahya    | 5027241101 |
| Raihan Fahri Ghazali     | 5027241061 |
| Ahmad Yazid Arifuddin    | 5027241040 |
| Muhammad Farrel Shaputra | 5027241110 |

---

## Deskripsi

Aplikasi ini merupakan sistem manajemen perpustakaan berbasis web yang dikembangkan sebagai Final Project untuk mata kuliah Sistem Basis Data. Sistem ini memudahkan pengelolaan data buku, anggota, petugas, transaksi peminjaman, pengembalian, dan laporan perpustakaan.

## Fitur Utama

- Manajemen Buku (CRUD, soft delete, trash)
- Manajemen Anggota (CRUD, status aktif/non-aktif, trash)
- Manajemen Petugas (CRUD, trash)
- Transaksi Peminjaman Buku (validasi stok, anggota aktif)
- Transaksi Pengembalian Buku (denda otomatis, validasi keterlambatan)
- Laporan & Statistik
- Fitur Trash (restore & hapus permanen)
- Pencarian & filter data
- UI responsif dan modern

## Cara Instalasi & Menjalankan

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd <nama-folder>
   ```
2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```
3. **Jalankan backend**
   ```bash
   cd server
   npm install
   npm start
   ```
4. **Jalankan frontend**
buka terminal baru dan jalankan command berikut:
   ```bash
   cd ../
   npm run dev
   # atau
   yarn dev
   ```
5. **Akses aplikasi**
   Buka browser ke [http://localhost:5173](http://localhost:5173)

## Teknologi yang Digunakan

- React.js (Frontend)
- Node.js + Express.js (Backend)
- MongoDB (Database)
- Tailwind CSS (UI)
- Axios (HTTP Client)

### Dokumentasi

## 1. CRUD Data Buku
![image](https://github.com/user-attachments/assets/d6821bb8-dc21-47a8-a616-d0f795cb1396)
## 2. CRUD Data Anggota
![image](https://github.com/user-attachments/assets/edce51c4-7c13-48ce-97d2-cba2a9c82f22)
## 3. CRUD Data Petugas
![image](https://github.com/user-attachments/assets/17fcbbac-6061-4e9b-b44b-f58a69ea4ac6)
## 4. Transaksi Peminjaman
![image](https://github.com/user-attachments/assets/9212d881-b201-4214-b824-0bb077b475bf)
## 5. Transaksi Pengembalian
![image](https://github.com/user-attachments/assets/d811d6a4-37ef-472e-b6ef-6069b8d605b3)
## 6. Laporan Buku Terpopuler & Anggota Teraktif
![image](https://github.com/user-attachments/assets/002f128f-2da5-4c6b-b10b-bb562200fed3)
![image](https://github.com/user-attachments/assets/385a748f-cdcc-4e14-bbd2-d146c0d513fc)
## 7. Delete data, otomatis masuk ke table “trash”
![image](https://github.com/user-attachments/assets/83960d6f-407d-4092-bca4-c647195e4a52)

---

> Final Project Sistem Basis Data - 2024