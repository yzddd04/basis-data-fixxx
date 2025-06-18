import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Petugas } from '../types';
import { Plus, Edit, Trash2, Phone, MapPin, Briefcase } from 'lucide-react';
import PetugasForm from '../components/staff/PetugasForm';

const StaffPage: React.FC = () => {
  const { petugas, addPetugas, updatePetugas, deletePetugas } = useLibrary();
  const [showForm, setShowForm] = useState(false);
  const [editingPetugas, setEditingPetugas] = useState<Petugas | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPetugas = petugas?.filter(p => 
    p?.nama_petugas?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
      setEditingPetugas(undefined);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manajemen Petugas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tambah Petugas
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari petugas..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPetugas.map((p, idx) => (
          <div key={p.id_petugas || `petugas-${idx}`}
            className="bg-white rounded-xl shadow p-6 flex flex-col justify-between border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">{p.nama_petugas}</h2>
            </div>
            <div className="text-sm text-gray-700 space-y-1 mb-2">
              <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-gray-400" />{p.jabatan}</div>
              <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-400" />{p.telepon}</div>
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" />{p.alamat}</div>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              <div>Dibuat : {p.created_at ? new Date(p.created_at).toLocaleString('id-ID') : '-'}</div>
              <div>Diupdate : {p.updated_at ? new Date(p.updated_at).toLocaleString('id-ID') : '-'}</div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setEditingPetugas(p);
                  setShowForm(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-100"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDeletePetugas(p.id_petugas)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-100"
              >
                <Trash2 className="w-4 h-4" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPetugas.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada petugas</h3>
          <p className="text-gray-600">Belum ada data petugas yang tersedia</p>
        </div>
      )}

      {showForm && (
        <PetugasForm
          onSuccess={editingPetugas ? handleUpdatePetugas : handleAddPetugas}
          onClose={() => {
            setShowForm(false);
            setEditingPetugas(undefined);
          }}
          editingPetugas={editingPetugas}
        />
      )}
    </div>
  );
};

export default StaffPage;