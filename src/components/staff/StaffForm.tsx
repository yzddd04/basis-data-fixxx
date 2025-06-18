import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Petugas } from '../../types';

interface StaffFormProps {
  staff?: Petugas | null;
  onSubmit: (staff: Omit<Petugas, 'id_petugas' | 'created_at' | 'updated_at'>) => void;
  onClose: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({ staff, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    nama_petugas: '',
    jabatan: '',
    telepon: '',
    alamat: '',
    is_deleted: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (staff) {
      setFormData({
        nama_petugas: staff.nama_petugas,
        jabatan: staff.jabatan,
        telepon: staff.telepon,
        alamat: staff.alamat,
        is_deleted: staff.is_deleted
      });
    }
  }, [staff]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama_petugas.trim()) {
      newErrors.nama_petugas = 'Nama petugas harus diisi';
    }

    if (!formData.jabatan.trim()) {
      newErrors.jabatan = 'Jabatan harus diisi';
    }

    if (!formData.telepon.trim()) {
      newErrors.telepon = 'Nomor telepon harus diisi';
    } else if (!/^[0-9+\-\s]+$/.test(formData.telepon)) {
      newErrors.telepon = 'Nomor telepon tidak valid';
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat harus diisi';
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

  const positions = [
    'Kepala Perpustakaan',
    'Pustakawan',
    'Asisten Pustakawan',
    'Petugas Sirkulasi',
    'Petugas Katalog',
    'Petugas Administrasi'
  ];

  return (
    <div
      className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-gray-900 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {staff ? 'Edit Petugas' : 'Tambah Petugas Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Nama Petugas *
              </label>
              <input
                type="text"
                name="nama_petugas"
                value={formData.nama_petugas}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nama_petugas ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama petugas"
              />
              {errors.nama_petugas && (
                <p className="mt-1 text-sm text-red-600">{errors.nama_petugas}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Jabatan *
              </label>
              <select
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.jabatan ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih jabatan</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
              {errors.jabatan && (
                <p className="mt-1 text-sm text-red-600">{errors.jabatan}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
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
                <p className="mt-1 text-sm text-red-600">{errors.telepon}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
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
              <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>
            )}
          </div>

          <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
            >
              {staff ? 'Update Petugas' : 'Tambah Petugas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;