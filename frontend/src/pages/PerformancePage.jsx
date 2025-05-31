import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

const TYT_LESSONS = [
  { value: 'turkce', label: 'Türkçe' },
  { value: 'matematik', label: 'Matematik' },
  { value: 'sosyal', label: 'Sosyal' },
  { value: 'fen', label: 'Fen' },
];
const AYT_LESSONS = [
  { value: 'matematik', label: 'Matematik' },
  { value: 'fizik', label: 'Fizik' },
  { value: 'kimya', label: 'Kimya' },
  { value: 'biyoloji', label: 'Biyoloji' },
];

const PerformancePage = () => {
  const [nets, setNets] = useState([]);
  const [examType, setExamType] = useState('TYT');
  const [lesson, setLesson] = useState('turkce');
  const [lessons, setLessons] = useState(TYT_LESSONS);

  useEffect(() => {
    fetchNets();
  }, []);

  useEffect(() => {
    setLessons(examType === 'TYT' ? TYT_LESSONS : AYT_LESSONS);
    setLesson(examType === 'TYT' ? 'turkce' : 'matematik');
  }, [examType]);

  const fetchNets = async () => {
    try {
      const response = await axiosInstance.get('/nets', { withCredentials: true });
      setNets(response.data);
    } catch (err) {
      console.error('Net kayıtları alınamadı. Lütfen tekrar deneyin.');
    }
  };

  // Filtrele
  const filtered = nets.filter(
    n => n.exam_type.toLowerCase().includes(examType.toLowerCase()) && n.exam_type.toLowerCase().includes(lesson)
  );
  // Tarihe göre sırala
  filtered.sort((a, b) => new Date(a.tarih) - new Date(b.tarih));

  // Chart datası
  const chartData = filtered.map(n => ({ tarih: n.tarih, net: n.total_net }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-purple-700">Net Performans Grafiği</h1>
      <div className="flex gap-4 mb-8">
        <select
          value={examType}
          onChange={e => setExamType(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="TYT">TYT</option>
          <option value="AYT">AYT</option>
        </select>
        <select
          value={lesson}
          onChange={e => setLesson(e.target.value)}
          className="border p-2 rounded-lg"
        >
          {lessons.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tarih" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="net" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
      {chartData.length === 0 && <div className="text-center text-gray-500 mt-8">Seçilen derse ait net kaydı bulunamadı.</div>}
      <div className="relative bg-gradient-to-br from-indigo-100 via-blue-100 to-green-100 rounded-2xl shadow-2xl p-8 hover:scale-[1.025] hover:shadow-3xl transition-all duration-300 border border-indigo-100 max-w-xl mx-auto">
        <div className="absolute -top-5 -right-5 bg-indigo-500 rounded-full p-3 shadow-lg">
          <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-extrabold text-indigo-800 mb-6 tracking-tight flex items-center gap-2">
          Net Performansı
        </h3>
        {/* ... diğer içerikler ... */}
      </div>
    </div>
  );
};

export default PerformancePage; 