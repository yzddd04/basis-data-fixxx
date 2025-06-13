import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Buku } from '../../types';

interface BookFormProps {
  book?: Buku | null;
  onSubmit: (book: Omit<Buku, 'id_buku' | 'created_at' | 'updated_at'>) => void;
  onClose: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    judul_buku: '',
    pengarang: '',
    penerbit: '',
    tahun_terbit: new Date().getFullYear(),
    isbn: '',
    kategori: '',
    jumlah_stok: 1,
    lokasi_rak: '',
    is_deleted: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (book) {
      setFormData({
        judul_buku: book.judul_buku,
        pengarang: book.pengarang,
        penerbit: book.penerbit,
        tahun_terbit: book.tahun_terbit,
        isbn: book.isbn,
        kategori: book.kategori,
        jumlah_stok: book.jumlah_stok,
        lokasi_rak: book.lokasi_rak,
        is_deleted: book.is_deleted
      });
    }
  }, [book]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.judul_buku.trim()) {
      newErrors.judul_buku = 'Judul buku harus diisi';
    }

    if (!formData.pengarang.trim()) {
      newErrors.pengarang = 'Pengarang harus diisi';
    }

    if (!formData.penerbit.trim()) {
      newErrors.penerbit = 'Penerbit harus diisi';
    }

    if (formData.tahun_terbit < 1000 || formData.tahun_terbit > new Date().getFullYear()) {
      newErrors.tahun_terbit = 'Tahun terbit tidak valid';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN harus diisi';
    }

    if (!formData.kategori.trim()) {
      newErrors.kategori = 'Kategori harus diisi';
    }

    if (formData.jumlah_stok < 0) {
      newErrors.jumlah_stok = 'Jumlah stok tidak boleh negatif';
    }

    if (!formData.lokasi_rak.trim()) {
      newErrors.lokasi_rak = 'Lokasi rak harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tahun_terbit' || name === 'jumlah_stok' ? parseInt(value) : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const categories = [
    'Fiksi', 'Non-Fiksi', 'Teknologi', 'Sejarah', 'Biografi', 
    'Sains', 'Pendidikan', 'Agama', 'Kesehatan', 'Ekonomi'
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {book ? 'Edit Buku' : 'Tambah Buku Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Buku *
              </label>
              <input
                type="text"
                name="judul_buku"
                value={formData.judul_buku}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.judul_buku ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan judul buku"
              />
              {errors.judul_buku && (
                <p className="text-red-600 text-sm mt-1">{errors.judul_buku}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pengarang *
              </label>
              <input
                type="text"
                name="pengarang"
                value={formData.pengarang}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.pengarang ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama pengarang"
              />
              {errors.pengarang && (
                <p className="text-red-600 text-sm mt-1">{errors.pengarang}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Penerbit *
              </label>
              <input
                type="text"
                name="penerbit"
                value={formData.penerbit}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.penerbit ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama penerbit"
              />
              {errors.penerbit && (
                <p className="text-red-600 text-sm mt-1">{errors.penerbit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun Terbit *
              </label>
              <input
                type="number"
                name="tahun_terbit"
                value={formData.tahun_terbit}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear()}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.tahun_terbit ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.tahun_terbit && (
                <p className="text-red-600 text-sm mt-1">{errors.tahun_terbit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN *
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.isbn ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="978-xxx-xxx-xxx-x"
              />
              {errors.isbn && (
                <p className="text-red-600 text-sm mt-1">{errors.isbn}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.kategori ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.kategori && (
                <p className="text-red-600 text-sm mt-1">{errors.kategori}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Stok *
              </label>
              <input
                type="number"
                name="jumlah_stok"
                value={formData.jumlah_stok}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.jumlah_stok ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.jumlah_stok && (
                <p className="text-red-600 text-sm mt-1">{errors.jumlah_stok}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi Rak *
              </label>
              <input
                type="text"
                name="lokasi_rak"
                value={formData.lokasi_rak}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lokasi_rak ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Contoh: A1-01"
              />
              {errors.lokasi_rak && (
                <p className="text-red-600 text-sm mt-1">{errors.lokasi_rak}</p>
              )}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {book ? 'Update Buku' : 'Tambah Buku'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;