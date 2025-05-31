import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const LESSONS = [
  { value: 'TYT Matematik', label: 'TYT Matematik' },
  { value: 'TYT Fizik', label: 'TYT Fizik' },
  { value: 'TYT Kimya', label: 'TYT Kimya' },
  { value: 'TYT Biyoloji', label: 'TYT Biyoloji' },
  { value: 'TYT Türkçe', label: 'TYT Türkçe' },
  { value: 'TYT Sosyal', label: 'TYT Sosyal' },
  { value: 'TYT Fen', label: 'TYT Fen' },
  { value: 'AYT Matematik', label: 'AYT Matematik' },
  { value: 'AYT Fizik', label: 'AYT Fizik' },
  { value: 'AYT Kimya', label: 'AYT Kimya' },
  { value: 'AYT Biyoloji', label: 'AYT Biyoloji' },
  { value: 'AYT Türkçe', label: 'AYT Türkçe' },
  { value: 'AYT Sosyal', label: 'AYT Sosyal' },
  { value: 'AYT Fen', label: 'AYT Fen' },
];

const PREDEFINED_TOPICS = {
  'TYT Matematik': ['Temel Kavramlar', 'Sayılar', 'Bölme ve Bölünebilme', 'Asal Çarpanlar ve Tam Bölenler', 'EBOB-EKOK', 'Rasyonel Sayılar', 'Ondalık Sayılar', 'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar', 'Çarpanlara Ayırma', 'Oran-Orantı', 'Problemler', 'Kümeler', 'Fonksiyonlar', 'Polinomlar', 'Permütasyon-Kombinasyon-Olasılık', 'İstatistik ve Grafikler'],
  'TYT Fizik': ['Mekanik', 'Elektrik', 'Manyetizma', 'Optik', 'Termodinamik', 'Dalgalar', 'Atom Fiziği'],
  'TYT Kimya': ['Temel Kavramlar', 'Periyodik Sistem', 'Kimyasal Bağlar', 'Reaksiyonlar', 'Çözeltiler', 'Asit-Baz', 'Elektrokimya'],
  'TYT Biyoloji': ['Hücre', 'Canlıların Sınıflandırılması', 'Bitkiler', 'Hayvanlar', 'İnsan Fizyolojisi', 'Genetik', 'Ekoloji'],
  'TYT Türkçe': ['Dil Bilgisi', 'Anlatım Bozuklukları', 'Paragraf', 'Cümle Yapısı', 'Sözcük Türleri', 'Yazım Kuralları', 'Noktalama'],
  'TYT Sosyal': ['Tarih', 'Coğrafya', 'Vatandaşlık', 'Din Kültürü'],
  'TYT Fen': ['Fizik', 'Kimya', 'Biyoloji'],
  'AYT Matematik': ['Temel Kavramlar', 'Sayılar', 'Bölme ve Bölünebilme', 'Asal Çarpanlar ve Tam Bölenler', 'EBOB-EKOK', 'Rasyonel Sayılar', 'Ondalık Sayılar', 'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar', 'Çarpanlara Ayırma', 'Oran-Orantı', 'Problemler', 'Kümeler', 'Fonksiyonlar', 'Polinomlar', 'Permütasyon-Kombinasyon-Olasılık', 'İstatistik ve Grafikler'],
  'AYT Fizik': ['Mekanik', 'Elektrik', 'Manyetizma', 'Optik', 'Termodinamik', 'Dalgalar', 'Atom Fiziği'],
  'AYT Kimya': ['Temel Kavramlar', 'Periyodik Sistem', 'Kimyasal Bağlar', 'Reaksiyonlar', 'Çözeltiler', 'Asit-Baz', 'Elektrokimya'],
  'AYT Biyoloji': ['Hücre', 'Canlıların Sınıflandırılması', 'Bitkiler', 'Hayvanlar', 'İnsan Fizyolojisi', 'Genetik', 'Ekoloji'],
  'AYT Türkçe': ['Dil Bilgisi', 'Anlatım Bozuklukları', 'Paragraf', 'Cümle Yapısı', 'Sözcük Türleri', 'Yazım Kuralları', 'Noktalama'],
  'AYT Sosyal': ['Tarih', 'Coğrafya', 'Vatandaşlık', 'Din Kültürü'],
  'AYT Fen': ['Fizik', 'Kimya', 'Biyoloji'],
};

