import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProgramPage from './pages/ProgramPage';
import QuestionsPage from './pages/QuestionsPage';
import TopicsPage from './pages/TopicsPage';
import NetsPage from './pages/NetsPage';
import SettingsPage from './pages/SettingsPage';
import AIConsultantPage from './pages/AIConsultantPage';
import Sidebar from './components/Sidebar';
import axios from 'axios';
import { useState } from 'react';
import StudentManagement from './pages/StudentManagement';
import PerformancePage from './pages/PerformancePage';
import './styles/backgrounds.css';
import { AuthProvider } from './contexts/AuthContext';

function Layout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/" || location.pathname === "/register";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={`flex min-h-screen ${hideSidebar ? 'auth-background' : 'main-background'}`}>
      {!hideSidebar && <Sidebar isCollapsed={isSidebarCollapsed} onCollapse={setIsSidebarCollapsed} />}
      <div className={`flex-1 transition-all duration-300 ${hideSidebar ? 'w-full' : isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="max-w-full px-2 sm:px-4 md:px-8 py-2 md:py-4 mx-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/program" element={<ProgramPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/nets" element={<NetsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/student-management" element={<StudentManagement />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/ai-consultant" element={<AIConsultantPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App; 