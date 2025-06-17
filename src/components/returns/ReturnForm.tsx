import React, { useState } from 'react';
import { X, User, Book, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { useLibrary, useGlobalDate } from '../../context/LibraryContext';

interface ReturnFormProps {
  loan: any;
  onSuccess: () => void;
  onClose: () => void;
}

const ReturnForm: React.FC<ReturnFormProps> = ({ loan, onSuccess, onClose }) => {
  const { buku, anggota, processReturn, calculateFine } = useLibrary();
  const { globalDate } = useGlobalDate();
  const globalDateString = globalDate.toISOString().split('T')[0];
  const [returnDate, setReturnDate] = useState(globalDateString);

  const member = anggota.find(a => a.id_anggota === loan.id_anggota);
  const book = buku.find(b => b.id_buku === loan.id_buku);
  
  const fine = calculateFine(loan.tanggal_kembali_rencana, returnDate);
  const isLate = new Date(returnDate) > new Date(loan.tanggal_kembali_rencana);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!loan.id_peminjaman) {
        alert('ID peminjaman tidak valid!');
        return;
      }
      processReturn(loan.id_peminjaman, returnDate);
      onSuccess();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pengembalian Buku</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Loan Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Peminjaman</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{member?.nama_lengkap}</p>
                  <p className="text-sm text-gray-500">{member?.nomor_anggota}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Book className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{book?.judul_buku}</p>
                  <p className="text-sm text-gray-500">{book?.pengarang}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Tanggal Pinjam</p>
                  <p className="text-sm text-gray-500">
                    {new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Jatuh Tempo</p>
                  <p className={`text-sm ${isLate ? 'text-red-600' : 'text-gray-500'}`}>
                    {new Date(loan.tanggal_kembali_rencana).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Return Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Pengembalian *
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                max={globalDateString}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Fine Calculation */}
            <div className={`rounded-lg p-4 ${fine > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center">
                {fine > 0 ? (
                  <DollarSign className="w-5 h-5 text-red-600 mr-2" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                )}
                <div>
                  <p className={`text-sm font-medium ${fine > 0 ? 'text-red-800' : 'text-green-800'}`}>
                    {fine > 0 ? 'Denda Keterlambatan' : 'Tidak Ada Denda'}
                  </p>
                  <p className={`text-lg font-bold ${fine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {fine > 0 ? `Rp ${fine.toLocaleString('id-ID')}` : 'Rp 0'}
                  </p>
                  {fine > 0 && (
                    <p className="text-sm text-red-600">
                      Terlambat {Math.ceil((new Date(returnDate).getTime() - new Date(loan.tanggal_kembali_rencana).getTime()) / (1000 * 60 * 60 * 24))} hari
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Ringkasan Pengembalian</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium">
                    {fine > 0 ? 'Terlambat' : 'Tepat Waktu'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Denda:</span>
                  <span className="font-medium">Rp {fine.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stok buku akan bertambah:</span>
                  <span className="font-medium">+1</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Konfirmasi Pengembalian
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReturnForm;