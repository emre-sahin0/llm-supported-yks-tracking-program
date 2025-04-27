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

axios.defaults.withCredentials = true;

function Layout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/" || location.pathname === "/register";

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}
      <div className={hideSidebar ? 'w-full p-8' : 'flex-1 ml-64 p-8'}>
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
