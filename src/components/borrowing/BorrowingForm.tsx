import React, { useState } from 'react';
import { X, Search, User, Book, Calendar } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { Anggota, Buku } from '../../types';

interface BorrowingFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const BorrowingForm: React.FC<BorrowingFormProps> = ({ onSuccess, onClose }) => {
  const { buku, anggota, petugas, addPeminjaman, peminjaman } = useLibrary();
  const [selectedMember, setSelectedMember] = useState<Anggota | null>(null);
  const [selectedBook, setSelectedBook] = useState<Buku | null>(null);
  const [selectedStaff, setSelectedStaff] = useState(petugas[0]?.id_petugas || '');
  const [borrowDate, setBorrowDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [showMemberList, setShowMemberList] = useState(false);
  const [showBookList, setShowBookList] = useState(false);

  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date(borrowDate);
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  const filteredMembers = anggota.filter(member =>
    (member.nama_lengkap?.toLowerCase() || '').includes(memberSearch.toLowerCase()) ||
    (member.nomor_anggota?.toLowerCase() || '').includes(memberSearch.toLowerCase())
  );

  const filteredBooks = buku.filter(book =>
    book.jumlah_stok > 0 &&
    ((book.judul_buku?.toLowerCase() || '').includes(bookSearch.toLowerCase()) ||
      (book.pengarang?.toLowerCase() || '').includes(bookSearch.toLowerCase()) ||
      (book.isbn || '').includes(bookSearch))
  );

  const totalDays = borrowDate && returnDate ?
    Math.max(1, Math.ceil((new Date(returnDate).getTime() - new Date(borrowDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedMember || !selectedMember.id_anggota) {
      newErrors.member = 'Anggota harus dipilih';
    }

    if (!selectedBook || !selectedBook.id_buku) {
      newErrors.book = 'Buku harus dipilih';
    }

    if (!selectedStaff) {
      newErrors.staff = 'Petugas harus dipilih';
    }

    if (!borrowDate) {
      newErrors.borrowDate = 'Tanggal peminjaman harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!selectedMember?.id_anggota || !selectedBook?.id_buku || !selectedStaff) {
      setErrors({
        member: !selectedMember?.id_anggota ? 'Anggota harus dipilih' : '',
        book: !selectedBook?.id_buku ? 'Buku harus dipilih' : '',
        staff: !selectedStaff ? 'Petugas harus dipilih' : '',
      });
      return;
    }

    try {
      const borrowingData = {
        id_anggota: selectedMember.id_anggota,
        id_buku: selectedBook.id_buku,
        id_petugas: selectedStaff,
        tanggal_pinjam: borrowDate,
        tanggal_kembali_rencana: returnDate,
        status_peminjaman: 'dipinjam' as const,
        denda: 0,
        catatan: notes || undefined,
        is_deleted: false
      };

      addPeminjaman(borrowingData);
      onSuccess();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  const selectMember = (member: Anggota) => {
    setSelectedMember(member);
    setMemberSearch(member.nama_lengkap);
    setShowMemberList(false);
    if (errors.member) {
      setErrors(prev => ({ ...prev, member: '' }));
    }
  };

  const selectBook = (book: Buku) => {
    setSelectedBook(book);
    setBookSearch(book.judul_buku);
    setShowBookList(false);
    if (errors.book) {
      setErrors(prev => ({ ...prev, book: '' }));
    }
  };

  // Fungsi untuk hitung total stok buku (tersedia + sedang dipinjam)
  const getTotalStock = (book: Buku) => {
    const dipinjam = peminjaman.filter(p => p.id_buku === book.id_buku && !p.tanggal_kembali_aktual && (p.status_peminjaman === 'dipinjam' || p.status_peminjaman === 'terlambat')).length;
    return book.jumlah_stok + dipinjam;
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pinjam Buku</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Member Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Anggota *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => {
                  setMemberSearch(e.target.value);
                  setShowMemberList(true);
                  if (e.target.value !== selectedMember?.nama_lengkap) {
                    setSelectedMember(null);
                  }
                }}
                onFocus={() => setShowMemberList(true)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.member ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Cari nama atau nomor anggota..."
              />
            </div>
            {errors.member && (
              <p className="text-red-600 text-sm mt-1">{errors.member}</p>
            )}
            
            {showMemberList && filteredMembers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {filteredMembers.map((member) => {
                  return (
                    <div
                      key={member.id_anggota}
                      onClick={() => selectMember(member)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{member.nama_lengkap}</div>
                          <div className="text-sm text-gray-500">
                            {member.nomor_anggota}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Book Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Buku *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={bookSearch}
                onChange={(e) => {
                  setBookSearch(e.target.value);
                  setShowBookList(true);
                  if (e.target.value !== selectedBook?.judul_buku) {
                    setSelectedBook(null);
                  }
                }}
                onFocus={() => setShowBookList(true)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.book ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Cari judul buku, pengarang, atau ISBN..."
              />
            </div>
            {errors.book && (
              <p className="text-red-600 text-sm mt-1">{errors.book}</p>
            )}
            
            {showBookList && filteredBooks.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id_buku}
                    onClick={() => selectBook(book)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <Book className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">{book.judul_buku}</div>
                        <div className="text-sm text-gray-500">
                          {book.pengarang} • Stok: {book.jumlah_stok}/{getTotalStock(book)} • {book.lokasi_rak}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Staff Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Petugas *
              </label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.staff ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih petugas</option>
                {petugas.map((staff) => (
                  <option key={staff.id_petugas} value={staff.id_petugas}>
                    {staff.nama_petugas} - {staff.jabatan}
                  </option>
                ))}
              </select>
              {errors.staff && (
                <p className="text-red-600 text-sm mt-1">{errors.staff}</p>
              )}
            </div>

            {/* Borrow Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Peminjaman *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={borrowDate}
                  onChange={(e) => {
                    setBorrowDate(e.target.value);
                    const d = new Date(e.target.value);
                    if (!isNaN(d.getTime())) {
                      d.setDate(d.getDate() + totalDays);
                      setReturnDate(d.toISOString().split('T')[0]);
                    } else {
                      setReturnDate('');
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.borrowDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.borrowDate && (
                <p className="text-red-600 text-sm mt-1">{errors.borrowDate}</p>
              )}
            </div>
          </div>

          {/* Return Date Selection */}
          {borrowDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <label className="text-sm font-medium text-blue-800">Tanggal Kembali *</label>
                  <input
                    type="date"
                    value={returnDate}
                    min={borrowDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="ml-2 px-2 py-1 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="text-xs text-blue-700 mt-1">
                Total hari peminjaman: <span className="font-semibold">{totalDays} hari</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tambahkan catatan jika diperlukan..."
            />
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Pinjam Buku
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowingForm;