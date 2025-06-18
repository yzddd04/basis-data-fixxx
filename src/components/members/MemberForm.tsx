import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Anggota } from '../../types';

interface MemberFormProps {
  member?: Anggota | null;
  onSubmit: (member: Omit<Anggota, 'id_anggota' | 'nomor_anggota' | 'created_at' | 'updated_at'>) => void;
  onClose: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    alamat: '',
    telepon: '',
    email: '',
    tanggal_daftar: new Date().toISOString().split('T')[0],
    status_aktif: 'aktif' as 'aktif' | 'non-aktif',
    is_deleted: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member) {
      setFormData({
        nama_lengkap: member.nama_lengkap,
        alamat: member.alamat,
        telepon: member.telepon,
        email: member.email,
        tanggal_daftar: member.tanggal_daftar,
        status_aktif: member.status_aktif,
        is_deleted: member.is_deleted
      });
    } else {
      setFormData({
        nama_lengkap: '',
        alamat: '',
        telepon: '',
        email: '',
        tanggal_daftar: new Date().toISOString().split('T')[0],
        status_aktif: 'aktif',
        is_deleted: false
      });
      setErrors({});
    }
  }, [member]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama_lengkap.trim()) {
      newErrors.nama_lengkap = 'Nama lengkap harus diisi';
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat harus diisi';
    }

    if (!formData.telepon.trim()) {
      newErrors.telepon = 'Nomor telepon harus diisi';
    } else if (!/^[0-9+\-\s]+$/.test(formData.telepon)) {
      newErrors.telepon = 'Nomor telepon tidak valid';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.tanggal_daftar) {
      newErrors.tanggal_daftar = 'Tanggal daftar harus diisi';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
            {member ? 'Edit Anggota' : 'Tambah Anggota Baru'}
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nama_lengkap ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.nama_lengkap && (
                <p className="text-red-600 text-sm mt-1">{errors.nama_lengkap}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="contoh@email.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon *
              </label>
              <input
                type="tel"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.telepon ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="081234567890"
              />
              {errors.telepon && (
                <p className="text-red-600 text-sm mt-1">{errors.telepon}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Daftar *
              </label>
              <input
                type="date"
                name="tanggal_daftar"
                value={formData.tanggal_daftar}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.tanggal_daftar ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.tanggal_daftar && (
                <p className="text-red-600 text-sm mt-1">{errors.tanggal_daftar}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status_aktif"
                value={formData.status_aktif}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="aktif">Aktif</option>
                <option value="non-aktif">Non-Aktif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat *
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.alamat ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Masukkan alamat lengkap"
            />
            {errors.alamat && (
              <p className="text-red-600 text-sm mt-1">{errors.alamat}</p>
            )}
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
              {member ? 'Update Anggota' : 'Tambah Anggota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;