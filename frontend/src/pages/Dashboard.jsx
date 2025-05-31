import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { FaUsers, FaChartLine, FaBook, FaQuestionCircle } from 'react-icons/fa';
import { ChartBarIcon } from '@heroicons/react/24/solid';

const yksDate = new Date('2025-06-15T09:00:00');

function YKSSayac() {
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const diff = yksDate - now;
            setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
        };
        update();
        const timer = setInterval(update, 60 * 60 * 1000); // Her saat başı güncelle
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ position: 'absolute', top: 24, right: 24, background: '#fff', borderRadius: 8, padding: '12px 20px', boxShadow: '0 2px 8px #0001', zIndex: 10 }}>
            <span style={{ fontWeight: 'bold', color: '#1976d2' }}>YKS'ye Kalan Gün:</span> <span style={{ fontSize: 22, fontWeight: 'bold' }}>{daysLeft}</span>
        </div>
    );
}

const Dashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
        fetchActivities();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/auth/settings');
            setUserInfo(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Kullanıcı bilgileri alınamadı:', err);
            setLoading(false);
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await axiosInstance.get('/auth/activities');
            setActivities(response.data);
        } catch (err) {
            console.error('Aktiviteler alınamadı:', err);
        }
    };

    const formatTimeAgo = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Az önce';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
        return `${Math.floor(diffInSeconds / 86400)} gün önce`;
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
    if (!userInfo) return <div>Kullanıcı bilgileri alınamadı</div>;

    // Etüt merkezi kullanıcıları için özel dashboard
    if (userInfo.role === 'etut') {
        return (
            <div style={{ position: 'relative', minHeight: '100vh' }}>
                <YKSSayac />
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Etüt Merkezi Yönetim Paneli</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="relative bg-gradient-to-br from-green-200 via-blue-100 to-yellow-100 rounded-2xl shadow-2xl p-8 hover:scale-[1.025] hover:shadow-3xl transition-all duration-300 border border-green-100">
                            <div className="absolute -top-5 -right-5 bg-green-500 rounded-full p-3 shadow-lg">
                                <ChartBarIcon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-green-800 mb-6 tracking-tight flex items-center gap-2">
                                Genel Performans
                            </h3>
                            <div className="flex items-center mb-4">
                                <FaUsers className="text-4xl text-blue-500 mr-4" />
                                <h2 className="text-xl font-semibold">Öğrenci Yönetimi</h2>
                            </div>
                            <p className="text-gray-600">
                                Öğrencileri görüntüleyin, detaylarını inceleyin ve yönetin.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center mb-4">
                                <FaChartLine className="text-4xl text-green-500 mr-4" />
                                <h2 className="text-xl font-semibold">Genel İstatistikler</h2>
                            </div>
                            <p className="text-gray-600">
                                Tüm öğrencilerin genel performans istatistiklerini görüntüleyin.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center mb-4">
                                <FaBook className="text-4xl text-purple-500 mr-4" />
                                <h2 className="text-xl font-semibold">Konu Takibi</h2>
                            </div>
                            <p className="text-gray-600">
                                Öğrencilerin konu tamamlama durumlarını takip edin.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center mb-4">
                                <FaQuestionCircle className="text-4xl text-orange-500 mr-4" />
                                <h2 className="text-xl font-semibold">Soru Analizi</h2>
                            </div>
                            <p className="text-gray-600">
                                Öğrencilerin soru çözme performanslarını analiz edin.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Öğrenci kullanıcıları için normal dashboard
    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <YKSSayac />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Hoş Geldiniz, {userInfo.full_name}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <FaBook className="text-4xl text-purple-500 mr-4" />
                            <h2 className="text-xl font-semibold">Konular</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Tamamlanan konularınızı görüntüleyin ve yeni konular ekleyin.
                        </p>
                        <button 
                            onClick={() => navigate('/topics')}
                            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition-colors"
                        >
                            Konulara Git
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <FaQuestionCircle className="text-4xl text-blue-500 mr-4" />
                            <h2 className="text-xl font-semibold">Sorular</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Çözdüğünüz soruları kaydedin ve istatistiklerinizi görüntüleyin.
                        </p>
                        <button 
                            onClick={() => navigate('/questions')}
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Sorulara Git
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center mb-4">
                            <FaChartLine className="text-4xl text-green-500 mr-4" />
                            <h2 className="text-xl font-semibold">Netler</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Net sayılarınızı kaydedin ve gelişiminizi takip edin.
                        </p>
                        <button 
                            onClick={() => navigate('/nets')}
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
                        >
                            Netlere Git
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4">Son Aktiviteler</h2>
                    <div className="space-y-4">
                        {activities.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Henüz aktivite bulunmuyor.</p>
                        ) : (
                            activities.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                                    <div className="flex items-center">
                                        {activity.icon === 'book' && <FaBook className="text-2xl text-purple-500 mr-4" />}
                                        {activity.icon === 'question-circle' && <FaQuestionCircle className="text-2xl text-blue-500 mr-4" />}
                                        {activity.icon === 'chart-line' && <FaChartLine className="text-2xl text-green-500 mr-4" />}
                                        <div>
                                            <h3 className="font-semibold">{activity.title}</h3>
                                            <p className="text-gray-600">{activity.description}</p>
                                        </div>
                                    </div>
                                    <span className="text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
