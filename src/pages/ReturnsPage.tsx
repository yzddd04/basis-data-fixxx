import React, { useState } from 'react';
import { useLibrary, useGlobalDate } from '../context/LibraryContext';
import { Search, BookCheck, User, DollarSign, CheckCircle } from 'lucide-react';
import ReturnForm from '../components/returns/ReturnForm';
import { Peminjaman } from '../types';

const ReturnsPage: React.FC = () => {
  const { peminjaman, buku, anggota } = useLibrary();
  const { globalDate } = useGlobalDate();
  const globalDateString = (globalDate ? globalDate : new Date()).toISOString().split('T')[0];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<Peminjaman | null>(null);
  const [showReturnForm, setShowReturnForm] = useState(false);

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

  const handleReturnClick = (loan: Peminjaman) => {
    setSelectedLoan(loan);
    setShowReturnForm(true);
  };

  const handleReturnSuccess = () => {
    setShowReturnForm(false);
    setSelectedLoan(null);
  };

  const calculateFine = (dueDate: string, returnDate: string = globalDateString) => {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    if (returned <= due) return 0;
    const diffTime = returned.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 1000;
  };

  const todayReturns = peminjaman.filter(p => {
    if (p.tanggal_kembali_aktual && globalDate) {
      return new Date(p.tanggal_kembali_aktual).toDateString() === globalDate.toDateString();
    }
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaksi Pengembalian</h1>
          <p className="text-gray-600 mt-1">Kelola pengembalian buku perpustakaan</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Harus Dikembalikan</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{activeLoans.length}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <BookCheck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dikembalikan Hari Ini</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{todayReturns.length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Denda Terkumpul</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                Rp {peminjaman.reduce((sum, p) => sum + p.denda, 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <DollarSign className="w-6 h-6 text-purple-600" />
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

      {/* Loans to Return */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Buku yang Harus Dikembalikan</h2>
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
                  Jatuh Tempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Denda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLoans.map((loan) => {
                const member = anggota.find(a => a.id_anggota === loan.id_anggota);
                const book = buku.find(b => b.id_buku === loan.id_buku);
                const overdue = new Date(loan.tanggal_kembali_rencana) < globalDate && !loan.tanggal_kembali_aktual;
                const currentFine = calculateFine(loan.tanggal_kembali_rencana);
                
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
                      <div className={`text-sm ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
                        {new Date(loan.tanggal_kembali_rencana).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${currentFine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {currentFine > 0 ? `Rp ${currentFine.toLocaleString('id-ID')}` : 'Tidak ada'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleReturnClick(loan)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <BookCheck className="w-4 h-4 mr-1" />
                        Kembalikan
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLoans.length === 0 && (
          <div className="text-center py-12">
            <BookCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada buku yang harus dikembalikan</h3>
            <p className="text-gray-600">Semua peminjaman sudah dikembalikan</p>
          </div>
        )}
      </div>

      {/* Return Form Modal */}
      {showReturnForm && selectedLoan && (
        <ReturnForm
          loan={selectedLoan}
          onSuccess={handleReturnSuccess}
          onClose={() => {
            setShowReturnForm(false);
            setSelectedLoan(null);
          }}
        />
      )}
    </div>
  );
};

export default ReturnsPage;