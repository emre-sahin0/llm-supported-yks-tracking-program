import React, { useState } from 'react';

const UpdateModal = ({ isOpen, onClose, onSave, konu, mevcutGun, mevcutSaat }) => {
  const [gun, setGun] = useState(mevcutGun);
  const [saat, setSaat] = useState(mevcutSaat);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Güncelle: {konu}</h2>

        <div className="flex flex-col space-y-2">
          <label className="text-gray-700">Gün</label>
          <input
            type="text"
            value={gun}
            onChange={(e) => setGun(e.target.value)}
            className="border p-2 rounded-lg"
            placeholder="Örn: Pazartesi"
          />

          <label className="text-gray-700">Saat</label>
          <input
            type="text"
            value={saat}
            onChange={(e) => setSaat(e.target.value)}
            className="border p-2 rounded-lg"
            placeholder="Örn: 14:00"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Vazgeç
          </button>
          <button
            onClick={() => onSave(gun, saat)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
