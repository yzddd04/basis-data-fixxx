import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const breadcrumbMap: Record<string, string> = {
  '/': 'Dashboard',
  '/books': 'Manajemen Buku',
  '/members': 'Manajemen Anggota',
  '/staff': 'Manajemen Petugas',
  '/borrowing': 'Transaksi Peminjaman',
  '/returns': 'Transaksi Pengembalian',
  '/reports': 'Laporan',
  '/trash': 'Sampah',
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {breadcrumbMap[to] || value}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                  >
                    {breadcrumbMap[to] || value}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;