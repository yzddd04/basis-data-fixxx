const express = require('express');
const Petugas = require('../models/Petugas');
const router = express.Router();

// GET semua petugas (termasuk yang soft delete)
router.get('/all', async (req, res) => {
  const petugas = await Petugas.find();
  res.json(petugas);
});

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

// DELETE petugas (soft delete)
router.delete('/:id', async (req, res) => {
  const petugas = await Petugas.findByIdAndUpdate(
    req.params.id,
    { is_deleted: true, updated_at: new Date() },
    { new: true }
  );
  if (!petugas) return res.status(404).json({ message: 'Petugas tidak ditemukan' });
  res.json({ message: 'Petugas berhasil dihapus' });
});

// DELETE permanent petugas
router.delete('/permanent/:id', async (req, res) => {
  const petugas = await Petugas.findByIdAndDelete(req.params.id);
  if (!petugas) return res.status(404).json({ message: 'Petugas tidak ditemukan' });
  res.json({ message: 'Petugas dihapus permanen' });
});

module.exports = router; 