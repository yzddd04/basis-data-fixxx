import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex" key="layout-root">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} key="sidebar" />
      <div className="flex-1 flex flex-col" key="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} key="header" />
        <main className="flex-1 py-6" key="main">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" key="container">
            <Breadcrumb key="breadcrumb" />
            <div className="mt-6" key="content">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;