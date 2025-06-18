// MongoDB Implementation

// DDL (Data Definition Language)
// Create and use database
use db_perpustakaan

// Create collections with validation
db.createCollection("petugas", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["nip", "nama", "jabatan", "email", "noTelepon", "alamat", "tanggalLahir", "jenisKelamin"],
         properties: {
            nip: { bsonType: "string" },
            nama: { bsonType: "string" },
            jabatan: { bsonType: "string" },
            email: { bsonType: "string" },
            noTelepon: { bsonType: "string" },
            alamat: { bsonType: "string" },
            tanggalLahir: { bsonType: "date" },
            jenisKelamin: { enum: ["Laki-laki", "Perempuan"] },
            status: { enum: ["Aktif", "Tidak Aktif"] }
         }
      }
   }
})

db.createCollection("anggota", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["nomorAnggota", "nama", "email", "noTelepon", "alamat", "tanggalLahir", "jenisKelamin"],
         properties: {
            nomorAnggota: { bsonType: "string" },
            nama: { bsonType: "string" },
            email: { bsonType: "string" },
            noTelepon: { bsonType: "string" },
            alamat: { bsonType: "string" },
            tanggalLahir: { bsonType: "date" },
            jenisKelamin: { enum: ["Laki-laki", "Perempuan"] },
            status: { enum: ["Aktif", "Tidak Aktif"] }
         }
      }
   }
})

db.createCollection("buku", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["isbn", "judul", "penulis", "penerbit", "tahunTerbit", "kategori", "jumlahHalaman", "stok"],
         properties: {
            isbn: { bsonType: "string" },
            judul: { bsonType: "string" },
            penulis: { bsonType: "string" },
            penerbit: { bsonType: "string" },
            tahunTerbit: { bsonType: "int" },
            kategori: { bsonType: "string" },
            jumlahHalaman: { bsonType: "int" },
            stok: { bsonType: "int" }
         }
      }
   }
})

db.createCollection("peminjaman", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["idAnggota", "idPetugas", "tanggalPinjam", "tanggalKembali", "status", "buku"],
         properties: {
            idAnggota: { bsonType: "objectId" },
            idPetugas: { bsonType: "objectId" },
            tanggalPinjam: { bsonType: "date" },
            tanggalKembali: { bsonType: "date" },
            status: { enum: ["Dipinjam", "Dikembalikan", "Terlambat"] },
            buku: {
               bsonType: "array",
               items: {
                  bsonType: "object",
                  required: ["idBuku", "jumlah"],
                  properties: {
                     idBuku: { bsonType: "objectId" },
                     jumlah: { bsonType: "int" }
                  }
               }
            }
         }
      }
   }
})

// Create indexes
db.petugas.createIndex({ "nip": 1 }, { unique: true })
db.petugas.createIndex({ "email": 1 }, { unique: true })
db.anggota.createIndex({ "nomorAnggota": 1 }, { unique: true })
db.anggota.createIndex({ "email": 1 }, { unique: true })
db.buku.createIndex({ "isbn": 1 }, { unique: true })

// DML (Data Manipulation Language)
// Insert sample data for petugas
db.petugas.insertMany([
   {
      nip: "P001",
      nama: "John Doe",
      jabatan: "Librarian",
      email: "john.doe@library.com",
      noTelepon: "08123456789",
      alamat: "Jl. Library No. 1",
      tanggalLahir: new Date("1990-01-01"),
      jenisKelamin: "Laki-laki",
      status: "Aktif",
      createdAt: new Date(),
      updatedAt: new Date()
   },
   {
      nip: "P002",
      nama: "Jane Smith",
      jabatan: "Assistant",
      email: "jane.smith@library.com",
      noTelepon: "08987654321",
      alamat: "Jl. Library No. 2",
      tanggalLahir: new Date("1992-02-02"),
      jenisKelamin: "Perempuan",
      status: "Aktif",
      createdAt: new Date(),
      updatedAt: new Date()
   }
])

// Insert sample data for anggota
db.anggota.insertMany([
   {
      nomorAnggota: "A001",
      nama: "Alice Johnson",
      email: "alice@email.com",
      noTelepon: "08111111111",
      alamat: "Jl. Member No. 1",
      tanggalLahir: new Date("1995-03-03"),
      jenisKelamin: "Perempuan",
      status: "Aktif",
      createdAt: new Date(),
      updatedAt: new Date()
   },
   {
      nomorAnggota: "A002",
      nama: "Bob Wilson",
      email: "bob@email.com",
      noTelepon: "08222222222",
      alamat: "Jl. Member No. 2",
      tanggalLahir: new Date("1993-04-04"),
      jenisKelamin: "Laki-laki",
      status: "Aktif",
      createdAt: new Date(),
      updatedAt: new Date()
   }
])

