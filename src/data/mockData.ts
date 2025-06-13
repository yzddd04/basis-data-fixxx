import { Buku, Anggota, Petugas, Peminjaman } from '../types';

export const mockBuku: Buku[] = [
  {
    id_buku: '1',
    judul_buku: "Laskar Pelangi",
    pengarang: "Andrea Hirata",
    penerbit: "Bentang Pustaka",
    tahun_terbit: 2005,
    isbn: "978-979-3062-79-2",
    kategori: "Fiksi",
    jumlah_stok: 5,
    lokasi_rak: "A1-01",
    is_deleted: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id_buku: '2',
    judul_buku: "Bumi Manusia",
    pengarang: "Pramoedya Ananta Toer",
    penerbit: "Lentera Dipantara",
    tahun_terbit: 1980,
    isbn: "978-979-565-748-3",
    kategori: "Sejarah",
    jumlah_stok: 3,
    lokasi_rak: "B2-15",
    is_deleted: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id_buku: '3',
    judul_buku: "Algoritma dan Pemrograman",
    pengarang: "Dr. Rinaldi Munir",
    penerbit: "Informatika",
    tahun_terbit: 2022,
    isbn: "978-602-1514-99-7",
    kategori: "Teknologi",
    jumlah_stok: 8,
    lokasi_rak: "C3-08",
    is_deleted: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id_buku: '4',
    judul_buku: "Sang Pemimpi",
    pengarang: "Andrea Hirata",
    penerbit: "Bentang Pustaka",
    tahun_terbit: 2006,
    isbn: "978-979-3062-80-8",
    kategori: "Fiksi",
    jumlah_stok: 4,
    lokasi_rak: "A1-02",
    is_deleted: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id_buku: '5',
    judul_buku: "Matematika Diskrit",
    pengarang: "Dr. Munir",
    penerbit: "Informatika",
    tahun_terbit: 2021,
    isbn: "978-602-1514-88-1",
    kategori: "Teknologi",
    jumlah_stok: 6,
    lokasi_rak: "C3-09",
    is_deleted: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  }
];

export const mockAnggota: Anggota[] = [
  {
    id_anggota: '1',
    nama_lengkap: "Ahmad Rizki Pratama",
    nomor_anggota: "AGT001",
    alamat: "Jl. Merdeka No. 123, Jakarta",
    telepon: "081234567890",
    email: "ahmad.rizki@email.com",
    tanggal_daftar: "2024-01-10",
    status_aktif: "aktif",
    is_deleted: false,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-10T08:00:00Z"
  },
  {
    id_anggota: '2',
    nama_lengkap: "Siti Nurhaliza",
    nomor_anggota: "AGT002",
    alamat: "Jl. Sudirman No. 456, Bandung",
    telepon: "081234567891",
    email: "siti.nurhaliza@email.com",
    tanggal_daftar: "2024-01-12",
    status_aktif: "aktif",
    is_deleted: false,
    created_at: "2024-01-12T08:00:00Z",
    updated_at: "2024-01-12T08:00:00Z"
  },
  {
    id_anggota: '3',
    nama_lengkap: "Budi Santoso",
    nomor_anggota: "AGT003",
    alamat: "Jl. Gatot Subroto No. 789, Surabaya",
    telepon: "081234567892",
    email: "budi.santoso@email.com",
    tanggal_daftar: "2024-01-15",
    status_aktif: "aktif",
    is_deleted: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id_anggota: '4',
    nama_lengkap: "Diana Sari",
    nomor_anggota: "AGT004",
    alamat: "Jl. Thamrin No. 321, Jakarta",
    telepon: "081234567893",
    email: "diana.sari@email.com",
    tanggal_daftar: "2024-01-18",
    status_aktif: "aktif",
    is_deleted: false,
    created_at: "2024-01-18T08:00:00Z",
    updated_at: "2024-01-18T08:00:00Z"
  }
];

export const mockPetugas: Petugas[] = [
  {
    id_petugas: 1,
    nama_petugas: "Budi Santoso",
    jabatan: "Kepala Perpustakaan",
    telepon: "081234567892",
    alamat: "Jl. Gatot Subroto No. 789, Jakarta",
    is_deleted: false,
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z"
  },
  {
    id_petugas: 2,
    nama_petugas: "Diana Sari",
    jabatan: "Pustakawan",
    telepon: "081234567893",
    alamat: "Jl. Thamrin No. 321, Jakarta",
    is_deleted: false,
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z"
  },
  {
    id_petugas: 3,
    nama_petugas: "Eko Prasetyo",
    jabatan: "Petugas Sirkulasi",
    telepon: "081234567894",
    alamat: "Jl. Diponegoro No. 654, Jakarta",
    is_deleted: false,
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z"
  }
];

export const mockPeminjaman: Peminjaman[] = [
  {
    id_peminjaman: '1',
    id_anggota: '1',
    id_buku: '1',
    id_petugas: '1',
    tanggal_pinjam: "2024-01-20",
    tanggal_kembali_rencana: "2024-01-27",
    tanggal_kembali_aktual: undefined,
    status_peminjaman: "dipinjam",
    denda: 0,
    catatan: "Peminjaman normal",
    is_deleted: false,
    created_at: "2024-01-20T08:00:00Z",
    updated_at: "2024-01-20T08:00:00Z"
  },
  {
    id_peminjaman: '2',
    id_anggota: '2',
    id_buku: '2',
    id_petugas: '2',
    tanggal_pinjam: "2024-01-15",
    tanggal_kembali_rencana: "2024-01-22",
    tanggal_kembali_aktual: "2024-01-25",
    status_peminjaman: "dikembalikan",
    denda: 3000,
    catatan: "Terlambat 3 hari",
    is_deleted: false,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-25T08:00:00Z"
  },
  {
    id_peminjaman: '3',
    id_anggota: '3',
    id_buku: '3',
    id_petugas: '1',
    tanggal_pinjam: "2024-01-18",
    tanggal_kembali_rencana: "2024-01-25",
    tanggal_kembali_aktual: undefined,
    status_peminjaman: "dipinjam",
    denda: 0,
    catatan: undefined,
    is_deleted: false,
    created_at: "2024-01-18T08:00:00Z",
    updated_at: "2024-01-18T08:00:00Z"
  },
  {
    id_peminjaman: '4',
    id_anggota: '4',
    id_buku: '4',
    id_petugas: '2',
    tanggal_pinjam: "2024-01-10",
    tanggal_kembali_rencana: "2024-01-17",
    tanggal_kembali_aktual: undefined,
    status_peminjaman: "terlambat",
    denda: 8000,
    catatan: "Sudah terlambat 8 hari",
    is_deleted: false,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-25T08:00:00Z"
  }
];