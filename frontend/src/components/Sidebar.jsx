import axiosInstance from '../utils/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaCheckCircle, FaChartLine, FaQuestionCircle, FaSignOutAlt, FaUserCircle, FaCog, FaCalendarAlt, FaUsers, FaRobot } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Sidebar = ({ isCollapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({ full_name: '', profile_photo: '', role: '' });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get('auth/settings', { withCredentials: true });
      setUserInfo(response.data);
    } catch (err) {
      console.error('Kullanıcı bilgileri alınamadı:', err);
    }
  };

  let menuItems = [];
  if (userInfo && userInfo.role === 'etut') {
    menuItems = [
      { to: '/dashboard', icon: <FaHome />, label: 'Anasayfa' },
      { to: '/student-management', icon: <FaUsers />, label: 'Öğrenci Yönetimi' },
      { to: '/statistics', icon: <FaChartLine />, label: 'Genel İstatistikler' },
      { to: '/topic-tracking', icon: <FaBook />, label: 'Konu Takibi' },
      { to: '/question-analysis', icon: <FaQuestionCircle />, label: 'Soru Analizi' },
      { to: '/ai-consultant', icon: <FaRobot />, label: 'AI Danışman' },
    ];
  } else if (userInfo && userInfo.role === 'student') {
    menuItems = [
      { to: '/dashboard', icon: <FaHome />, label: 'Anasayfa' },
      { to: '/program', icon: <FaBook />, label: 'Matematik Programım' },
      { to: '/questions', icon: <FaQuestionCircle />, label: 'Soru Takip' },
      { to: '/topics', icon: <FaCheckCircle />, label: 'Konu Tamamlama' },
      { to: '/nets', icon: <FaChartLine />, label: 'Net Girişi' },
      { to: '/ai-consultant', icon: <FaRobot />, label: 'AI Danışman' },
    ];
  }

  const handleLogout = async () => {
    try {
      await axiosInstance.get('auth/logout', { withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error("Çıkış yapılırken hata oluştu:", err);
    }
  };

  return (
    <div className={`h-screen bg-gradient-to-b from-blue-700 to-blue-500 text-white flex flex-col p-3 md:p-5 space-y-4 fixed justify-between transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div>
        <div className="flex flex-col items-center mb-8">
          {userInfo.profile_photo ? (
            <img
              src={userInfo.profile_photo}
              alt="Profil"
              className="w-12 h-12 rounded-full object-cover mb-2"
            />
          ) : (
            <FaUserCircle className="text-4xl mb-2" />
          )}
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg">{userInfo.full_name}</span>
              <Link to="/settings" className="text-white hover:text-blue-200">
                <FaCog />
              </Link>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mb-8">
          {!isCollapsed && <h2 className="text-2xl font-bold">YKS Takip</h2>}
          <button
            onClick={() => onCollapse(!isCollapsed)}
            className="p-2 rounded hover:bg-blue-700"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="flex flex-col space-y-2">
          {menuItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`p-2 rounded flex items-center transition-colors duration-200 hover:bg-blue-700 ${location.pathname === item.to ? 'bg-white/20 border-l-4 border-yellow-300 font-bold' : ''}`}
            >
              <span className="mr-2 text-lg">{item.icon}</span>
              {!isCollapsed && item.label}
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg w-full mt-8 flex items-center justify-center transition-colors duration-200"
      >
        <span className="mr-2 text-lg"><FaSignOutAlt /></span>
        {!isCollapsed && "Çıkış Yap"}
      </button>
    </div>
  );
};

export default Sidebar;