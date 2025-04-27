import React, { useState } from 'react';

const QuestionsPage = () => {
  const [form, setForm] = useState({
    matematik: { dogru: '', yanlis: '', toplam: '' },
    turkce: { dogru: '', yanlis: '', toplam: '' },
    fen: { dogru: '', yanlis: '', toplam: '' },
    sosyal: { dogru: '', yanlis: '', toplam: '' },
  });

  const [kayitlar, setKayitlar] = useState([]);

  const handleChange = (ders, alan, value) => {
    setForm((prev) => ({
      ...prev,
      [ders]: {
        ...prev[ders],
        [alan]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setKayitlar([...kayitlar, form]);
    setForm({
      matematik: { dogru: '', yanlis: '', toplam: '' },
      turkce: { dogru: '', yanlis: '', toplam: '' },
      fen: { dogru: '', yanlis: '', toplam: '' },
      sosyal: { dogru: '', yanlis: '', toplam: '' },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h1 className="text-3xl font-bold text-yellow-600">📝 Soru Takip</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6 w-full max-w-3xl">
        {['matematik', 'turkce', 'fen', 'sosyal'].map((ders) => (
          <div key={ders} className="space-y-2">
            <h2 className="text-xl font-semibold capitalize">{ders}</h2>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Doğru"
                value={form[ders].dogru}
                onChange={(e) => handleChange(ders, 'dogru', e.target.value)}
                className="border p-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Yanlış"
                value={form[ders].yanlis}
                onChange={(e) => handleChange(ders, 'yanlis', e.target.value)}
                className="border p-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Toplam Soru"
                value={form[ders].toplam}
                onChange={(e) => handleChange(ders, 'toplam', e.target.value)}
                className="border p-2 rounded-lg"
              />
            </div>
          </div>
        ))}
        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg">
          Kaydet
        </button>
      </form>

      <div className="w-full max-w-4xl space-y-4">
        {kayitlar.map((k, index) => (
          <div key={index} className="bg-white shadow p-4 rounded-lg space-y-2">
            <h3 className="font-bold">📅 Kayıt {index + 1}</h3>
            {Object.keys(k).map((ders) => (
              <div key={ders}>
                <p className="capitalize">
                  {ders}: Doğru: {k[ders].dogru} / Yanlış: {k[ders].yanlis} / Toplam: {k[ders].toplam}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsPage;
