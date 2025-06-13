const express = require('express');
const Peminjaman = require('../models/Peminjaman');
const router = express.Router();

// GET semua peminjaman
router.get('/', async (req, res) => {
  const peminjaman = await Peminjaman.find({ is_deleted: false });
  res.json(peminjaman);
});

// GET peminjaman by id
router.get('/:id', async (req, res) => {
  const peminjaman = await Peminjaman.findById(req.params.id);
  if (!peminjaman || peminjaman.is_deleted) return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
  res.json(peminjaman);
});

// POST tambah peminjaman
router.post('/', async (req, res) => {
  const peminjaman = new Peminjaman(req.body);
  await peminjaman.save();
  // Update stok buku setelah peminjaman
  const Buku = require('../models/Buku');
  const buku = await Buku.findById(req.body.id_buku);
  if (buku && buku.jumlah_stok > 0) {
    buku.jumlah_stok -= 1;
    buku.updated_at = new Date();
    await buku.save();
  }
  res.status(201).json(peminjaman);
});

// PUT update peminjaman
router.put('/:id', async (req, res) => {
  let updateData = { ...req.body, updated_at: new Date() };
  if (req.body.tanggal_kembali_aktual && req.body.tanggal_kembali_rencana) {
    const tglAktual = new Date(req.body.tanggal_kembali_aktual);
    const tglRencana = new Date(req.body.tanggal_kembali_rencana);
    if (tglAktual > tglRencana) {
      const hariTerlambat = Math.ceil((tglAktual - tglRencana) / (1000 * 60 * 60 * 24));
      updateData.hari_terlambat = hariTerlambat;
      updateData.terlambat = true;
    } else {
      updateData.hari_terlambat = 0;
      updateData.terlambat = false;
    }
  }
  const peminjaman = await Peminjaman.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );
  if (!peminjaman) return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
  res.json(peminjaman);
});

// DELETE soft delete peminjaman
router.delete('/:id', async (req, res) => {
  const peminjaman = await Peminjaman.findByIdAndUpdate(
    req.params.id,
    { is_deleted: true, updated_at: new Date() },
    { new: true }
  );
  if (!peminjaman) return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
  res.json({ message: 'Peminjaman dihapus' });
});

// DELETE permanent peminjaman
router.delete('/permanent/:id', async (req, res) => {
  const peminjaman = await Peminjaman.findByIdAndDelete(req.params.id);
  if (!peminjaman) return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
  res.json({ message: 'Peminjaman dihapus permanen' });
});

module.exports = router; 