const mongoose = require('mongoose');

const BukuSchema = new mongoose.Schema({
  judul_buku: String,
  pengarang: String,
  penerbit: String,
  tahun_terbit: Number,
  isbn: String,
  kategori: String,
  jumlah_stok: Number,
  lokasi_rak: String,
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Buku', BukuSchema, 'buku'); 