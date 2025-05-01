import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBook, FaFlask, FaCalculator, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

const NetsPage = () => {
  const [netForm, setNetForm] = useState({
    tarih: '',
    tyt: { turkce: '', matematik: '', sosyal: '', fen: '' },
    ayt: { matematik: '', fizik: '', kimya: '', biyoloji: '' },
  });

  const [kayitlar, setKayitlar] = useState([]);

  useEffect(() => {
    fetchNets();
  }, []);

  const fetchNets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/nets', { withCredentials: true });
      setKayitlar(response.data);
    } catch (err) {
      console.error('Net kayıtları alınamadı:', err);
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
    try {
      await axios.post('http://localhost:5000/nets', netForm, { withCredentials: true });
      fetchNets();
      setNetForm({
        tarih: '',
        tyt: { turkce: '', matematik: '', sosyal: '', fen: '' },
        ayt: { matematik: '', fizik: '', kimya: '', biyoloji: '' },
      });
    } catch (err) {
      console.error('Net kaydedilemedi:', err);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-purple-600 text-center mb-6">📊 Net Girişi</h1>
        <p className="text-center text-gray-500 mb-6">Son çalışma gününe ait netlerini kaydet!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Tarih (Örn: Nisan 2025)"
            value={netForm.tarih}
            onChange={handleTarihChange}
            className="border p-3 rounded-lg w-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">TYT</h2>
              {renderInput('tyt', 'turkce', 'Türkçe', FaBook)}
              {renderInput('tyt', 'matematik', 'Matematik', FaCalculator)}
              {renderInput('tyt', 'sosyal', 'Sosyal', FaCheckCircle)}
              {renderInput('tyt', 'fen', 'Fen', FaFlask)}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">AYT</h2>
              {renderInput('ayt', 'matematik', 'Matematik', FaCalculator)}
              {renderInput('ayt', 'fizik', 'Fizik', FaFlask)}
              {renderInput('ayt', 'kimya', 'Kimya', FaFlask)}
              {renderInput('ayt', 'biyoloji', 'Biyoloji', FaFlask)}
            </div>
          </div>

          <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg text-lg">
            Kaydet
          </button>
        </form>
      </div>

      <div className="max-w-3xl mx-auto mt-10 space-y-4">
        {kayitlar.map((k, index) => (
          <div key={index} className="bg-white shadow-lg rounded-xl border-l-4 border-purple-400 p-6 hover:scale-[1.02] transition transform duration-200">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-lg">
              <FaCalendarAlt />
              <span>{k.tarih}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">📘 TYT</h4>
                <ul className="space-y-1 text-sm">
                  <li>📚 Türkçe: {k.tyt.turkce}</li>
                  <li>➗ Matematik: {k.tyt.matematik}</li>
                  <li>🗺️ Sosyal: {k.tyt.sosyal}</li>
                  <li>🔬 Fen: {k.tyt.fen}</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-purple-100 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-2">📗 AYT</h4>
                <ul className="space-y-1 text-sm">
                  <li>➗ Matematik: {k.ayt.matematik}</li>
                  <li>🧲 Fizik: {k.ayt.fizik}</li>
                  <li>⚗️ Kimya: {k.ayt.kimya}</li>
                  <li>🧬 Biyoloji: {k.ayt.biyoloji}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetsPage;
