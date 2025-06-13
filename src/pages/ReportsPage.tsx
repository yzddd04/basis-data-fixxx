import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BarChart3, Download, Calendar, TrendingUp, Users, Book } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { buku, anggota, peminjaman } = useLibrary();
  const [selectedReport, setSelectedReport] = useState('popular-books');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Popular Books Report
  const getPopularBooks = () => {
    const bookStats = buku.map(book => {
      const loanCount = peminjaman.filter(p => 
        p.id_buku === book.id_buku &&
        new Date(p.tanggal_pinjam) >= new Date(dateRange.start) &&
        new Date(p.tanggal_pinjam) <= new Date(dateRange.end)
      ).length;
      
      return {
        ...book,
        jumlah_peminjaman: loanCount
      };
    }).sort((a, b) => b.jumlah_peminjaman - a.jumlah_peminjaman);
    
    return bookStats.slice(0, 10);
  };

  // Active Members Report
  const getActiveMembers = () => {
    const memberStats = anggota.map(member => {
      const loans = peminjaman.filter(p => 
        p.id_anggota === member.id_anggota &&
        new Date(p.tanggal_pinjam) >= new Date(dateRange.start) &&
        new Date(p.tanggal_pinjam) <= new Date(dateRange.end)
      );
      
      const activeLoans = peminjaman.filter(p => 
        p.id_anggota === member.id_anggota &&
        p.status_peminjaman === 'dipinjam'
      ).length;
      
      return {
        ...member,
        jumlah_peminjaman: loans.length,
        status_peminjaman_aktif: activeLoans
      };
    }).sort((a, b) => b.jumlah_peminjaman - a.jumlah_peminjaman);
    
    return memberStats.slice(0, 10);
  };

  // Monthly Trends
  const getMonthlyTrends = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthLoans = peminjaman.filter(p => {
        const loanDate = new Date(p.tanggal_pinjam);
        return loanDate >= monthStart && loanDate <= monthEnd;
      }).length;
      
      months.push({
        month: date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        loans: monthLoans
      });
    }
    
    return months;
  };

  // Overdue Report
  const getOverdueReport = () => {
    const overdueLoans = peminjaman.filter(p => p.status_peminjaman === 'terlambat');
    
    return overdueLoans.map(loan => {
      const member = anggota.find(a => a.id_anggota === loan.id_anggota);
      const book = buku.find(b => b.id_buku === loan.id_buku);
      const daysOverdue = Math.ceil((new Date().getTime() - new Date(loan.tanggal_kembali_rencana).getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...loan,
        member,
        book,
        days_overdue: daysOverdue
      };
    }).sort((a, b) => b.days_overdue - a.days_overdue);
  };

  const popularBooks = getPopularBooks();
  const activeMembers = getActiveMembers();
  const monthlyTrends = getMonthlyTrends();
  const overdueReport = getOverdueReport();

  const exportReport = () => {
    // Simple CSV export functionality
    let csvContent = '';
    let filename = '';
    
    switch (selectedReport) {
      case 'popular-books':
        csvContent = 'Judul Buku,Pengarang,Kategori,Jumlah Peminjaman\n';
        popularBooks.forEach(book => {
          csvContent += `"${book.judul_buku}","${book.pengarang}","${book.kategori}",${book.jumlah_peminjaman}\n`;
        });
        filename = 'laporan-buku-populer.csv';
        break;
      case 'active-members':
        csvContent = 'Nama,Nomor Anggota,Email,Jumlah Peminjaman,Peminjaman Aktif\n';
        activeMembers.forEach(member => {
          csvContent += `"${member.nama_lengkap}","${member.nomor_anggota}","${member.email}",${member.jumlah_peminjaman},${member.status_peminjaman_aktif}\n`;
        });
        filename = 'laporan-anggota-aktif.csv';
        break;
      case 'overdue':
        csvContent = 'Nama Anggota,Judul Buku,Tanggal Pinjam,Jatuh Tempo,Hari Terlambat,Denda\n';
        overdueReport.forEach(item => {
          csvContent += `"${item.member?.nama_lengkap}","${item.book?.judul_buku}","${item.tanggal_pinjam}","${item.tanggal_kembali_rencana}",${item.days_overdue},"Rp ${item.denda.toLocaleString('id-ID')}"\n`;
        });
        filename = 'laporan-keterlambatan.csv';
        break;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-600 mt-1">Analisis dan statistik perpustakaan</p>
        </div>
        <button
          onClick={exportReport}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Laporan
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popular-books">Buku Terpopuler</option>
              <option value="active-members">Anggota Teraktif</option>
              <option value="monthly-trends">Tren Bulanan</option>
              <option value="overdue">Keterlambatan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedReport === 'popular-books' && 'Buku Terpopuler'}
              {selectedReport === 'active-members' && 'Anggota Teraktif'}
              {selectedReport === 'monthly-trends' && 'Tren Peminjaman Bulanan'}
              {selectedReport === 'overdue' && 'Laporan Keterlambatan'}
            </h2>
          </div>
        </div>

        <div className="p-6">
          {/* Popular Books Report */}
          {selectedReport === 'popular-books' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ranking</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Judul Buku</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Pengarang</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Kategori</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Jumlah Peminjaman</th>
                  </tr>
                </thead>
                <tbody>
                  {popularBooks.map((book, index) => (
                    <tr key={book.id_buku} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{book.judul_buku}</td>
                      <td className="py-3 px-4 text-gray-600">{book.pengarang}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {book.kategori}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-600">{book.jumlah_peminjaman}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Active Members Report */}
          {selectedReport === 'active-members' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ranking</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Nama</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Nomor Anggota</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total Peminjaman</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Peminjaman Aktif</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMembers.map((member, index) => (
                    <tr key={member.id_anggota} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{member.nama_lengkap}</td>
                      <td className="py-3 px-4 text-blue-600">{member.nomor_anggota}</td>
                      <td className="py-3 px-4 text-gray-600">{member.email}</td>
                      <td className="py-3 px-4 font-bold text-green-600">{member.jumlah_peminjaman}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          member.status_peminjaman_aktif > 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {member.status_peminjaman_aktif}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Monthly Trends */}
          {selectedReport === 'monthly-trends' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {monthlyTrends.map((month, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">{month.month}</p>
                        <p className="text-2xl font-bold text-blue-600">{month.loans}</p>
                        <p className="text-xs text-blue-600">peminjaman</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ringkasan Tren</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {monthlyTrends.reduce((sum, month) => sum + month.loans, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Peminjaman</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(monthlyTrends.reduce((sum, month) => sum + month.loans, 0) / monthlyTrends.length)}
                    </p>
                    <p className="text-sm text-gray-600">Rata-rata per Bulan</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.max(...monthlyTrends.map(m => m.loans))}
                    </p>
                    <p className="text-sm text-gray-600">Puncak Peminjaman</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overdue Report */}
          {selectedReport === 'overdue' && (
            <div>
              {overdueReport.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada keterlambatan</h3>
                  <p className="text-gray-600">Semua peminjaman dikembalikan tepat waktu</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Anggota</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Buku</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Tanggal Pinjam</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Jatuh Tempo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Hari Terlambat</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Denda</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueReport.map((item) => (
                        <tr key={item.id_peminjaman} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{item.member?.nama_lengkap}</div>
                              <div className="text-sm text-gray-500">{item.member?.nomor_anggota}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{item.book?.judul_buku}</div>
                              <div className="text-sm text-gray-500">{item.book?.pengarang}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-red-600">
                            {new Date(item.tanggal_kembali_rencana).toLocaleDateString('id-ID')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              {item.days_overdue} hari
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-red-600">
                            Rp {item.denda.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;