// Insert sample data for buku
db.buku.insertMany([
   {
      isbn: "978-3-16-148410-0",
      judul: "The Great Adventure",
      penulis: "Author One",
      penerbit: "Publisher A",
      tahunTerbit: 2020,
      kategori: "Fiction",
      jumlahHalaman: 300,
      stok: 5,
      createdAt: new Date(),
      updatedAt: new Date()
   },
   {
      isbn: "978-3-16-148410-1",
      judul: "Science Today",
      penulis: "Author Two",
      penerbit: "Publisher B",
      tahunTerbit: 2021,
      kategori: "Science",
      jumlahHalaman: 250,
      stok: 3,
      createdAt: new Date(),
      updatedAt: new Date()
   }
])

// Insert sample data for peminjaman
db.peminjaman.insertMany([
   {
      idAnggota: db.anggota.findOne({nomorAnggota: "A001"})._id,
      idPetugas: db.petugas.findOne({nip: "P001"})._id,
      tanggalPinjam: new Date("2024-03-01"),
      tanggalKembali: new Date("2024-03-15"),
      status: "Dipinjam",
      buku: [
         {
            idBuku: db.buku.findOne({isbn: "978-3-16-148410-0"})._id,
            jumlah: 1
         }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
   },
   {
      idAnggota: db.anggota.findOne({nomorAnggota: "A002"})._id,
      idPetugas: db.petugas.findOne({nip: "P002"})._id,
      tanggalPinjam: new Date("2024-03-02"),
      tanggalKembali: new Date("2024-03-16"),
      status: "Dipinjam",
      buku: [
         {
            idBuku: db.buku.findOne({isbn: "978-3-16-148410-1"})._id,
            jumlah: 1
         }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
   }
])

// JSON Queries
// 1. Get petugas information
db.petugas.find({}, {
   _id: 0,
   nip: 1,
   nama: 1,
   jabatan: 1,
   email: 1,
   noTelepon: 1,
   alamat: 1,
   tanggalLahir: 1,
   jenisKelamin: 1,
   status: 1
}).toArray()

// 2. Get complete peminjaman information with related data
db.peminjaman.aggregate([
   {
      $lookup: {
         from: "anggota",
         localField: "idAnggota",
         foreignField: "_id",
         as: "anggota"
      }
   },
   {
      $lookup: {
         from: "petugas",
         localField: "idPetugas",
         foreignField: "_id",
         as: "petugas"
      }
   },
   {
      $lookup: {
         from: "buku",
         localField: "buku.idBuku",
         foreignField: "_id",
         as: "bukuDetail"
      }
   },
   {
      $project: {
         _id: 0,
         idPeminjaman: "$_id",
         anggota: {
            idAnggota: { $arrayElemAt: ["$anggota._id", 0] },
            nama: { $arrayElemAt: ["$anggota.nama", 0] },
            email: { $arrayElemAt: ["$anggota.email", 0] }
         },
         petugas: {
            idPetugas: { $arrayElemAt: ["$petugas._id", 0] },
            nama: { $arrayElemAt: ["$petugas.nama", 0] },
            jabatan: { $arrayElemAt: ["$petugas.jabatan", 0] }
         },
         tanggalPinjam: 1,
         tanggalKembali: 1,
         status: 1,
         buku: {
            $map: {
               input: "$buku",
               as: "b",
               in: {
                  idBuku: "$$b.idBuku",
                  jumlah: "$$b.jumlah",
                  judul: {
                     $arrayElemAt: [
                        {
                           $filter: {
                              input: "$bukuDetail",
                              as: "bd",
                              cond: { $eq: ["$$bd._id", "$$b.idBuku"] }
                           }
                        },
                        0
                     ].judul
                  }
               }
            }
         }
      }
   }
]).toArray()

// 3. Get buku statistics
db.buku.aggregate([
   {
      $group: {
         _id: "$kategori",
         jumlahBuku: { $sum: 1 },
         totalStok: { $sum: "$stok" }
      }
   },
   {
      $group: {
         _id: null,
         totalBuku: { $sum: "$jumlahBuku" },
         totalStok: { $sum: "$totalStok" },
         kategori: {
            $push: {
               namaKategori: "$_id",
               jumlahBuku: "$jumlahBuku",
               totalStok: "$totalStok"
            }
         }
      }
   },
   {
      $project: {
         _id: 0,
         totalBuku: 1,
         totalStok: 1,
         kategori: 1
      }
   }
]).toArray() 