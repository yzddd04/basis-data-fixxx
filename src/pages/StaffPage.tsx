import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Plus, Search, Edit, Trash2, UserCheck, Phone, MapPin } from 'lucide-react';
import StaffForm from '../components/staff/StaffForm';
import { Petugas } from '../types';

const StaffPage: React.FC = () => {
  const { petugas, addPetugas, updatePetugas, deletePetugas } = useLibrary();
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Petugas | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = petugas.filter(staff =>
    staff.nama_petugas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = (staffData: Omit<Petugas, 'id_petugas' | 'created_at' | 'updated_at'>) => {
    addPetugas(staffData);
    setShowForm(false);
  };

  const handleUpdateStaff = (staffData: Omit<Petugas, 'id_petugas' | 'created_at' | 'updated_at'>) => {
    if (editingStaff) {
      updatePetugas(editingStaff.id_petugas, staffData);
      setEditingStaff(null);
      setShowForm(false);
    }
  };

  const handleDeleteStaff = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus petugas ini?')) {
      deletePetugas(id, 'Admin');
    }
  };

  const handleEdit = (staff: Petugas) => {
    setEditingStaff(staff);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStaff(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Petugas</h1>
          <p className="text-gray-600 mt-1">Kelola data petugas perpustakaan</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Petugas
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama petugas atau jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            Menampilkan {filteredStaff.length} dari {petugas.length} petugas
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <div key={staff.id_petugas} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{staff.nama_petugas}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-3">{staff.jabatan}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Phone className="w-4 h-4 mr-1" />
                    {staff.telepon}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-2">{staff.alamat}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(staff)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStaff(staff.id_petugas)}
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

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada petugas ditemukan</h3>
          <p className="text-gray-600">Coba ubah kata kunci pencarian</p>
        </div>
      )}

      {/* Staff Form Modal */}
      {showForm && (
        <StaffForm
          staff={editingStaff}
          onSubmit={editingStaff ? handleUpdateStaff : handleAddStaff}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default StaffPage;