import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Plus, Search, Filter, Edit, Trash2, Book, MapPin } from 'lucide-react';
import BookForm from '../components/books/BookForm';
import { Buku } from '../types';

const BooksPage: React.FC = () => {
  const { buku, addBuku, updateBuku, deleteBuku } = useLibrary();
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Buku | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [...new Set(buku.map(b => b.kategori))];

  const filteredBooks = buku.filter(book => {
    const matchesSearch = book.judul_buku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.pengarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = !selectedCategory || book.kategori === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddBook = (bookData: Omit<Buku, 'id_buku' | 'created_at' | 'updated_at'>) => {
    addBuku(bookData);
    setShowForm(false);
  };

  const handleUpdateBook = (bookData: Omit<Buku, 'id_buku' | 'created_at' | 'updated_at'>) => {
    if (editingBook && editingBook.id_buku) {
      updateBuku(editingBook.id_buku, bookData);
      setEditingBook(null);
      setShowForm(false);
    } else {
      alert('ID buku tidak valid');
    }
  };

  const handleDeleteBook = (id: number) => {
    if (!id) {
      alert('ID buku tidak valid');
      return;
    }
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      deleteBuku(id, 'Admin');
    }
  };

  const handleEdit = (book: Buku) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Buku</h1>
          <p className="text-gray-600 mt-1">Kelola koleksi buku perpustakaan</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Buku
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari judul, pengarang, atau ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Kategori</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            Menampilkan {filteredBooks.length} dari {buku.length} buku
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id_buku} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.judul_buku}</h3>
                  <p className="text-gray-600 text-sm mb-2">{book.pengarang}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Book className="w-4 h-4 mr-1" />
                    {book.penerbit} • {book.tahun_terbit}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {book.lokasi_rak}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    book.jumlah_stok > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.jumlah_stok > 0 ? 'Tersedia' : 'Habis'}
                  </span>
                  <span className="text-sm text-gray-600 mt-1">Stok: {book.jumlah_stok}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {book.kategori}
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                ISBN: {book.isbn}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBook(book.id_buku)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada buku ditemukan</h3>
          <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter kategori</p>
        </div>
      )}

      {/* Book Form Modal */}
      {showForm && (
        <BookForm
          book={editingBook}
          onSubmit={editingBook ? handleUpdateBook : handleAddBook}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default BooksPage;