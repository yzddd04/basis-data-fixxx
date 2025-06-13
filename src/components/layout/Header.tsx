import React from 'react';
import { Menu } from 'lucide-react';
import { useGlobalDate } from '../../context/LibraryContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { globalDate, setGlobalDate } = useGlobalDate();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="text-sm text-gray-700 flex flex-col items-end">
          <div className="text-gray-500">{globalDate.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
          <input
            type="date"
            value={globalDate.toISOString().split('T')[0]}
            onChange={e => setGlobalDate(new Date(e.target.value))}
            className="mt-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style={{ width: 140 }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;