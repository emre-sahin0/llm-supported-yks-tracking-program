import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axios';
import { FaTrash, FaSearch, FaEye, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentDetails, setStudentDetails] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    const checkUserRole = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/auth/settings');
            if (response.data.role !== 'etut') {
                navigate('/dashboard');
            }
            setUserRole(response.data.role);
        } catch (err) {
            console.error('Kullanıcı rolü kontrol edilemedi:', err);
            navigate('/dashboard');
        }
    }, [navigate]);

    useEffect(() => {
        checkUserRole();
        fetchStudents();
    }, [checkUserRole]);

    const fetchStudents = async () => {
        try {
            const response = await axiosInstance.get('/auth/students');
            setStudents(response.data);
            setLoading(false);
        } catch (err) {
            setError('Öğrenciler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    const fetchStudentDetails = async (studentId) => {
        try {
            const response = await axiosInstance.get(`/auth/students/${studentId}/details`);
            setStudentDetails(response.data);
        } catch (err) {
            setError('Öğrenci detayları yüklenirken bir hata oluştu');
        }
    };

    const handleDelete = async (studentId) => {
        if (window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
            try {
                await axiosInstance.delete(`/auth/students/${studentId}`);
                setStudents(students.filter(student => student.id !== studentId));
                if (selectedStudent === studentId) {
                    setSelectedStudent(null);
                    setStudentDetails(null);
                }
            } catch (err) {
                setError('Öğrenci silinirken bir hata oluştu: ' + (err.response?.data?.message || 'Bilinmeyen hata'));
            }
        }
    };

    const handleViewDetails = async (studentId) => {
        try {
            setSelectedStudent(studentId);
            await fetchStudentDetails(studentId);
        } catch (err) {
            setError('Öğrenci detayları görüntülenirken bir hata oluştu');
        }
    };

    const filteredStudents = students.filter(student =>
        student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
    if (error) return <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">{error}</div>;
    if (userRole !== 'etut') return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Öğrenci Yönetimi</h1>
            
            {/* Arama Çubuğu */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Öğrenci ara..."
                        className="w-full p-2 pl-10 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
            </div>

            <div className="flex gap-6">
                {/* Öğrenci Listesi */}
                <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kullanıcı Adı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ad Soyad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kayıt Tarihi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className={selectedStudent === student.id ? 'bg-blue-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {student.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {student.full_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(student.created_at).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleViewDetails(student.id)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                            title="Detayları Görüntüle"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student.id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Öğrenciyi Sil"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Öğrenci Detayları */}
                {selectedStudent && studentDetails && (
                    <div className="w-1/3 bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Öğrenci Detayları</h2>
                            <button
                                onClick={() => {
                                    setSelectedStudent(null);
                                    setStudentDetails(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Net İstatistikleri</h3>
                                <div className="bg-gray-50 p-4 rounded">
                                    <p>Toplam Net Girişi: {studentDetails.total_net_records}</p>
                                    <p>Son Net Girişi: {studentDetails.last_net_date}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Konu İstatistikleri</h3>
                                <div className="bg-gray-50 p-4 rounded">
                                    <p>Tamamlanan Konular: {studentDetails.completed_topics}</p>
                                    <p>Toplam Konu: {studentDetails.total_topics}</p>
                                    <p>Tamamlanma Oranı: {studentDetails.completion_rate}%</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Soru İstatistikleri</h3>
                                <div className="bg-gray-50 p-4 rounded">
                                    <p>Çözülen Soru: {studentDetails.solved_questions}</p>
                                    <p>Doğru Sayısı: {studentDetails.correct_answers}</p>
                                    <p>Başarı Oranı: {studentDetails.success_rate}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentManagement; 