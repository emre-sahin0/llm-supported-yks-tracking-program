import React, { useState } from 'react';
import UpdateModal from '../components/UpdateModal'; // modal import

const ProgramPage = () => {
  const [program, setProgram] = useState([
    { id: 1, konu: "Temel Kavramlar", gun: "Pazartesi", saat: "10:00" },
    { id: 2, konu: "Sayılar", gun: "Salı", saat: "14:00" },
    { id: 3, konu: "Bölme Bölünebilme", gun: "Çarşamba", saat: "16:00" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [secilenKonu, setSecilenKonu] = useState(null);

  const handleUpdateClick = (konuItem) => {
    setSecilenKonu(konuItem);
    setIsModalOpen(true);
  };

  const handleSave = (newGun, newSaat) => {
    const updatedProgram = program.map((item) =>
      item.id === secilenKonu.id ? { ...item, gun: newGun, saat: newSaat } : item
    );
    setProgram(updatedProgram);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">📚 Matematik Programım</h1>
      <div className="space-y-4 w-full max-w-2xl">
        {program.map((item) => (
          <div key={item.id} className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{item.konu}</h2>
              <p className="text-gray-600">{item.gun} - {item.saat}</p>
            </div>
            <button
              onClick={() => handleUpdateClick(item)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Güncelle
            </button>
          </div>
        ))}
      </div>

      <UpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        konu={secilenKonu?.konu}
        mevcutGun={secilenKonu?.gun}
        mevcutSaat={secilenKonu?.saat}
      />
    </div>
  );
};

export default ProgramPage;
