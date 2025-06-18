import React, { createContext, useContext, useState, useEffect } from 'react';
import { LibraryContextType, Buku, Anggota, Petugas, Peminjaman, Sampah } from '../types';
import axios from 'axios';

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

// Global Date Context
const GlobalDateContext = createContext<{ globalDate: Date, setGlobalDate: (date: Date) => void }>({ globalDate: new Date(), setGlobalDate: () => {} });
export const useGlobalDate = () => useContext(GlobalDateContext);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

let nextSampahId = 1;

type BukuFromBackend = Omit<Buku, 'id_buku'> & { _id: string };
type AnggotaFromBackend = Omit<Anggota, 'id_anggota'> & { _id: string };
type PetugasFromBackend = Omit<Petugas, 'id_petugas'> & { _id: string };
type PeminjamanFromBackend = Omit<Peminjaman, 'id_peminjaman'> & { _id: string };

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buku, setBuku] = useState<Buku[]>([]);
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [petugas, setPetugas] = useState<Petugas[]>([]);
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([]);
  const [sampah, setSampah] = useState<Sampah[]>([]);
  const [globalDate, setGlobalDate] = useState(new Date());

  // Auto-update overdue loans
  useEffect(() => {
    const updateOverdueLoans = async () => {
      const today = globalDate;
      let updated = false;
      for (const loan of peminjaman) {
        if (loan.status_peminjaman === 'dipinjam') {
          const dueDate = new Date(loan.tanggal_kembali_rencana);
          if (today > dueDate) {
            const daysDiff = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
            // Update ke backend jika belum terlambat
            await updatePeminjaman(loan.id_peminjaman, {
              status_peminjaman: 'terlambat',
              denda: daysDiff * 1000,
              updated_at: today.toISOString(),
            });
            updated = true;
          }
        }
      }
      // Jika ada yang diupdate, fetch ulang data dari backend
      if (updated) {
        const res = await axios.get<PeminjamanFromBackend[]>('http://localhost:5050/api/peminjaman');
        setPeminjaman(res.data.map((p: PeminjamanFromBackend) => ({ ...p, id_peminjaman: p._id })));
      }
    };
    updateOverdueLoans();
  }, [globalDate]);

  useEffect(() => {
    // Ambil data buku dari backend
    axios.get<BukuFromBackend[]>('http://localhost:5050/api/buku')
      .then(res => {
        const mapped = res.data.map((b: BukuFromBackend) => ({ ...b, id_buku: b._id }));
        setBuku(mapped);
      })
      .catch(() => setBuku([]));
  }, []);

  useEffect(() => {
    // Ambil data anggota dari backend
    axios.get<AnggotaFromBackend[]>('http://localhost:5050/api/anggota')
      .then(res => {
        const mapped = res.data.map((a: AnggotaFromBackend) => ({ ...a, id_anggota: a._id }));
        setAnggota(mapped);
      })
      .catch(() => setAnggota([]));
  }, []);

  useEffect(() => {
    // Fetch petugas data on component mount
    const fetchPetugas = async () => {
      try {
        const res = await axios.get<PetugasFromBackend[]>('http://localhost:5050/api/petugas');
        const mapped = res.data.map((p: PetugasFromBackend) => ({ ...p, id_petugas: p._id }));
        setPetugas(mapped);
      } catch (error) {
        console.error('Error fetching petugas:', error);
        setPetugas([]);
      }
    };
    fetchPetugas();
  }, []);

  useEffect(() => {
    // Ambil data peminjaman dari backend
    axios.get<PeminjamanFromBackend[]>('http://localhost:5050/api/peminjaman')
      .then(res => {
        const mapped = res.data.map((p: PeminjamanFromBackend) => ({ ...p, id_peminjaman: p._id }));
        setPeminjaman(mapped);
      })
      .catch(() => setPeminjaman([]));
  }, []);

  useEffect(() => {
    // Ambil semua data yang is_deleted true dari backend untuk trash
    const fetchTrash = async () => {
      try {
        // Buku
        const bukuAll = await axios.get<BukuFromBackend[]>(`http://localhost:5050/api/buku/all`);
        // Anggota
        const anggotaAll = await axios.get<AnggotaFromBackend[]>(`http://localhost:5050/api/anggota/all`);
        // Petugas
        const petugasAll = await axios.get<PetugasFromBackend[]>(`http://localhost:5050/api/petugas/all`);
        // Peminjaman
        const peminjamanAll = await axios.get<PeminjamanFromBackend[]>(`http://localhost:5050/api/peminjaman/all`);
        const trash: Sampah[] = [];
        bukuAll.data.filter(b => b.is_deleted).forEach(b => {
          trash.push({
            id_sampah: nextSampahId++,
            nama_tabel: 'buku',
            id_data_asli: b._id,
            data_backup: JSON.stringify(b),
            dihapus_oleh: b.updated_at || '-',
            tanggal_dihapus: b.updated_at || b.created_at,
            created_at: b.created_at
          });
        });
        anggotaAll.data.filter(a => a.is_deleted).forEach(a => {
          trash.push({
            id_sampah: nextSampahId++,
            nama_tabel: 'anggota',
            id_data_asli: a._id,
            data_backup: JSON.stringify(a),
            dihapus_oleh: a.updated_at || '-',
            tanggal_dihapus: a.updated_at || a.created_at,
            created_at: a.created_at
          });
        });
        petugasAll.data.filter(p => p.is_deleted).forEach(p => {
          trash.push({
            id_sampah: nextSampahId++,
            nama_tabel: 'petugas',
            id_data_asli: p._id,
            data_backup: JSON.stringify(p),
            dihapus_oleh: p.updated_at || '-',
            tanggal_dihapus: p.updated_at || p.created_at,
            created_at: p.created_at
          });
        });
        peminjamanAll.data.filter(pm => pm.is_deleted).forEach(pm => {
          trash.push({
            id_sampah: nextSampahId++,
            nama_tabel: 'peminjaman',
            id_data_asli: pm._id,
            data_backup: JSON.stringify(pm),
            dihapus_oleh: pm.updated_at || '-',
            tanggal_dihapus: pm.updated_at || pm.created_at,
            created_at: pm.created_at
          });
        });
        setSampah(trash);
      } catch (err) {
        // Jika endpoint /all tidak ada, abaikan
      }
    };
    fetchTrash();
  }, []);

  const moveToTrash = (tableName: string, dataId: string, data: unknown, deletedBy: string) => {
    const trashItem: Sampah = {
      id_sampah: nextSampahId++,
      nama_tabel: tableName,
      id_data_asli: dataId,
      data_backup: JSON.stringify(data),
      dihapus_oleh: deletedBy,
      tanggal_dihapus: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    setSampah(prev => [...prev, trashItem]);
  };

  // Buku operations
  const addBuku = async (newBuku: Omit<Buku, 'id_buku' | 'created_at' | 'updated_at'>) => {
    try {
      await axios.post('http://localhost:5050/api/buku', newBuku);
      // Fetch ulang data buku dari backend agar sinkron
      const res = await axios.get<Buku[]>('http://localhost:5050/api/buku');
      const mapped = res.data.map((b: any) => ({ ...b, id_buku: b._id }));
      setBuku(mapped);
    } catch (err) {
      alert('Gagal menambah buku: ' + (err as Error).message);
    }
  };

  const updateBuku = async (id: string, updates: Partial<Buku>) => {
    try {
      await axios.put(`http://localhost:5050/api/buku/${id}`, updates);
      const res = await axios.get<Buku[]>('http://localhost:5050/api/buku');
      const mapped = res.data.map((b: any) => ({ ...b, id_buku: b._id }));
      setBuku(mapped);
    } catch (err) {
      alert('Gagal update buku: ' + (err as Error).message);
    }
  };

  const deleteBuku = async (id: string, deletedBy: string) => {
    try {
      // Cari data buku sebelum dihapus
      const bukuToDelete = buku.find(b => b.id_buku === id);
      await axios.delete(`http://localhost:5050/api/buku/${id}`);
      const res = await axios.get<Buku[]>('http://localhost:5050/api/buku');
      const mapped = res.data.map((b: any) => ({ ...b, id_buku: b._id }));
      setBuku(mapped);
      // Masukkan ke sampah jika data ditemukan
      if (bukuToDelete) {
        moveToTrash('buku', id, bukuToDelete, deletedBy);
      }
    } catch (err) {
      alert('Gagal hapus buku: ' + (err as Error).message);
    }
  };

  const restoreBuku = (id: string) => {
    setBuku(prev => prev.map(item => 
      item.id_buku === id 
        ? { ...item, is_deleted: false, updated_at: new Date().toISOString() }
        : item
    ));
  };

  // Anggota operations
  const addAnggota = async (newAnggota: Omit<Anggota, 'id_anggota' | 'nomor_anggota' | 'created_at' | 'updated_at'>) => {
    try {
      await axios.post('http://localhost:5050/api/anggota', newAnggota);
      const res = await axios.get<Anggota[]>('http://localhost:5050/api/anggota');
      setAnggota(res.data);
    } catch (err) {
      alert('Gagal menambah anggota: ' + (err as Error).message);
    }
  };

  const updateAnggota = async (id: string, updates: Partial<Anggota>) => {
    try {
      await axios.put(`http://localhost:5050/api/anggota/${id}`, updates);
      const res = await axios.get<Anggota[]>('http://localhost:5050/api/anggota');
      setAnggota(res.data);
    } catch (err) {
      alert('Gagal update anggota: ' + (err as Error).message);
    }
  };

  const deleteAnggota = async (id: string, deletedBy: string) => {
    if (!id || typeof id !== 'string') {
      alert('ID anggota tidak valid!');
      return;
    }
    try {
      // Cari data anggota sebelum dihapus
      const anggotaToDelete = anggota.find(a => a.id_anggota === id);
      await axios.delete(`http://localhost:5050/api/anggota/${id}`);
      const anggotaRes = await axios.get<AnggotaFromBackend[]>(`http://localhost:5050/api/anggota`);
      setAnggota(anggotaRes.data.map((a: AnggotaFromBackend) => ({ ...a, id_anggota: a._id })));
      // Masukkan ke sampah jika data ditemukan
      if (anggotaToDelete) {
        moveToTrash('anggota', id, anggotaToDelete, deletedBy);
      }
    } catch (err) {
      alert('Gagal hapus anggota: ' + (err as Error).message);
    }
  };

  const restoreAnggota = (id: string) => {
    setAnggota(prev => prev.map(item => 
      item.id_anggota === id 
        ? { ...item, is_deleted: false, updated_at: new Date().toISOString() }
        : item
    ));
  };

  // Petugas operations
  const addPetugas = async (data: Omit<Petugas, 'id_petugas' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await axios.post<Petugas>('http://localhost:5050/api/petugas', data);
      setPetugas(prev => [...prev, res.data]);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add petugas');
    }
  };

  const updatePetugas = async (id: string, data: Omit<Petugas, 'id_petugas' | 'created_at' | 'updated_at'>) => {
    try {
      await axios.put(`http://localhost:5050/api/petugas/${id}`, data);
      // Fetch ulang data petugas dari backend
      const res = await axios.get<PetugasFromBackend[]>('http://localhost:5050/api/petugas');
      const mapped = res.data.map((p: PetugasFromBackend) => ({ ...p, id_petugas: p._id }));
      setPetugas(mapped);
    } catch (err) {
      throw new Error('Gagal update petugas: ' + (err as Error).message);
    }
  };

  const deletePetugas = async (id: string) => {
    try {
      // Cari data petugas sebelum dihapus
      const petugasToDelete = petugas.find(p => p.id_petugas === id);
      await axios.delete(`http://localhost:5050/api/petugas/${id}`);
      // Fetch ulang data petugas dari backend
      const res = await axios.get<PetugasFromBackend[]>('http://localhost:5050/api/petugas');
      const mapped = res.data.map((p: PetugasFromBackend) => ({ ...p, id_petugas: p._id }));
      setPetugas(mapped);
      // Masukkan ke sampah jika data ditemukan
      if (petugasToDelete) {
        moveToTrash('petugas', id, petugasToDelete, new Date().toISOString());
      }
    } catch (err) {
      throw new Error('Gagal hapus petugas: ' + (err as Error).message);
    }
  };

  const restorePetugas = (id: string) => {
    setPetugas(prev => prev.map(item => 
      item.id_petugas === id 
        ? { ...item, is_deleted: false, updated_at: new Date().toISOString() }
        : item
    ));
  };

  // Peminjaman operations
  const addPeminjaman = async (newPeminjaman: Omit<Peminjaman, 'id_peminjaman' | 'created_at' | 'updated_at'>) => {
    const member = anggota.find(a => a.id_anggota === newPeminjaman.id_anggota);
    if (!member || member.status_aktif !== 'aktif') {
      alert('Anggota tidak aktif tidak bisa meminjam buku!');
      return;
    }
    try {
      await axios.post('http://localhost:5050/api/peminjaman', newPeminjaman);
      // Fetch ulang data peminjaman dari backend agar sinkron
      const res = await axios.get<PeminjamanFromBackend[]>('http://localhost:5050/api/peminjaman');
      setPeminjaman(res.data.map((p: PeminjamanFromBackend) => ({ ...p, id_peminjaman: p._id })));
    } catch (err) {
      alert('Gagal menambah peminjaman: ' + (err as Error).message);
    }
  };

  const updatePeminjaman = async (id: string, updates: Partial<Peminjaman>) => {
    try {
      await axios.put(`http://localhost:5050/api/peminjaman/${id}`, updates);
      const res = await axios.get<Peminjaman[]>('http://localhost:5050/api/peminjaman');
      setPeminjaman(res.data);
    } catch (err) {
      alert('Gagal update peminjaman: ' + (err as Error).message);
    }
  };

  const processReturn = async (id_peminjaman: string, tanggal_kembali: string) => {
    const loan = peminjaman.find(p => p.id_peminjaman === id_peminjaman);
    if (!loan) return;

    const fine = calculateFine(loan.tanggal_kembali_rencana, tanggal_kembali);
    // Update loan status
    await updatePeminjaman(id_peminjaman, {
      tanggal_kembali_aktual: tanggal_kembali,
      tanggal_kembali_rencana: loan.tanggal_kembali_rencana,
      status_peminjaman: 'dikembalikan',
      denda: fine
    });
    // Update book stock
    const book = buku.find(b => b.id_buku === loan.id_buku);
    if (book) {
      await updateBuku(loan.id_buku, { jumlah_stok: book.jumlah_stok + 1 });
    }
    // Fetch ulang data buku agar stok update di dropdown
    const resBuku = await axios.get<BukuFromBackend[]>('http://localhost:5050/api/buku');
    setBuku(resBuku.data.map((b: BukuFromBackend) => ({ ...b, id_buku: b._id })));
  };

  const calculateFine = (tanggal_rencana: string, tanggal_aktual: string): number => {
    const dueDate = new Date(tanggal_rencana);
    const actualDate = new Date(tanggal_aktual);
    
    if (actualDate <= dueDate) return 0;
    
    const daysDiff = Math.ceil((actualDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff * 1000; // Rp 1,000 per day
  };

  // Utility functions
  const getBukuById = (id: string) => buku.find(b => b.id_buku === id);
  const getAnggotaById = (id: string) => anggota.find(a => a.id_anggota === id);
  const getPetugasById = (id: string) => petugas.find(p => p.id_petugas === id);
  const getActivePeminjamanByAnggota = (id_anggota: string) =>
    peminjaman.filter(p =>
      p.id_anggota === id_anggota &&
      !p.tanggal_kembali_aktual
    );

  // Trash operations
  const restoreFromTrash = async (id_sampah: string | number) => {
    const trashItem = sampah.find(s => s.id_sampah === id_sampah);
    if (!trashItem) return;
    let bukuRes, anggotaRes, petugasRes;
    try {
      switch (trashItem.nama_tabel) {
        case 'buku':
          await axios.put(`http://localhost:5050/api/buku/${trashItem.id_data_asli}`, { is_deleted: false });
          bukuRes = await axios.get<BukuFromBackend[]>('http://localhost:5050/api/buku');
          setBuku(bukuRes.data.map((b: BukuFromBackend) => ({ ...b, id_buku: b._id })));
          break;
        case 'anggota':
          await axios.put(`http://localhost:5050/api/anggota/${trashItem.id_data_asli}`, { is_deleted: false });
          anggotaRes = await axios.get<AnggotaFromBackend[]>('http://localhost:5050/api/anggota');
          setAnggota(anggotaRes.data.map((a: AnggotaFromBackend) => ({ ...a, id_anggota: a._id })));
          break;
        case 'petugas':
          await axios.put(`http://localhost:5050/api/petugas/${trashItem.id_data_asli}`, { is_deleted: false });
          petugasRes = await axios.get<PetugasFromBackend[]>('http://localhost:5050/api/petugas');
          setPetugas(petugasRes.data.map((p: PetugasFromBackend) => ({ ...p, id_petugas: p._id })));
          break;
      }
      setSampah(prev => prev.filter(s => s.id_sampah !== id_sampah));
    } catch (err) {
      alert('Gagal memulihkan data: ' + (err as Error).message);
    }
  };

  const permanentDelete = async (id_sampah: number) => {
    const trashItem = sampah.find(s => s.id_sampah === id_sampah);
    if (!trashItem) return;
    let bukuRes, anggotaRes, petugasRes;
    try {
      switch (trashItem.nama_tabel) {
        case 'buku':
          await axios.delete(`http://localhost:5050/api/buku/permanent/${trashItem.id_data_asli}`);
          bukuRes = await axios.get<BukuFromBackend[]>('http://localhost:5050/api/buku');
          setBuku(bukuRes.data.map((b: BukuFromBackend) => ({ ...b, id_buku: b._id })));
          break;
        case 'anggota':
          await axios.delete(`http://localhost:5050/api/anggota/permanent/${trashItem.id_data_asli}`);
          anggotaRes = await axios.get<AnggotaFromBackend[]>('http://localhost:5050/api/anggota');
          setAnggota(anggotaRes.data.map((a: AnggotaFromBackend) => ({ ...a, id_anggota: a._id })));
          break;
        case 'petugas':
          await axios.delete(`http://localhost:5050/api/petugas/permanent/${trashItem.id_data_asli}`);
          petugasRes = await axios.get<PetugasFromBackend[]>('http://localhost:5050/api/petugas');
          setPetugas(petugasRes.data.map((p: PetugasFromBackend) => ({ ...p, id_petugas: p._id })));
          break;
        case 'peminjaman':
          await axios.delete(`http://localhost:5050/api/peminjaman/permanent/${trashItem.id_data_asli}`);
          setPeminjaman(peminjaman.filter(p => p.id_peminjaman !== trashItem.id_data_asli));
          break;
      }
      setSampah(prev => prev.filter(s => s.id_sampah !== id_sampah));
    } catch (err) {
      alert('Gagal hapus permanen data: ' + (err as Error).message);
    }
  };

  const getStats = () => {
    const activeBuku = buku.filter(b => !b.is_deleted);
    const activeAnggota = anggota.filter(a => !a.is_deleted);
    const todayLoans = peminjaman.filter(p => {
      const today = globalDate.toDateString();
      return new Date(p.tanggal_pinjam).toDateString() === today;
    });
    const overdueLoans = peminjaman.filter(p => p.status_peminjaman === 'terlambat');
    const totalFines = peminjaman.reduce((sum, p) => sum + p.denda, 0);

    return {
      totalBuku: activeBuku.length,
      totalAnggota: activeAnggota.length,
      totalPeminjaman: todayLoans.length,
      totalTerlambat: overdueLoans.length,
      totalDenda: totalFines
    };
  };

  // Fungsi utilitas untuk statistik pertumbuhan
  const getStatsWithGrowth = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    // Buku
    const bukuThisMonth = buku.filter(b => {
      const created = new Date(b.created_at);
      return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
    }).length;
    const bukuLastMonth = buku.filter(b => {
      const created = new Date(b.created_at);
      return created.getMonth() === lastMonth && created.getFullYear() === lastMonthYear;
    }).length;
    const bukuGrowth = bukuLastMonth === 0 ? 100 : Math.round(((bukuThisMonth - bukuLastMonth) / Math.max(1, bukuLastMonth)) * 100);

    // Anggota
    const anggotaThisMonth = anggota.filter(a => {
      const created = new Date(a.created_at);
      return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
    }).length;
    const anggotaLastMonth = anggota.filter(a => {
      const created = new Date(a.created_at);
      return created.getMonth() === lastMonth && created.getFullYear() === lastMonthYear;
    }).length;
    const anggotaGrowth = anggotaLastMonth === 0 ? 100 : Math.round(((anggotaThisMonth - anggotaLastMonth) / Math.max(1, anggotaLastMonth)) * 100);

    // Peminjaman aktif
    const peminjamanThisMonth = peminjaman.filter(p => {
      const created = new Date(p.created_at);
      return created.getMonth() === thisMonth && created.getFullYear() === thisYear && p.status_peminjaman === 'dipinjam';
    }).length;
    const peminjamanLastMonth = peminjaman.filter(p => {
      const created = new Date(p.created_at);
      return created.getMonth() === lastMonth && created.getFullYear() === lastMonthYear && p.status_peminjaman === 'dipinjam';
    }).length;
    const peminjamanGrowth = peminjamanLastMonth === 0 ? 100 : Math.round(((peminjamanThisMonth - peminjamanLastMonth) / Math.max(1, peminjamanLastMonth)) * 100);

    return {
      bukuGrowth,
      anggotaGrowth,
      peminjamanGrowth
    };
  };

  const getPeminjamanFromBackend = () => {
    axios.get<PeminjamanFromBackend[]>('http://localhost:5050/api/peminjaman').then(res => {
      setPeminjaman(res.data.map((p: PeminjamanFromBackend) => ({ ...p, id_peminjaman: p._id })));
    });
  };

  const value: LibraryContextType = {
    buku: buku.filter(b => !b.is_deleted),
    anggota: anggota.filter(a => !a.is_deleted),
    petugas: petugas.filter(p => !p.is_deleted),
    peminjaman,
    sampah,
    addBuku,
    updateBuku,
    deleteBuku,
    restoreBuku,
    addAnggota,
    updateAnggota,
    deleteAnggota,
    restoreAnggota,
    addPetugas,
    updatePetugas,
    deletePetugas,
    restorePetugas,
    addPeminjaman,
    updatePeminjaman,
    processReturn,
    calculateFine,
    getBukuById,
    getAnggotaById,
    getPetugasById,
    getActivePeminjamanByAnggota,
    restoreFromTrash,
    permanentDelete,
    getStats,
    getStatsWithGrowth,
    getPeminjamanFromBackend,
    globalDate
  };

  return (
    <GlobalDateContext.Provider value={{ globalDate, setGlobalDate }}>
      <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
    </GlobalDateContext.Provider>
  );
};