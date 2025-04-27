import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Sidebar = () => {
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
    <div className="h-screen w-64 bg-blue-600 text-white flex flex-col p-5 space-y-4 fixed justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8">YKS Takip</h2>

        <nav className="flex flex-col space-y-4">
          <Link to="/dashboard" className="hover:bg-blue-700 p-2 rounded">🏠 Anasayfa</Link>
          <Link to="/program" className="hover:bg-blue-700 p-2 rounded">📚 Matematik Programım</Link>
          <Link to="/questions" className="hover:bg-blue-700 p-2 rounded">📝 Soru Takip</Link>
          <Link to="/topics" className="hover:bg-blue-700 p-2 rounded">✅ Konu Tamamlama</Link>
          <Link to="/nets" className="hover:bg-blue-700 p-2 rounded">📈 Net Girişi</Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg w-full mt-8"
      >
        🚪 Çıkış Yap
      </button>
    </div>
  );
};

export default Sidebar;