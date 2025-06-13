const express = require('express');
const Anggota = require('../models/Anggota');
const router = express.Router();

// GET semua anggota
router.get('/', async (req, res) => {
  const anggota = await Anggota.find({ is_deleted: false });
  res.json(anggota);
});

// GET anggota by id
router.get('/:id', async (req, res) => {
  const anggota = await Anggota.findById(req.params.id);
  if (!anggota || anggota.is_deleted) return res.status(404).json({ message: 'Anggota tidak ditemukan' });
  res.json(anggota);
});

// POST tambah anggota
router.post('/', async (req, res) => {
  try {
    console.log('Menerima request tambah anggota:', req.body);
    const anggota = new Anggota(req.body);
    await anggota.save();
    console.log('Anggota berhasil disimpan:', anggota);
    res.status(201).json(anggota);
  } catch (err) {
    console.error('Gagal menyimpan anggota:', err);
    res.status(500).json({ message: 'Gagal menyimpan anggota', error: err.message });
  }
});

// PUT update anggota
router.put('/:id', async (req, res) => {
  const anggota = await Anggota.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_at: new Date() },
    { new: true }
  );
  if (!anggota) return res.status(404).json({ message: 'Anggota tidak ditemukan' });
  res.json(anggota);
});

// DELETE soft delete anggota
router.delete('/:id', async (req, res) => {
  const anggota = await Anggota.findByIdAndUpdate(
    req.params.id,
    { is_deleted: true, updated_at: new Date() },
    { new: true }
  );
  if (!anggota) return res.status(404).json({ message: 'Anggota tidak ditemukan' });
  res.json({ message: 'Anggota dihapus' });
});

module.exports = router; 