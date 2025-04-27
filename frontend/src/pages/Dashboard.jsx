import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    // YKS 2025 için örnek tarih: 15 Haziran 2025
    const examDate = new Date('2025-06-15');
    const today = new Date();
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h1 className="text-3xl font-bold text-green-700">🎯 Dashboard'a Hoşgeldin!</h1>
      <div className="bg-white shadow-md p-6 rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-4">📅 YKS'ye Kalan Gün</h2>
        <p className="text-4xl text-blue-600">{daysLeft} gün</p>
      </div>
    </div>
  );
};

export default Dashboard;
