const mongoose = require('mongoose');

const AnggotaSchema = new mongoose.Schema({
  nama_lengkap: String,
  nomor_anggota: String,
  alamat: String,
  telepon: String,
  email: String,
  tanggal_daftar: String,
  status_aktif: { type: String, enum: ['aktif', 'non-aktif'], default: 'aktif' },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: 'anggota' });

module.exports = mongoose.model('Anggota', AnggotaSchema); 