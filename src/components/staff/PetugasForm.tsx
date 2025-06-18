import React, { useState } from 'react';
import { X, User, Phone, MapPin, Briefcase } from 'lucide-react';
import { Petugas } from '../../types';

interface PetugasFormProps {
  onSuccess: (data: Omit<Petugas, 'id_petugas' | 'created_at' | 'updated_at'>) => void;
  onClose: () => void;
  editingPetugas?: Petugas;
}

const PetugasForm: React.FC<PetugasFormProps> = ({ onSuccess, onClose, editingPetugas }) => {
  const [formData, setFormData] = useState({
    nama_petugas: editingPetugas?.nama_petugas || '',
    jabatan: editingPetugas?.jabatan || 'asisten pustakawan',
    telepon: editingPetugas?.telepon || '',
    alamat: editingPetugas?.alamat || '',
    is_deleted: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama_petugas) {
      newErrors.nama_petugas = 'Nama petugas harus diisi';
    }

    if (!formData.telepon) {
      newErrors.telepon = 'Nomor telepon harus diisi';
    }

    if (!formData.alamat) {
      newErrors.alamat = 'Alamat harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      onSuccess(formData);
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
          <h2 className="text-xl font-semibold text-gray-900">
            {editingPetugas ? 'Edit Petugas' : 'Tambah Petugas'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nama Petugas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Petugas *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.nama_petugas}
                onChange={(e) => setFormData({ ...formData, nama_petugas: e.target.value })}
                className={`pl-10 w-full px-3 py-2 border ${
                  errors.nama_petugas ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Masukkan nama petugas"
              />
            </div>
            {errors.nama_petugas && (
              <p className="mt-1 text-sm text-red-600">{errors.nama_petugas}</p>
            )}
          </div>

          {/* Jabatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jabatan *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.jabatan}
                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value as Petugas['jabatan'] })}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asisten pustakawan">Asisten Pustakawan</option>
                <option value="pustakawan">Pustakawan</option>
                <option value="petugas administrasi">Petugas Administrasi</option>
              </select>
            </div>
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className={`pl-10 w-full px-3 py-2 border ${
                  errors.telepon ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Masukkan nomor telepon"
              />
            </div>
            {errors.telepon && (
              <p className="mt-1 text-sm text-red-600">{errors.telepon}</p>
            )}
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                rows={3}
                className={`pl-10 w-full px-3 py-2 border ${
                  errors.alamat ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Masukkan alamat lengkap"
              />
            </div>
            {errors.alamat && (
              <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingPetugas ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetugasForm; 