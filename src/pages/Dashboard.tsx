import React from 'react';
import { useLibrary, useGlobalDate } from '../context/LibraryContext';
import { Book, Users, BookOpen, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { getStats, getStatsWithGrowth, peminjaman, buku, anggota } = useLibrary();
  const { globalDate } = useGlobalDate();
  const stats = getStats();
  const growth = getStatsWithGrowth();

  const recentLoans = peminjaman
    .filter(p => p.status_peminjaman === 'dipinjam')
    .slice(0, 5);

  const overdueLoans = peminjaman.filter(p => p.status_peminjaman === 'terlambat');

  const popularBooks = buku
    .map(book => ({
      ...book,
      loanCount: peminjaman.filter(p => p.id_buku === book.id_buku).length
    }))
    .sort((a, b) => b.loanCount - a.loanCount)
    .slice(0, 3);

  const getLateDays = (loan, globalDate) => {
    const due = new Date(loan.tanggal_kembali_rencana);
    const now = globalDate ? globalDate : new Date();
    if (now > due && !loan.tanggal_kembali_aktual) {
      const diffTime = now.getTime() - due.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    change?: number;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString('id-ID')}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              +{change}% dari bulan lalu
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6" key="dashboard-root">
      {/* Header */}
      <div className="flex items-center justify-between" key="header">
        <div key="header-text">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di Sistem Manajemen Perpustakaan</p>
        </div>
        <div className="text-sm text-gray-500" key="last-update">
          Pembaruan terakhir: {globalDate.toLocaleString('id-ID')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" key="stats-grid">
        <StatCard
          key="total-books"
          title="Total Buku"
          value={stats.totalBuku}
          icon={Book}
          color="bg-blue-500"
          change={growth.bukuGrowth}
        />
        <StatCard
          key="total-members"
          title="Total Anggota"
          value={stats.totalAnggota}
          icon={Users}
          color="bg-green-500"
          change={growth.anggotaGrowth}
        />
        <StatCard
          key="active-loans"
          title="Peminjaman Aktif"
          value={peminjaman.filter(p => !p.tanggal_kembali_aktual).length}
          icon={BookOpen}
          color="bg-orange-500"
          change={growth.peminjamanGrowth}
        />
        <StatCard
          key="total-fines"
          title="Total Denda"
          value={`Rp ${peminjaman.reduce((sum, loan) => {
            if (new Date(loan.tanggal_kembali_rencana) < globalDate && !loan.tanggal_kembali_aktual) {
              return sum + getLateDays(loan, globalDate) * 1000;
            }
            return sum + (loan.denda || 0);
          }, 0).toLocaleString('id-ID')}`}
          icon={DollarSign}
          color="bg-red-500"
        />
      </div>

      {/* Alerts */}
      {overdueLoans.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4" key="overdue-alert">
          <div className="flex items-center" key="alert-content">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">
              Perhatian: {overdueLoans.length} peminjaman terlambat memerlukan tindakan segera
            </span>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" key="main-content">
        {/* Recent Loans */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100" key="recent-loans">
          <div className="p-6 border-b border-gray-100" key="recent-loans-header">
            <h2 className="text-lg font-semibold text-gray-900">Peminjaman Terbaru</h2>
          </div>
          <div className="p-6" key="recent-loans-content">
            {recentLoans.length === 0 ? (
              <p className="text-gray-500 text-center py-4" key="no-loans">Tidak ada peminjaman aktif</p>
            ) : (
              <div className="space-y-4" key="loans-list">
                {recentLoans.map((loan) => {
                  const member = anggota.find(a => a.id_anggota === loan.id_anggota);
                  const book = buku.find(b => b.id_buku === loan.id_buku);
                  return (
                    <div key={loan.id_peminjaman} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div key={`loan-info-${loan.id_peminjaman}`}>
                        <p className="font-medium text-gray-900">{book?.judul_buku}</p>
                        <p className="text-sm text-gray-600">{member?.nama_lengkap}</p>
                      </div>
                      <div className="text-right" key={`loan-dates-${loan.id_peminjaman}`}>
                        <p className="text-sm text-gray-900">{new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID')}</p>
                        <p className="text-xs text-gray-500">Kembali: {new Date(loan.tanggal_kembali_rencana).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Popular Books */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100" key="popular-books">
          <div className="p-6 border-b border-gray-100" key="popular-books-header">
            <h2 className="text-lg font-semibold text-gray-900">Buku Terpopuler</h2>
          </div>
          <div className="p-6" key="popular-books-content">
            <div className="space-y-4" key="books-list">
              {popularBooks.map((book, index) => (
                <div key={book.id_buku} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3" key={`rank-${book.id_buku}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1" key={`book-info-${book.id_buku}`}>
                    <p className="font-medium text-gray-900">{book.judul_buku}</p>
                    <p className="text-sm text-gray-600">{book.pengarang}</p>
                  </div>
                  <div className="text-right" key={`book-stats-${book.id_buku}`}>
                    <p className="text-sm font-medium text-blue-600">{book.loanCount} peminjaman</p>
                    <p className="text-xs text-gray-500">Stok: {book.jumlah_stok}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;