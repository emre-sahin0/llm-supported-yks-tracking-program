import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NetsPage = () => {
  const [netForm, setNetForm] = useState({
    tarih: '',
    tyt: { turkce: '', matematik: '', sosyal: '', fen: '' },
    ayt: { matematik: '', fizik: '', kimya: '', biyoloji: '' },
  });

  const [kayitlar, setKayitlar] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNets();
  }, []);

  const fetchNets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/nets', { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setKayitlar(response.data);
      setError('');
    } catch (err) {
      console.error('Net kayıtları alınamadı:', err);
      setError('Net kayıtları alınamadı. Lütfen giriş yaptığınızdan emin olun.');
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
      await axios.post('http://localhost:5000/nets', netForm, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchNets(); // yeni kayıt sonrası güncelle
      setNetForm({
        tarih: '',
        tyt: { turkce: '', matematik: '', sosyal: '', fen: '' },
        ayt: { matematik: '', fizik: '', kimya: '', biyoloji: '' },
      });
      setError('');
    } catch (err) {
      console.error('Net kaydedilemedi:', err);
      setError('Net kaydedilemedi. Lütfen giriş yaptığınızdan emin olun.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h1 className="text-3xl font-bold text-purple-600">📈 Net Girişi</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6 w-full max-w-4xl">
        <input
          type="text"
          placeholder="Tarih (Örn: Nisan 2025)"
          value={netForm.tarih}
          onChange={handleTarihChange}
          className="border p-2 rounded-lg w-full"
        />

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">TYT</h2>
            {['turkce', 'matematik', 'sosyal', 'fen'].map((ders) => (
              <input
                key={ders}
                type="number"
                placeholder={`${ders.charAt(0).toUpperCase() + ders.slice(1)} Net`}
                value={netForm.tyt[ders]}
                onChange={(e) => handleChange('tyt', ders, e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
            ))}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">AYT</h2>
            {['matematik', 'fizik', 'kimya', 'biyoloji'].map((ders) => (
              <input
                key={ders}
                type="number"
                placeholder={`${ders.charAt(0).toUpperCase() + ders.slice(1)} Net`}
                value={netForm.ayt[ders]}
                onChange={(e) => handleChange('ayt', ders, e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg">
          Kaydet
        </button>
      </form>

      <div className="w-full max-w-5xl space-y-4">
        {kayitlar.map((k, index) => (
          <div key={index} className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="font-bold">📅 {k.tarih}</h3>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <h4 className="font-semibold">TYT</h4>
                <p>Türkçe: {k.tyt.turkce}</p>
                <p>Matematik: {k.tyt.matematik}</p>
                <p>Sosyal: {k.tyt.sosyal}</p>
                <p>Fen: {k.tyt.fen}</p>
              </div>
              <div>
                <h4 className="font-semibold">AYT</h4>
                <p>Matematik: {k.ayt.matematik}</p>
                <p>Fizik: {k.ayt.fizik}</p>
                <p>Kimya: {k.ayt.kimya}</p>
                <p>Biyoloji: {k.ayt.biyoloji}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetsPage;
