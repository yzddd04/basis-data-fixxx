const express = require('express');
const Petugas = require('../models/Petugas');
const router = express.Router();

// GET semua petugas
router.get('/', async (req, res) => {
  const petugas = await Petugas.find({ is_deleted: false });
  res.json(petugas);
});

// GET petugas by id
router.get('/:id', async (req, res) => {
  const petugas = await Petugas.findById(req.params.id);
  if (!petugas || petugas.is_deleted) return res.status(404).json({ message: 'Petugas tidak ditemukan' });
  res.json(petugas);
});

// POST tambah petugas
router.post('/', async (req, res) => {
  const petugas = new Petugas(req.body);
  await petugas.save();
  res.status(201).json(petugas);
});

// PUT update petugas
router.put('/:id', async (req, res) => {
  const petugas = await Petugas.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_at: new Date() },
    { new: true }
  );
  if (!petugas) return res.status(404).json({ message: 'Petugas tidak ditemukan' });
  res.json(petugas);
});

// DELETE soft delete petugas
router.delete('/:id', async (req, res) => {
  const petugas = await Petugas.findByIdAndUpdate(
    req.params.id,
    { is_deleted: true, updated_at: new Date() },
    { new: true }
  );
  if (!petugas) return res.status(404).json({ message: 'Petugas tidak ditemukan' });
  res.json({ message: 'Petugas dihapus' });
});

module.exports = router; 