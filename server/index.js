const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Logging setiap request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// CORS lebih fleksibel
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: '*', // izinkan semua header
  credentials: true // jika butuh cookie/auth
}));

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/manajemen_perpustakaan', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB (manajemen_perpustakaan)');
});

app.get('/', (req, res) => {
  res.send('API Perpustakaan siap!');
});

const bukuRouter = require('./routes/buku');
const anggotaRouter = require('./routes/anggota');
const petugasRouter = require('./routes/petugas');
const peminjamanRouter = require('./routes/peminjaman');
app.use('/api/buku', bukuRouter);
app.use('/api/anggota', anggotaRouter);
app.use('/api/petugas', petugasRouter);
app.use('/api/peminjaman', peminjamanRouter);

// TODO: Tambahkan routing CRUD untuk buku, anggota, petugas, peminjaman

const PORT = 5050;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
}); 