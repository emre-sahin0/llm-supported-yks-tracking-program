import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { FaBook, FaFlask, FaCalculator, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ChartBarIcon } from '@heroicons/react/24/solid';

const NetsPage = () => {
  const [netForm, setNetForm] = useState({
    tarih: '',
    tyt: { turkce: '', matematik: '', sosyal: '', fen: '' },
    ayt: { matematik: '', fizik: '', kimya: '', biyoloji: '' },
  });

  const [kayitlar, setKayitlar] = useState([]);
  const [openDates, setOpenDates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchNets();
  }, []);

  const fetchNets = async () => {
    try {
      const response = await axiosInstance.get('/nets', { withCredentials: true });
      setKayitlar(response.data);
    } catch (err) {
      console.error('Net kayıtları alınamadı. Lütfen tekrar deneyin.');
    }
  };

  const handleChange = (kategori, ders, value) => {
    setNetForm((prev) => ({
      ...prev,
      [kategori]: {
        ...prev[kategori],
        [ders]: value
      }
    }));
  };

  const handleTarihChange = (e) => {
    setNetForm((prev) => ({
      ...prev,
      tarih: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tarih = netForm.tarih; // YYYY-MM-DD olmalı!

    // TYT dersleri
    for (const ders of Object.keys(netForm.tyt)) {
      const net = parseFloat(netForm.tyt[ders]);
      if (!isNaN(net) && tarih) {
        await axiosInstance.post('/nets', {
          exam_type: `TYT ${ders}`,
          total_net: net,
          tarih
        }, { withCredentials: true });
      }
    }

    // AYT dersleri
    for (const ders of Object.keys(netForm.ayt)) {
      const net = parseFloat(netForm.ayt[ders]);
      if (!isNaN(net) && tarih) {
        await axiosInstance.post('/nets', {
          exam_type: `AYT ${ders}`,
          total_net: net,
          tarih
        }, { withCredentials: true });
      }
    }

    fetchNets();
    setNetForm({
      tarih: '',
      tyt: { turkce: '', matematik: '', sosyal: '', fen: '' },
      ayt: { matematik: '', fizik: '', kimya: '', biyoloji: '' },
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu net kaydını silmek istediğine emin misin?')) {
      await axiosInstance.delete(`/nets/${id}`, { withCredentials: true });
      fetchNets();
    }
  };

  const handleEdit = (id, currentValue) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const handleEditSave = async (id) => {
    await axiosInstance.put(`/nets/${id}`, { total_net: parseFloat(editValue) }, { withCredentials: true });
    setEditingId(null);
    setEditValue('');
    fetchNets();
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const renderInput = (kategori, ders, label, Icon) => (
    <div className="flex items-center space-x-2">
      <Icon className="text-gray-500" />
      <input
        type="number"
        placeholder={`${label} Net`}
        value={netForm[kategori][ders]}
        onChange={(e) => handleChange(kategori, ders, e.target.value)}
        className="border p-2 rounded-lg w-full shadow-sm"
      />
    </div>
  );

  // Group records by date
  const groupByDate = (records) => {
    return records.reduce((acc, rec) => {
      const date = rec.tarih;
      if (!acc[date]) acc[date] = [];
      acc[date].push(rec);
      return acc;
    }, {});
  };

  const grouped = groupByDate(kayitlar);

  const toggleDate = (date) => {
    setOpenDates((prev) =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-purple-700 mb-2 md:mb-0">📊 Net Girişi</h1>
        <Link
          to="/performance"
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition text-lg font-semibold"
        >
          Net Performansını Görüntüle
        </Link>
      </div>
      <div className="relative bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-2xl shadow-2xl p-8 hover:scale-[1.025] hover:shadow-3xl transition-all duration-300 border border-yellow-100 max-w-xl mx-auto">
        <div className="absolute -top-5 -right-5 bg-yellow-500 rounded-full p-3 shadow-lg">
          <ChartBarIcon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-extrabold text-yellow-800 mb-6 tracking-tight flex items-center gap-2">
          Net Girişi
        </h3>
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg mb-8">
          <p className="text-center text-gray-500 mb-4">Son çalışma gününe ait netlerini kaydet!</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="date"
              value={netForm.tarih}
              onChange={handleTarihChange}
              className="border p-2 rounded-lg w-full text-sm"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-purple-700 mb-2">TYT</h2>
                {renderInput('tyt', 'turkce', 'Türkçe', FaBook)}
                {renderInput('tyt', 'matematik', 'Matematik', FaCalculator)}
                {renderInput('tyt', 'sosyal', 'Sosyal', FaCheckCircle)}
                {renderInput('tyt', 'fen', 'Fen', FaFlask)}
              </div>
              <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-purple-700 mb-2">AYT</h2>
                {renderInput('ayt', 'matematik', 'Matematik', FaCalculator)}
                {renderInput('ayt', 'fizik', 'Fizik', FaFlask)}
                {renderInput('ayt', 'kimya', 'Kimya', FaFlask)}
                {renderInput('ayt', 'biyoloji', 'Biyoloji', FaFlask)}
              </div>
            </div>
            <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-base font-semibold transition">Kaydet</button>
          </form>
        </div>
      </div>
      <div className="max-w-3xl mx-auto space-y-2">
        {Object.entries(grouped).map(([date, records]) => (
          <div key={date} className="mb-1">
            <button
              onClick={() => toggleDate(date)}
              className={`w-full flex justify-between items-center bg-purple-100 hover:bg-purple-200 px-3 py-2 rounded shadow-sm font-bold text-purple-700 text-base transition ${openDates.includes(date) ? 'ring-2 ring-purple-300' : ''}`}
            >
              <span>{date}</span>
              <span>{openDates.includes(date) ? '▲' : '▼'}</span>
            </button>
            {openDates.includes(date) && (
              <table className="w-full text-left border-t border-b border-gray-200 text-xs mt-1">
                <thead>
                  <tr>
                    <th className="py-1 px-2">Sınav Türü</th>
                    <th className="py-1 px-2">Net</th>
                    <th className="py-1 px-2">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((k, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-1 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${k.exam_type.startsWith('TYT') ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>{k.exam_type}</span>
                      </td>
                      <td className="py-1 px-2">
                        {editingId === k.id ? (
                          <input
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="border rounded px-1 py-0.5 w-16 text-xs"
                          />
                        ) : (
                          k.total_net
                        )}
                      </td>
                      <td className="py-1 px-2">
                        {editingId === k.id ? (
                          <>
                            <button onClick={() => handleEditSave(k.id)} className="text-green-600 hover:underline text-xs mr-2">Kaydet</button>
                            <button onClick={handleEditCancel} className="text-gray-500 hover:underline text-xs">İptal</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(k.id, k.total_net)} className="text-blue-600 hover:underline text-xs mr-2">Düzenle</button>
                            <button onClick={() => handleDelete(k.id)} className="text-red-600 hover:underline text-xs">Sil</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetsPage;
