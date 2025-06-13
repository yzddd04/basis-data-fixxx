const express = require('express');
const Buku = require('../models/Buku');
const router = express.Router();

// GET semua buku
router.get('/', async (req, res) => {
  const buku = await Buku.find({ is_deleted: false });
  res.json(buku);
});

// GET buku by id
router.get('/:id', async (req, res) => {
  const buku = await Buku.findById(req.params.id);
  if (!buku || buku.is_deleted) return res.status(404).json({ message: 'Buku tidak ditemukan' });
  res.json(buku);
});

// POST tambah buku
router.post('/', async (req, res) => {
  const buku = new Buku(req.body);
  await buku.save();
  res.status(201).json(buku);
});

// PUT update buku
router.put('/:id', async (req, res) => {
  const buku = await Buku.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_at: new Date() },
    { new: true }
  );
  if (!buku) return res.status(404).json({ message: 'Buku tidak ditemukan' });
  res.json(buku);
});

// DELETE soft delete buku
router.delete('/:id', async (req, res) => {
  const buku = await Buku.findByIdAndUpdate(
    req.params.id,
    { is_deleted: true, updated_at: new Date() },
    { new: true }
  );
  if (!buku) return res.status(404).json({ message: 'Buku tidak ditemukan' });
  res.json({ message: 'Buku dihapus' });
});

// DELETE permanent buku
router.delete('/permanent/:id', async (req, res) => {
  const buku = await Buku.findByIdAndDelete(req.params.id);
  if (!buku) return res.status(404).json({ message: 'Buku tidak ditemukan' });
  res.json({ message: 'Buku dihapus permanen' });
});

module.exports = router; 