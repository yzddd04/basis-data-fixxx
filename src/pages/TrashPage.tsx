import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Trash2, RotateCcw, X, AlertTriangle } from 'lucide-react';

const TrashPage: React.FC = () => {
  const { sampah, restoreFromTrash, permanentDelete } = useLibrary();

  const handleRestore = (id: number) => {
    if (confirm('Apakah Anda yakin ingin memulihkan data ini?')) {
      restoreFromTrash(id);
    }
  };

  const handlePermanentDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini secara permanen? Tindakan ini tidak dapat dibatalkan.')) {
      permanentDelete(id);
    }
  };

  const getTableDisplayName = (tableName: string) => {
    const tableNames: Record<string, string> = {
      'buku': 'Buku',
      'anggota': 'Anggota',
      'petugas': 'Petugas'
    };
    return tableNames[tableName] || tableName;
  };

  const getDataPreview = (dataBackup: string, tableName: string) => {
    try {
      const data = JSON.parse(dataBackup);
      switch (tableName) {
        case 'buku':
          return `${data.judul_buku} - ${data.pengarang}`;
        case 'anggota':
          return `${data.nama_lengkap} (${data.nomor_anggota})`;
        case 'petugas':
          return `${data.nama_petugas} - ${data.jabatan}`;
        default:
          return 'Data tidak dikenal';
      }
    } catch {
      return 'Data tidak valid';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sampah</h1>
          <p className="text-gray-600 mt-1">Kelola data yang telah dihapus</p>
        </div>
        <div className="mt-4 sm:mt-0 text-sm text-gray-500">
          {sampah.length} item dalam sampah
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
          <div>
            <p className="text-yellow-800 font-medium">Perhatian</p>
            <p className="text-yellow-700 text-sm">
              Data yang dihapus secara permanen tidak dapat dipulihkan. Pastikan Anda yakin sebelum melakukan tindakan ini.
            </p>
          </div>
        </div>
      </div>

      {/* Trash Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {sampah.length === 0 ? (
          <div className="text-center py-12">
            <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sampah kosong</h3>
            <p className="text-gray-600">Tidak ada data yang dihapus</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dihapus Oleh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Dihapus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampah.map((item) => (
                  <tr key={item.id_sampah} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getTableDisplayName(item.nama_tabel)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {getDataPreview(item.data_backup, item.nama_tabel)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {item.id_data_asli}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.dihapus_oleh}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.tanggal_dihapus).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleRestore(item.id_sampah)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Pulihkan
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(item.id_sampah)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Hapus Permanen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Informasi Sampah:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Data yang dipulihkan akan kembali ke status aktif</li>
            <li>Data yang dihapus permanen tidak dapat dipulihkan</li>
            <li>Sampah akan dibersihkan otomatis setelah 30 hari</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrashPage;