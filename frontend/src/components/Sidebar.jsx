import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Sidebar = ({ isCollapsed, onCollapse }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/auth/logout', { withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error("Çıkış yapılırken hata oluştu:", err);
    }
  };

  return (
    <div className={`h-screen bg-blue-600 text-white flex flex-col p-5 space-y-4 fixed justify-between transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div>
        <div className="flex justify-between items-center mb-8">
          {!isCollapsed && <h2 className="text-2xl font-bold">YKS Takip</h2>}
          <button
            onClick={() => onCollapse(!isCollapsed)}
            className="p-2 rounded hover:bg-blue-700"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="flex flex-col space-y-4">
          <Link to="/dashboard" className="hover:bg-blue-700 p-2 rounded flex items-center">
            <span className="mr-2">🏠</span>
            {!isCollapsed && "Anasayfa"}
          </Link>
          <Link to="/program" className="hover:bg-blue-700 p-2 rounded flex items-center">
            <span className="mr-2">📚</span>
            {!isCollapsed && "Matematik Programım"}
          </Link>
          <Link to="/questions" className="hover:bg-blue-700 p-2 rounded flex items-center">
            <span className="mr-2">📝</span>
            {!isCollapsed && "Soru Takip"}
          </Link>
          <Link to="/topics" className="hover:bg-blue-700 p-2 rounded flex items-center">
            <span className="mr-2">✅</span>
            {!isCollapsed && "Konu Tamamlama"}
          </Link>
          <Link to="/nets" className="hover:bg-blue-700 p-2 rounded flex items-center">
            <span className="mr-2">📈</span>
            {!isCollapsed && "Net Girişi"}
          </Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg w-full mt-8 flex items-center justify-center"
      >
        <span className="mr-2">🚪</span>
        {!isCollapsed && "Çıkış Yap"}
      </button>
    </div>
  );
};

export default Sidebar;