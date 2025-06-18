import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Plus, Search, Edit, Trash2, Users, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import MemberForm from '../components/members/MemberForm';
import { Anggota } from '../types';

const MembersPage: React.FC = () => {
  const { anggota, addAnggota, updateAnggota, deleteAnggota } = useLibrary();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Anggota | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredMembers = anggota.filter(member => {
    const matchesSearch = (
      (member.nama_lengkap && member.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.nomor_anggota && member.nomor_anggota.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const matchesStatus = !statusFilter || member.status_aktif === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddMember = (memberData: Omit<Anggota, 'id_anggota' | 'nomor_anggota' | 'created_at' | 'updated_at'>) => {
    addAnggota(memberData);
    setShowForm(false);
  };

  const handleUpdateMember = async (memberData: Omit<Anggota, 'id_anggota' | 'nomor_anggota' | 'created_at' | 'updated_at'>) => {
    if (editingMember && editingMember.id_anggota) {
      try {
        await updateAnggota(editingMember.id_anggota, memberData);
        setEditingMember(null);
        setShowForm(false);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Gagal update anggota!');
      }
    } else {
      alert('ID anggota tidak valid!');
    }
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      try {
        deleteAnggota(id, 'Admin');
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
      }
    }
  };

  const handleEdit = (member: Anggota) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  return (
    <div className="space-y-6" key="members-page-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between" key="header">
        <div key="header-text">
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Anggota</h1>
          <p className="text-gray-600 mt-1">Kelola data anggota perpustakaan</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          key="add-button"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Anggota
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6" key="filters">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative" key="search">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama, nomor anggota, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div key="status-filter">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option key="all" value="">Semua Status</option>
              <option key="aktif" value="aktif">Aktif</option>
              <option key="non-aktif" value="non-aktif">Non-Aktif</option>
            </select>
          </div>
          <div key="member-count" className="text-sm text-gray-600 flex items-center">
            Menampilkan {filteredMembers.length} dari {anggota.length} anggota
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" key="members-grid">
        {filteredMembers.map((member: Anggota, idx: number) => (
          <div key={member.id_anggota || idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.nama_lengkap}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-2">{member.nomor_anggota}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-1"> 
                    <Mail className="w-4 h-4 mr-1" />
                    {member.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-1"> 
                    <Phone className="w-4 h-4 mr-1" />
                    {member.telepon}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-1"> 
                    <Calendar className="w-4 h-4 mr-1" />
                    Bergabung: {new Date(member.tanggal_daftar).toLocaleDateString('id-ID')}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-1"> 
                    <MapPin className="w-4 h-4 mr-1" />
                    {member.alamat}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    member.status_aktif === 'aktif'
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status_aktif === 'aktif' ? 'Aktif' : 'Non-Aktif'}
                  </span>
                </div>
              </div>
              
              <div className="mb-2 text-xs text-gray-500">
                Dibuat : {new Date(member.created_at).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </div>
              <div className="mb-4 text-xs text-gray-500">
                Diupdate : {new Date(member.updated_at).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id_anggota)}
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

      {filteredMembers.length === 0 && (
        <div className="text-center py-12" key="empty-state">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada anggota ditemukan</h3>
          <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter status</p>
        </div>
      )}

      {/* Member Form Modal */}
      {showForm && (
        <MemberForm
          key="member-form"
          member={editingMember}
          onSubmit={editingMember ? handleUpdateMember : handleAddMember}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default MembersPage;