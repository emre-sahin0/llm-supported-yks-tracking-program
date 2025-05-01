import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProgramPage from './pages/ProgramPage';
import QuestionsPage from './pages/QuestionsPage';
import TopicsPage from './pages/TopicsPage';
import NetsPage from './pages/NetsPage';
import Sidebar from './components/Sidebar';
import axios from 'axios';
import { useState } from 'react';

axios.defaults.withCredentials = true;

function Layout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/" || location.pathname === "/register";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!hideSidebar && <Sidebar isCollapsed={isSidebarCollapsed} onCollapse={setIsSidebarCollapsed} />}
      <div className={`flex-1 transition-all duration-300 ${hideSidebar ? 'w-full' : isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/program" element={<ProgramPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/nets" element={<NetsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
