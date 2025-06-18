const mongoose = require('mongoose');

const PeminjamanSchema = new mongoose.Schema({
  id_anggota: { type: mongoose.Schema.Types.ObjectId, ref: 'Anggota' },
  id_buku: { type: mongoose.Schema.Types.ObjectId, ref: 'Buku' },
  id_petugas: { type: mongoose.Schema.Types.ObjectId, ref: 'Petugas' },
  tanggal_pinjam: String,
  tanggal_kembali_rencana: String,
  tanggal_kembali_aktual: String,
  status_peminjaman: { type: String, enum: ['dipinjam', 'dikembalikan', 'terlambat'], default: 'dipinjam' },
  denda: { type: Number, default: 0 },
  hari_terlambat: { type: Number, default: 0 },
  terlambat: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: 'peminjaman' });

module.exports = mongoose.model('Peminjaman', PeminjamanSchema); 