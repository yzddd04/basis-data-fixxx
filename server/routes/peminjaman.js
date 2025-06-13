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
  res.status(201).json(peminjaman);
});

// PUT update peminjaman
router.put('/:id', async (req, res) => {
  const peminjaman = await Peminjaman.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_at: new Date() },
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

module.exports = router; 