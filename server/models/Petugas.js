const mongoose = require('mongoose');

const PetugasSchema = new mongoose.Schema({
  nama_petugas: String,
  jabatan: {
    type: String,
    enum: ['asisten pustakawan', 'pustakawan', 'petugas administrasi'],
    required: true
  },
  telepon: String,
  alamat: String,
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: 'petugas' });

module.exports = mongoose.model('Petugas', PetugasSchema); 