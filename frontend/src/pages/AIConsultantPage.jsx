import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Card, CardContent, Grid, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AIConsultantPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTYT, setShowTYT] = useState(false);
  const [showAYT, setShowAYT] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchStudentData();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`/api/ai/students/${user.id}/data`);
      setStudentData(response.data);
    } catch (err) {
      setError('Öğrenci verileri yüklenirken bir hata oluştu.');
    }
  };

  const getAIAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/ai/analyze', {
        studentId: user.id,
        data: studentData
      });
      setAnalysis(response.data.recommendations);
    } catch (err) {
      setError('AI analizi sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = () => {
    if (!studentData?.recentActivity) return [];
    return Object.entries(studentData.recentActivity).map(([date, count]) => ({
      date,
      count
    }));
  };

  // Yardımcı fonksiyon: Aylık özetleri hazırla
  const getMonthlyStats = (netRecords = [], completedTopics = [], monthlyQuestionCounts = {}) => {
    const stats = {};
    netRecords.forEach(rec => {
      if (!rec.tarih) return;
      const month = rec.tarih.slice(0, 7); // YYYY-MM
      if (!stats[month]) stats[month] = { tytNet: [], aytNet: [], totalNet: 0, count: 0, totalQuestions: 0 };
      if (rec.exam_type && rec.exam_type.toLowerCase().includes('tyt')) {
        stats[month].tytNet.push(rec.total_net);
      } else if (rec.exam_type && rec.exam_type.toLowerCase().includes('ayt')) {
        stats[month].aytNet.push(rec.total_net);
      }
      stats[month].totalNet += rec.total_net;
      stats[month].count += 1;
    });
    // Tamamlanan konuları da ay bazında say
    const topicStats = {};
    completedTopics.forEach(topic => {
      if (topic.completed_at) {
        const month = topic.completed_at.slice(0, 7);
        if (!topicStats[month]) topicStats[month] = 0;
        topicStats[month] += 1;
      }
    });
    // Toplam soru sayısını ekle
    Object.keys(stats).forEach(month => {
      stats[month].totalQuestions = monthlyQuestionCounts[month] || 0;
    });
    return { stats, topicStats };
  };

  const { stats: monthlyStats, topicStats } = getMonthlyStats(studentData?.netRecords || [], studentData?.completedTopics || [], studentData?.monthlyQuestionCounts || {});
  const months = Object.keys(monthlyStats).slice(-6);

  // Bu ayın TYT ve AYT sınavlarını ayıkla
  let thisMonth = '';
  if (studentData?.netRecords?.length) {
    thisMonth = studentData.netRecords[studentData.netRecords.length - 1]?.tarih?.slice(0, 7);
  }
  const thisMonthTYT = studentData?.netRecords?.filter(rec => rec.tarih && rec.tarih.slice(0, 7) === thisMonth && rec.exam_type?.toLowerCase().includes('tyt')) || [];
  const thisMonthAYT = studentData?.netRecords?.filter(rec => rec.tarih && rec.tarih.slice(0, 7) === thisMonth && rec.exam_type?.toLowerCase().includes('ayt')) || [];

  return (
    <Box className="relative bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-100 rounded-2xl shadow-2xl p-8 hover:scale-[1.025] hover:shadow-3xl transition-all duration-300 border border-indigo-100 max-w-xl mx-auto">
      <div className="absolute -top-5 -right-5 bg-indigo-500 rounded-full p-3 shadow-lg">
        <SparklesIcon className="h-8 w-8 text-white" />
      </div>
      <Typography variant="h4" className="text-2xl font-extrabold text-indigo-800 mb-6 tracking-tight flex items-center gap-2">
        AI Danışman
      </Typography>
      {/* Özet İstatistikler */}
      {studentData && (
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="bg-white/80 rounded-xl p-4 flex flex-col items-center">
              <span className="text-xs text-gray-500">Bu Ay Çözülen Soru</span>
              <span className="text-xl font-bold text-indigo-700">{studentData.monthlyQuestions}</span>
            </div>
            <div className="bg-white/80 rounded-xl p-4 flex flex-col items-center">
              <span className="text-xs text-gray-500">Tamamlanan Konu</span>
              <span className="text-xl font-bold text-indigo-700">{studentData.completedTopics?.length || 0}</span>
            </div>
          </div>
          {/* Bu ayın TYT ve AYT sınavları açılır listeleri */}
          <div className="mb-2">
            <button className="text-blue-700 underline text-sm mr-4" onClick={() => setShowTYT(v => !v)}>
              {showTYT ? 'TYT Sınavlarını Gizle' : 'TYT Sınavlarını Göster'}
            </button>
            <button className="text-blue-700 underline text-sm" onClick={() => setShowAYT(v => !v)}>
              {showAYT ? 'AYT Sınavlarını Gizle' : 'AYT Sınavlarını Göster'}
            </button>
          </div>
          {showTYT && (
            <div className="bg-white/90 rounded-xl p-4 mb-2">
              <div className="font-bold text-indigo-700 mb-2">Bu Ayın TYT Sınavları</div>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-2 py-1">Tarih</th>
                    <th className="text-left px-2 py-1">Sınav Türü</th>
                    <th className="text-left px-2 py-1">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {thisMonthTYT.map((rec, idx) => (
                    <tr key={idx}>
                      <td className="px-2 py-1">{rec.tarih?.slice(0, 10)}</td>
                      <td className="px-2 py-1">{rec.exam_type}</td>
                      <td className="px-2 py-1">{rec.total_net}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {showAYT && (
            <div className="bg-white/90 rounded-xl p-4 mb-2">
              <div className="font-bold text-indigo-700 mb-2">Bu Ayın AYT Sınavları</div>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-2 py-1">Tarih</th>
                    <th className="text-left px-2 py-1">Sınav Türü</th>
                    <th className="text-left px-2 py-1">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {thisMonthAYT.map((rec, idx) => (
                    <tr key={idx}>
                      <td className="px-2 py-1">{rec.tarih?.slice(0, 10)}</td>
                      <td className="px-2 py-1">{rec.exam_type}</td>
                      <td className="px-2 py-1">{rec.total_net}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      <div className="space-y-6">
        <Box className="bg-white/80 rounded-xl p-5 shadow-inner min-h-[64px] flex items-center">
          <Typography className="text-gray-800 text-lg font-medium">{analysis || 'AI danışman yükleniyor...'}</Typography>
        </Box>
        <Button
          onClick={getAIAnalysis}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-xl text-lg font-semibold shadow-md transition-all duration-300"
          startIcon={<SparklesIcon className="h-5 w-5 text-white" />}
          disabled={loading || !studentData}
        >
          Analiz Et
        </Button>
      </div>
    </Box>
  );
};

export default AIConsultantPage; 