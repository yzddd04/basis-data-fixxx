import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Plus, Search, Book, User, Calendar, AlertCircle } from 'lucide-react';
import BorrowingForm from '../components/borrowing/BorrowingForm';

const BorrowingPage: React.FC = () => {
  const { peminjaman, buku, anggota, petugas } = useLibrary();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const activeLoans = peminjaman.filter(p => p.status_peminjaman === 'dipinjam' || p.status_peminjaman === 'terlambat');
  
  const filteredLoans = activeLoans.filter(loan => {
    const member = anggota.find(a => a.id_anggota === loan.id_anggota);
    const book = buku.find(b => b.id_buku === loan.id_buku);
    
    return (
      member?.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member?.nomor_anggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book?.judul_buku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleBorrowSuccess = () => {
    setShowForm(false);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaksi Peminjaman</h1>
          <p className="text-gray-600 mt-1">Kelola peminjaman buku perpustakaan</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Pinjam Buku
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peminjaman Aktif</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {activeLoans.filter(p => p.status_peminjaman === 'dipinjam').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terlambat</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {activeLoans.filter(p => p.status_peminjaman === 'terlambat').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Denda</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                Rp {activeLoans.reduce((sum, p) => sum + p.denda, 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama anggota, nomor anggota, atau judul buku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Active Loans */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Peminjaman Aktif</h2>
          <p className="text-sm text-gray-600">Menampilkan {filteredLoans.length} dari {activeLoans.length} peminjaman</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anggota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buku
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Pinjam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Kembali
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Denda
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoans.map((loan) => {
                const member = anggota.find(a => a.id_anggota === loan.id_anggota);
                const book = buku.find(b => b.id_buku === loan.id_buku);
                const daysRemaining = getDaysRemaining(loan.tanggal_kembali_rencana);
                const overdue = isOverdue(loan.tanggal_kembali_rencana);
                
                return (
                  <tr key={loan.id_peminjaman} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member?.nama_lengkap}</div>
                          <div className="text-sm text-gray-500">{member?.nomor_anggota}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{book?.judul_buku}</div>
                      <div className="text-sm text-gray-500">{book?.pengarang}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(loan.tanggal_kembali_rencana).toLocaleDateString('id-ID')}
                      </div>
                      <div className={`text-xs ${overdue ? 'text-red-600' : daysRemaining <= 2 ? 'text-orange-600' : 'text-green-600'}`}>
                        {overdue ? `Terlambat ${Math.abs(daysRemaining)} hari` : 
                         daysRemaining === 0 ? 'Jatuh tempo hari ini' :
                         `${daysRemaining} hari lagi`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        loan.status_peminjaman === 'terlambat' 
                          ? 'bg-red-100 text-red-800'
                          : overdue
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {loan.status_peminjaman === 'terlambat' ? 'Terlambat' : 'Dipinjam'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.denda > 0 ? `Rp ${loan.denda.toLocaleString('id-ID')}` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLoans.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada peminjaman aktif</h3>
            <p className="text-gray-600">Belum ada peminjaman yang sedang berlangsung</p>
          </div>
        )}
      </div>

      {/* Borrowing Form Modal */}
      {showForm && (
        <BorrowingForm
          onSuccess={handleBorrowSuccess}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default BorrowingPage;