const TopicsPage = () => {
  const [selectedLesson, setSelectedLesson] = useState('TYT Matematik');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [addingPredefined, setAddingPredefined] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics(selectedLesson);
    // eslint-disable-next-line
  }, [selectedLesson]);

  const fetchTopics = async (lesson) => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(`topics/${lesson}`, { withCredentials: true });
      setTopics(response.data);
    } catch (err) {
      setError('Konular alınamadı. Lütfen tekrar deneyin.');
      setTopics([]);
    }
    setLoading(false);
  };

  const handleAddPredefinedTopics = async () => {
    setAddingPredefined(true);
    const predefinedTopics = PREDEFINED_TOPICS[selectedLesson] || [];
    let existingTitles = [];
    try {
      const response = await axiosInstance.get(`topics/${selectedLesson}`, { withCredentials: true });
      existingTitles = response.data.map(t => t.title);
    } catch (err) {
      // ignore
    }
    for (const topic of predefinedTopics) {
      if (!existingTitles.includes(topic)) {
        try {
          await axiosInstance.post(`topics/${selectedLesson}`, { title: topic }, { withCredentials: true });
        } catch (err) {
          // ignore
        }
      }
    }
    fetchTopics(selectedLesson);
    setAddingPredefined(false);
  };

  const handleToggleComplete = async (topic) => {
    if (topic.completed) {
      // Tamamlanmışsa geri al
      try {
        await axiosInstance.post(`topics/${topic.id}/uncomplete`, {}, { withCredentials: true });
        setTopics(topics.map(t => t.id === topic.id ? { ...t, completed: false } : t));
      } catch (err) {
        alert('Konu tamamlanma kaldırma başarısız!');
      }
    } else {
      // Tamamla
      try {
        await axiosInstance.post(`topics/${topic.id}/complete`, {}, { withCredentials: true });
        setTopics(topics.map(t => t.id === topic.id ? { ...t, completed: true } : t));
        // Quiz sayfasına yönlendir
        navigate(`/quiz?konu=${encodeURIComponent(topic.title)}`);
      } catch (err) {
        alert('Konu tamamlanamadı!');
      }
    }
  };

  const handleAddTopic = async () => {
    if (!newTopic) return;
    try {
      await axiosInstance.post(`topics/${selectedLesson}`, { title: newTopic }, { withCredentials: true });
      setNewTopic('');
      setShowAddModal(false);
      fetchTopics(selectedLesson);
    } catch (err) {
      alert('Konu eklenemedi!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-600 mb-8 text-center">✅ Konu Takip</h1>
      <div className="flex justify-center mb-8 gap-4">
        <select
          value={selectedLesson}
          onChange={e => setSelectedLesson(e.target.value)}
          className="border p-3 rounded-lg text-lg shadow-sm focus:ring-2 focus:ring-green-400"
        >
          {LESSONS.map(lesson => (
            <option key={lesson.value} value={lesson.value}>{lesson.label}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-500 text-white p-3 rounded-lg shadow-sm hover:bg-green-600"
        >
          Yeni Konu Ekle
        </button>
        <button
          onClick={handleAddPredefinedTopics}
          className="bg-blue-500 text-white p-3 rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-60"
          disabled={addingPredefined}
        >
          {addingPredefined ? 'Ekleniyor...' : 'Eksik Konuları Ekle'}
        </button>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Yükleniyor...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
          {topics.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">Konu bulunamadı.</div>
          ) : (
            topics.map((topic) => (
              <div
                key={topic.id}
                className={`p-4 rounded-xl shadow-md flex items-center space-x-4 transition-all border-2 ${
                  topic.completed ? 'bg-green-100 border-green-400' : 'bg-white border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={topic.completed}
                  onChange={() => handleToggleComplete(topic)}
                  className="h-6 w-6 accent-green-500"
                />
                <span
                  className={`text-lg font-semibold ${
                    topic.completed ? 'line-through text-green-700' : 'text-gray-800'
                  }`}
                >
                  {topic.title}
                </span>
              </div>
            ))
          )}
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Yeni Konu Ekle</h2>
            <input
              type="text"
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
              className="border p-2 rounded-lg w-full mb-4"
              placeholder="Konu Adı"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-500 text-white p-2 rounded-lg mr-2"
              >
                İptal
              </button>
              <button
                onClick={handleAddTopic}
                className="bg-green-500 text-white p-2 rounded-lg"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative bg-gradient-to-br from-green-100 via-lime-100 to-emerald-100 rounded-2xl shadow-2xl p-8 hover:scale-[1.025] hover:shadow-3xl transition-all duration-300 border border-green-100 max-w-xl mx-auto">
        <div className="absolute -top-5 -right-5 bg-green-500 rounded-full p-3 shadow-lg">
          <CheckCircleIcon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-extrabold text-green-800 mb-6 tracking-tight flex items-center gap-2">
          Konu Tamamlama
        </h3>
        {/* ... diğer içerikler ... */}
      </div>
    </div>
  );
};

export default TopicsPage;
