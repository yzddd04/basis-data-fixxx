-- DDL (Data Definition Language)
-- Create database
CREATE DATABASE IF NOT EXISTS db_perpustakaan;
USE db_perpustakaan;

-- Create table petugas
CREATE TABLE petugas (
    id_petugas INT PRIMARY KEY AUTO_INCREMENT,
    nip VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jabatan VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    no_telepon VARCHAR(15) NOT NULL,
    alamat TEXT NOT NULL,
    tanggal_lahir DATE NOT NULL,
    status ENUM('Aktif', 'Tidak Aktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table anggota
CREATE TABLE anggota (
    id_anggota INT PRIMARY KEY AUTO_INCREMENT,
    nomor_anggota VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    no_telepon VARCHAR(15) NOT NULL,
    alamat TEXT NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    status ENUM('Aktif', 'Tidak Aktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table buku
CREATE TABLE buku (
    id_buku INT PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    judul VARCHAR(200) NOT NULL,
    penulis VARCHAR(100) NOT NULL,
    penerbit VARCHAR(100) NOT NULL,
    tahun_terbit YEAR NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    jumlah_halaman INT NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table peminjaman
CREATE TABLE peminjaman (
    id_peminjaman INT PRIMARY KEY AUTO_INCREMENT,
    id_anggota INT NOT NULL,
    id_petugas INT NOT NULL,
    tanggal_pinjam DATE NOT NULL,
    tanggal_kembali DATE NOT NULL,
    status ENUM('Dipinjam', 'Dikembalikan', 'Terlambat') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_anggota) REFERENCES anggota(id_anggota),
    FOREIGN KEY (id_petugas) REFERENCES petugas(id_petugas)
);

-- Create table detail_peminjaman
CREATE TABLE detail_peminjaman (
    id_detail INT PRIMARY KEY AUTO_INCREMENT,
    id_peminjaman INT NOT NULL,
    id_buku INT NOT NULL,
    jumlah INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_peminjaman) REFERENCES peminjaman(id_peminjaman),
    FOREIGN KEY (id_buku) REFERENCES buku(id_buku)
);

-- DML (Data Manipulation Language)
-- Insert sample data for petugas
INSERT INTO petugas (nip, nama, jabatan, email, no_telepon, alamat, tanggal_lahir, jenis_kelamin) VALUES
('P001', 'John Doe', 'Librarian', 'john.doe@library.com', '08123456789', 'Jl. Library No. 1', '1990-01-01', 'Laki-laki'),
('P002', 'Jane Smith', 'Assistant', 'jane.smith@library.com', '08987654321', 'Jl. Library No. 2', '1992-02-02', 'Perempuan');

-- Insert sample data for anggota
INSERT INTO anggota (nomor_anggota, nama, email, no_telepon, alamat, tanggal_lahir, jenis_kelamin) VALUES
('A001', 'Alice Johnson', 'alice@email.com', '08111111111', 'Jl. Member No. 1', '1995-03-03', 'Perempuan'),
('A002', 'Bob Wilson', 'bob@email.com', '08222222222', 'Jl. Member No. 2', '1993-04-04', 'Laki-laki');

-- Insert sample data for buku
INSERT INTO buku (isbn, judul, penulis, penerbit, tahun_terbit, kategori, jumlah_halaman, stok) VALUES
('978-3-16-148410-0', 'The Great Adventure', 'Author One', 'Publisher A', 2020, 'Fiction', 300, 5),
('978-3-16-148410-1', 'Science Today', 'Author Two', 'Publisher B', 2021, 'Science', 250, 3);

-- Insert sample data for peminjaman
INSERT INTO peminjaman (id_anggota, id_petugas, tanggal_pinjam, tanggal_kembali, status) VALUES
(1, 1, '2024-03-01', '2024-03-15', 'Dipinjam'),
(2, 2, '2024-03-02', '2024-03-16', 'Dipinjam');

-- Insert sample data for detail_peminjaman
INSERT INTO detail_peminjaman (id_peminjaman, id_buku, jumlah) VALUES
(1, 1, 1),
(2, 2, 1);

-- JSON Queries
-- Get petugas information as JSON
SELECT JSON_OBJECT(
    'id_petugas', id_petugas,
    'nip', nip,
    'nama', nama,
    'jabatan', jabatan,
    'email', email,
    'no_telepon', no_telepon,
    'alamat', alamat,
    'tanggal_lahir', tanggal_lahir,
    'jenis_kelamin', jenis_kelamin,
    'status', status
) AS petugas_json
FROM petugas;

-- Get complete peminjaman information with related data as JSON
SELECT JSON_OBJECT(
    'id_peminjaman', p.id_peminjaman,
    'anggota', JSON_OBJECT(
        'id_anggota', a.id_anggota,
        'nama', a.nama,
        'email', a.email
    ),
    'petugas', JSON_OBJECT(
        'id_petugas', pt.id_petugas,
        'nama', pt.nama,
        'jabatan', pt.jabatan
    ),
    'tanggal_pinjam', p.tanggal_pinjam,
    'tanggal_kembali', p.tanggal_kembali,
    'status', p.status,
    'buku', JSON_ARRAYAGG(
        JSON_OBJECT(
            'id_buku', b.id_buku,
            'judul', b.judul,
            'jumlah', dp.jumlah
        )
    )
) AS peminjaman_json
FROM peminjaman p
JOIN anggota a ON p.id_anggota = a.id_anggota
JOIN petugas pt ON p.id_petugas = pt.id_petugas
JOIN detail_peminjaman dp ON p.id_peminjaman = dp.id_peminjaman
JOIN buku b ON dp.id_buku = b.id_buku
GROUP BY p.id_peminjaman;

-- Get buku statistics as JSON
SELECT JSON_OBJECT(
    'total_buku', COUNT(*),
    'total_stok', SUM(stok),
    'kategori', JSON_ARRAYAGG(
        JSON_OBJECT(
            'nama_kategori', kategori,
            'jumlah_buku', COUNT(*),
            'total_stok', SUM(stok)
        )
    )
) AS buku_statistics
FROM buku
GROUP BY kategori; 