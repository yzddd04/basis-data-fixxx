import React from 'react';
import { LibraryProvider } from './context/LibraryContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import MembersPage from './pages/MembersPage';
import StaffPage from './pages/StaffPage';
import BorrowingPage from './pages/BorrowingPage';
import ReturnsPage from './pages/ReturnsPage';
import ReportsPage from './pages/ReportsPage';
import TrashPage from './pages/TrashPage';

function App() {
  return (
    <LibraryProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/borrowing" element={<BorrowingPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/trash" element={<TrashPage />} />
          </Routes>
        </Layout>
      </Router>
    </LibraryProvider>
  );
}

export default App;