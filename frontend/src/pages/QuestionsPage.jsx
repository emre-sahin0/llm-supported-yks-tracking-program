import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

const groupBy = (data, type) => {
  const groups = {};
  data.forEach(q => {
    let key = '';
    const date = new Date(q.created_at);
    if (type === 'daily') {
      key = date.toISOString().slice(0, 10);
    } else if (type === 'weekly') {
      // ISO week: year + week number
      const week = getWeekNumber(date);
      key = `${date.getFullYear()}-W${week}`;
    } else if (type === 'monthly') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(q);
  });
  return groups;
};

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  return weekNo;
}

const FILTERS = [
  { value: 'daily', label: 'Günlük' },
  { value: 'weekly', label: 'Haftalık' },
  { value: 'monthly', label: 'Aylık' },
];

const QuestionsPage = () => {
  const [form, setForm] = useState({
    matematik: { dogru: '', yanlis: '' },
    turkce: { dogru: '', yanlis: '' },
    fen: { dogru: '', yanlis: '' },
    sosyal: { dogru: '', yanlis: '' },
  });
  const [kayitlar, setKayitlar] = useState([]);
  const [filter, setFilter] = useState('daily');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axiosInstance.get('/auth/questions', { withCredentials: true });
      setKayitlar(response.data);
    } catch (err) {
      console.error('Sorular alınamadı. Lütfen tekrar deneyin.', err);
      setError('Sorular alınamadı. Lütfen tekrar deneyin.');
    }
  };

  const handleChange = (ders, alan, value) => {
    setForm((prev) => ({
      ...prev,
      [ders]: {
        ...prev[ders],
        [alan]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const ders of Object.keys(form)) {
      const dogru = parseInt(form[ders].dogru) || 0;
      const yanlis = parseInt(form[ders].yanlis) || 0;
      const toplam = dogru + yanlis;
      if (dogru > 0 || yanlis > 0) {
        try {
          await axiosInstance.post('/auth/questions', {
            lesson: ders,
            count: toplam,
            correct: dogru
          }, { withCredentials: true });
        } catch (err) {
          console.error('Soru kaydedilemedi:', err);
        }
      }
    }
    fetchQuestions();
    setForm({
      matematik: { dogru: '', yanlis: '' },
      turkce: { dogru: '', yanlis: '' },
      fen: { dogru: '', yanlis: '' },
      sosyal: { dogru: '', yanlis: '' },
    });
  };

  // Grup ve özet hesapla
  const grouped = groupBy(kayitlar, filter);
  const groupKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-2xl shadow-2xl p-8 hover:scale-[1.025] hover:shadow-3xl transition-all duration-300 border border-blue-100 max-w-xl mx-auto">
        <div className="absolute -top-5 -right-5 bg-blue-500 rounded-full p-3 shadow-lg">
          <QuestionMarkCircleIcon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-extrabold text-blue-800 mb-6 tracking-tight flex items-center gap-2">
          Soru Takip
        </h3>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-2xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['matematik', 'turkce', 'fen', 'sosyal'].map((ders) => (
              <div key={ders} className="space-y-2">
                <h2 className="text-lg font-semibold capitalize">{ders}</h2>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Doğru"
                    value={form[ders].dogru}
                    onChange={(e) => handleChange(ders, 'dogru', e.target.value)}
                    className="border p-2 rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Yanlış"
                    value={form[ders].yanlis}
                    onChange={(e) => handleChange(ders, 'yanlis', e.target.value)}
                    className="border p-2 rounded-lg text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold text-base">
            Kaydet
          </button>
        </form>
        <div className="flex justify-end mb-4">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm shadow"
          >
            {FILTERS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-6">
          {groupKeys.length === 0 && (
            <div className="text-center text-gray-500 py-12">Kayıt bulunamadı.</div>
          )}
          {groupKeys.map((key, idx) => {
            const group = grouped[key];
            const total = group.reduce((acc, q) => acc + (q.count || 0), 0);
            const correct = group.reduce((acc, q) => acc + (q.correct || 0), 0);
            const ratio = total > 0 ? Math.round((correct / total) * 100) : 0;
            return (
              <div key={key} className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <span className="text-lg font-bold text-yellow-700">{FILTERS.find(f => f.value === filter).label} {key.replace('W', ' - Hafta ')}</span>
                  <span className="text-sm text-gray-500">Toplam Soru: <b>{total}</b> | Doğru: <b>{correct}</b> | Başarı: <b>{ratio}%</b></span>
                </div>
                <table className="w-full text-xs mt-2">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="py-1 px-2 text-left">Ders</th>
                      <th className="py-1 px-2 text-left">Doğru</th>
                      <th className="py-1 px-2 text-left">Toplam</th>
                      <th className="py-1 px-2 text-left">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.map((k, i) => (
                      <tr key={i} className="border-b hover:bg-yellow-50">
                        <td className="py-1 px-2 capitalize font-semibold">{k.lesson}</td>
                        <td className="py-1 px-2">{k.correct}</td>
                        <td className="py-1 px-2">{k.count}</td>
                        <td className="py-1 px-2">{k.created_at ? k.created_at.substring(0, 10) : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
