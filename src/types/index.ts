// Database Types berdasarkan schema yang diminta
export interface Buku {
  id_buku: string;
  judul_buku: string;
  pengarang: string;
  penerbit: string;
  tahun_terbit: number;
  isbn: string;
  kategori: string;
  jumlah_stok: number;
  lokasi_rak: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Anggota {
  id_anggota: string;
  nama_lengkap: string;
  nomor_anggota: string;
  alamat: string;
  telepon: string;
  email: string;
  tanggal_daftar: string;
  status_aktif: 'aktif' | 'non-aktif';
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Petugas {
  id_petugas: string;
  nama_petugas: string;
  jabatan: string;
  telepon: string;
  alamat: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Peminjaman {
  id_peminjaman: string;
  id_anggota: string;
  id_buku: string;
  id_petugas: string;
  tanggal_pinjam: string;
  tanggal_kembali_rencana: string;
  tanggal_kembali_aktual?: string;
  status_peminjaman: 'dipinjam' | 'dikembalikan' | 'terlambat';
  denda: number;
  catatan?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  // Relasi untuk tampilan
  anggota?: Anggota;
  buku?: Buku;
  petugas?: Petugas;
}

export interface Sampah {
  id_sampah: number;
  nama_tabel: string;
  id_data_asli: string;
  data_backup: string;
  dihapus_oleh: string;
  tanggal_dihapus: string;
  created_at: string;
}

export interface DashboardStats {
  total_buku: number;
  total_anggota: number;
  total_peminjaman_aktif: number;
  total_terlambat: number;
  total_denda: number;
}

export interface ReportBukuPopuler {
  id_buku: string;
  judul_buku: string;
  pengarang: string;
  jumlah_peminjaman: number;
}

export interface ReportAnggotaAktif {
  id_anggota: number;
  nama_lengkap: string;
  nomor_anggota: string;
  jumlah_peminjaman: number;
  status_peminjaman_aktif: number;
}

// Context Types
export interface LibraryContextType {
  // Data
  buku: Buku[];
  anggota: Anggota[];
  petugas: Petugas[];
  peminjaman: Peminjaman[];
  sampah: Sampah[];

  // Buku operations
  addBuku: (buku: Omit<Buku, 'id_buku' | 'created_at' | 'updated_at'>) => void;
  updateBuku: (id: string, updates: Partial<Buku>) => void;
  deleteBuku: (id: string, deletedBy: string) => void;
  restoreBuku: (id: string) => void;

  // Anggota operations
  addAnggota: (anggota: Omit<Anggota, 'id_anggota' | 'nomor_anggota' | 'created_at' | 'updated_at'>) => void;
  updateAnggota: (id: string, updates: Partial<Anggota>) => void;
  deleteAnggota: (id: string, deletedBy: string) => void;
  restoreAnggota: (id: string) => void;

  // Petugas operations
  addPetugas: (petugas: Omit<Petugas, 'id_petugas' | 'created_at' | 'updated_at'>) => void;
  updatePetugas: (id: string, updates: Partial<Petugas>) => void;
  deletePetugas: (id: string, deletedBy: string) => void;
  restorePetugas: (id: string) => void;

  // Peminjaman operations
  addPeminjaman: (peminjaman: Omit<Peminjaman, 'id_peminjaman' | 'created_at' | 'updated_at'>) => void;
  updatePeminjaman: (id: string, updates: Partial<Peminjaman>) => void;
  processReturn: (id_peminjaman: string, tanggal_kembali: string) => void;
  calculateFine: (tanggal_rencana: string, tanggal_aktual: string) => number;

  // Utility functions
  getBukuById: (id: string) => Buku | undefined;
  getAnggotaById: (id: string) => Anggota | undefined;
  getPetugasById: (id: string) => Petugas | undefined;
  getActivePeminjamanByAnggota: (id_anggota: string) => Peminjaman[];

  // Global date untuk simulasi
  globalDate: Date;

  // Trash operations
  restoreFromTrash: (id_sampah: number) => void;
  permanentDelete: (id_sampah: number) => void;

  // Stats
  getStats: () => {
    totalBuku: number;
    totalAnggota: number;
    totalPeminjaman: number;
    totalTerlambat: number;
    totalDenda: number;
  };
  getStatsWithGrowth: () => {
    bukuGrowth: number;
    anggotaGrowth: number;
    peminjamanGrowth: number;
  };

  getPeminjamanFromBackend: () => void;
}