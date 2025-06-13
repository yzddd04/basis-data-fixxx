import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Book, 
  Users, 
  UserCheck, 
  BookOpen, 
  BookCheck, 
  BarChart3, 
  Trash2, 
  X,
  Library
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Manajemen Buku', href: '/books', icon: Book },
  { name: 'Manajemen Anggota', href: '/members', icon: Users },
  { name: 'Manajemen Petugas', href: '/staff', icon: UserCheck },
  { name: 'Transaksi Peminjaman', href: '/borrowing', icon: BookOpen },
  { name: 'Transaksi Pengembalian', href: '/returns', icon: BookCheck },
  { name: 'Laporan', href: '/reports', icon: BarChart3 },
  { name: 'Sampah', href: '/trash', icon: Trash2 },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Library className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Perpustakaan</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-left">
            Sistem Manajemen Perpustakaan v1.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;