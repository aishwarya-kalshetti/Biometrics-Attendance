import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import UploadData from './pages/UploadData';
import AllEmployees from './pages/AllEmployees';
import IndividualReport from './pages/IndividualReport';
import Settings from './pages/Settings';

function App() {
  const getCurrentPageTitle = () => {
    const path = window.location.pathname;
    const titles = {
      '/': 'Dashboard',
      '/upload': 'Upload Data',
      '/employees': 'All Employees',
      '/settings': 'Settings'
    };

    if (path.startsWith('/employee/')) {
      return 'Employee Report';
    }

    return titles[path] || 'Dashboard';
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <Header title={getCurrentPageTitle()} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadData />} />
            <Route path="/employees" element={<AllEmployees />} />
            <Route path="/employee/:code" element={<IndividualReport />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
