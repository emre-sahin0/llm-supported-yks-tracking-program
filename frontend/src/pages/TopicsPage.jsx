import React, { useState } from 'react';

const TopicsPage = () => {
  const [konular, setKonular] = useState([
    { id: 1, ad: 'Temel Kavramlar', tamamlandi: false },
    { id: 2, ad: 'Sayılar', tamamlandi: false },
    { id: 3, ad: 'Bölme ve Bölünebilme', tamamlandi: false },
    { id: 4, ad: 'Asal Çarpanlar ve Tam Bölenler', tamamlandi: false },
    { id: 5, ad: 'EBOB-EKOK', tamamlandi: false },
    { id: 6, ad: 'Rasyonel Sayılar', tamamlandi: false },
    { id: 7, ad: 'Ondalık Sayılar', tamamlandi: false },
    { id: 8, ad: 'Basit Eşitsizlikler', tamamlandi: false },
    { id: 9, ad: 'Mutlak Değer', tamamlandi: false },
    { id: 10, ad: 'Üslü Sayılar', tamamlandi: false },
    { id: 11, ad: 'Köklü Sayılar', tamamlandi: false },
    { id: 12, ad: 'Çarpanlara Ayırma', tamamlandi: false },
    { id: 13, ad: 'Oran-Orantı', tamamlandi: false },
    { id: 14, ad: 'Problemler', tamamlandi: false },
    { id: 15, ad: 'Kümeler', tamamlandi: false },
    { id: 16, ad: 'Fonksiyonlar', tamamlandi: false },
    { id: 17, ad: 'Polinomlar', tamamlandi: false },
    { id: 18, ad: 'Permütasyon-Kombinasyon-Olasılık', tamamlandi: false },
    { id: 19, ad: 'İstatistik ve Grafikler', tamamlandi: false },
  ]);

  const toggleKonu = (id) => {
    setKonular(
      konular.map((konu) =>
        konu.id === id ? { ...konu, tamamlandi: !konu.tamamlandi } : konu
      )
    );
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h1 className="text-3xl font-bold text-green-600 mb-8">✅ Konu Takip</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {konular.map((konu) => (
          <div
            key={konu.id}
            className={`p-4 rounded-lg shadow-md flex items-center space-x-4 transition-all ${
              konu.tamamlandi ? 'bg-green-100' : 'bg-white'
            }`}
          >
            <input
              type="checkbox"
              checked={konu.tamamlandi}
              onChange={() => toggleKonu(konu.id)}
              className="h-6 w-6"
            />
            <span
              className={`text-lg font-semibold ${
                konu.tamamlandi ? 'line-through text-green-700' : 'text-gray-800'
              }`}
            >
              {konu.ad}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicsPage;
