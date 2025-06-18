import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Plus, Search, User, Phone, MapPin, Briefcase, Edit, Trash2 } from 'lucide-react';
import PetugasForm from '../components/staff/PetugasForm';
import { Petugas } from '../types';

const PetugasPage: React.FC = () => {
  const { petugas, addPetugas, updatePetugas, deletePetugas } = useLibrary();
  const [showForm, setShowForm] = useState(false);
  const [editingPetugas, setEditingPetugas] = useState<Petugas | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPetugas = petugas.filter(staff => {
    if (!staff) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (staff.nama_petugas?.toLowerCase() || '').includes(searchLower) ||
      (staff.nomor_petugas?.toLowerCase() || '').includes(searchLower) ||
      (staff.jabatan?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handleAddPetugas = async (petugasData: Omit<Petugas, 'id_petugas' | 'created_at' | 'updated_at'>) => {
    try {
      await addPetugas(petugasData);
      setShowForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add petugas');
    }
  };

  const handleUpdatePetugas = async (petugasData: Omit<Petugas, 'id_petugas' | 'created_at' | 'updated_at'>) => {
    if (!editingPetugas?.id_petugas) return;
    
    try {
      await updatePetugas(editingPetugas.id_petugas, petugasData);
      setShowForm(false);
      setEditingPetugas(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update petugas');
    }
  };

  const handleDeletePetugas = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus petugas ini?')) return;
    
    try {
      await deletePetugas(id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete petugas');
    }
  };

  const handleEdit = (staff: Petugas) => {
    setEditingPetugas(staff);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPetugas(null);
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, nomor, atau jabatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Petugas</h2>
          <p className="text-sm text-gray-600">Menampilkan {filteredPetugas.length} dari {petugas.length} petugas</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Petugas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jabatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPetugas.map((staff) => (
                <tr key={staff.id_petugas} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{staff.nama_petugas}</div>
                        <div className="text-sm text-gray-500">{staff.nomor_petugas}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 capitalize">{staff.jabatan}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{staff.telepon}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-900">{staff.alamat}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePetugas(staff.id_petugas)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPetugas.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada petugas</h3>
            <p className="text-gray-600">Belum ada data petugas yang tersedia</p>
          </div>
        )}
      </div>

      {/* Petugas Form Modal */}
      {showForm && (
        <PetugasForm
          onSuccess={editingPetugas ? handleUpdatePetugas : handleAddPetugas}
          onClose={handleCloseForm}
          editingPetugas={editingPetugas || undefined}
        />
      )}
    </div>
  );
};

export default PetugasPage; 