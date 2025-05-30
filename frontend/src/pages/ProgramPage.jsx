import React, { useState, useEffect } from 'react';
import SortableItem from './SortableItem';
import axiosInstance from '../utils/axios';
import UpdateModal from '../components/UpdateModal';

const LESSONS = [
  'Matematik',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Türkçe',
  'Sosyal',
  'Fen',
];
const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];
const WEEKS = [1, 2, 3, 4];

function getEmptySchedule() {
  const schedule = {};
  MONTHS.forEach((month) => {
    schedule[month] = {};
    for (let w = 1; w <= 4; w++) {
      schedule[month][w] = [];
    }
  });
  return schedule;
}

const ProgramPage = () => {
  const [selectedLesson, setSelectedLesson] = useState('Matematik');
  const [lessonSchedules, setLessonSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      const allLessons = {};
      for (const lesson of LESSONS) {
        allLessons[lesson] = getEmptySchedule();
      }
      try {
        const response = await axiosInstance.get('/schedule');
        for (const item of response.data) {
          const { id, lesson_name, month, week, konu, sure } = item;
          if (allLessons[lesson_name] && allLessons[lesson_name][month] && allLessons[lesson_name][month][week]) {
            allLessons[lesson_name][month][week].push({ id, konu, sure });
          }
        }
        setLessonSchedules(allLessons);
      } catch (err) {
        console.error('Program yüklenirken hata:', err);
      }
      setLoading(false);
    };
    fetchSchedules();
  }, []);

  const schedule = lessonSchedules[selectedLesson] || getEmptySchedule();

  const handleLessonChange = (e) => {
    setSelectedLesson(e.target.value);
    setSelectedItem(null);
  };

  const handleMove = (itemId) => {
    setSelectedItem(itemId);
  };

  const handleCellClick = async (month, week) => {
    if (!selectedItem) return;

    // Mevcut konumunu bul
    let currentMonth, currentWeek;
    outer: for (const m of MONTHS) {
      for (const w of WEEKS) {
        if (schedule[m][w].find(item => item.id === selectedItem)) {
          currentMonth = m;
          currentWeek = w;
          break outer;
        }
      }
    }

    if (!currentMonth || !currentWeek) return;

    // Aynı hücreye tıklandıysa işlem yapma
    if (currentMonth === month && currentWeek === week) {
      setSelectedItem(null);
      return;
    }

    const targetCell = schedule[month][week];
    const sourceCell = schedule[currentMonth][currentWeek];
    const itemToMove = sourceCell.find(item => item.id === selectedItem);

    try {
      if (targetCell.length > 0) {
        // Swap işlemi
        const targetItem = targetCell[0];
        await Promise.all([
          axiosInstance.put(`/schedule/${itemToMove.id}`, {
            month,
            week,
            lesson_name: selectedLesson
          }),
          axiosInstance.put(`/schedule/${targetItem.id}`, {
            month: currentMonth,
            week: currentWeek,
            lesson_name: selectedLesson
          })
        ]);

        // State'i güncelle (swap)
        const newSchedule = JSON.parse(JSON.stringify(schedule));
        // current hücreye targetItem'ı koy
        newSchedule[currentMonth][currentWeek] = [targetItem];
        // target hücreye itemToMove'u koy
        newSchedule[month][week] = [itemToMove];
        setLessonSchedules(prev => ({ ...prev, [selectedLesson]: newSchedule }));
      } else {
        // Boş hücreye taşıma
        await axiosInstance.put(`/schedule/${itemToMove.id}`, {
          month,
          week,
          lesson_name: selectedLesson
        });

        // State'i güncelle
        const newSchedule = JSON.parse(JSON.stringify(schedule));
        newSchedule[currentMonth][currentWeek] = [];
        newSchedule[month][week] = [itemToMove];
        setLessonSchedules(prev => ({ ...prev, [selectedLesson]: newSchedule }));
      }
    } catch (err) {
      console.error('Taşıma işlemi sırasında hata:', err);
    }

    setSelectedItem(null);
  };

  const handleDelete = async (itemId) => {
    try {
      await axiosInstance.delete(`/schedule/${itemId}`);
      
      // State'i güncelle
      const newSchedule = JSON.parse(JSON.stringify(schedule));
      for (const month of MONTHS) {
        for (const week of WEEKS) {
          newSchedule[month][week] = newSchedule[month][week].filter(item => item.id !== itemId);
        }
      }
      setLessonSchedules(prev => ({ ...prev, [selectedLesson]: newSchedule }));
    } catch (err) {
      console.error('Silme işlemi sırasında hata:', err);
    }
  };

  const handleEdit = (itemId) => {
    // Düzenlenecek item'ı bul
    let foundItem = null;
    for (const m of MONTHS) {
      for (const w of WEEKS) {
        const item = schedule[m][w].find((i) => i.id === itemId);
        if (item) {
          foundItem = { ...item, month: m, week: w };
          break;
        }
      }
    }
    setEditItem(foundItem);
    setEditModalOpen(true);
  };

  const handleEditSave = async (gun, saat) => {
    if (!editItem) return;
    try {
      await axiosInstance.put(`/schedule/${editItem.id}`, {
        month: editItem.month,
        week: editItem.week,
        lesson_name: selectedLesson,
        konu: editItem.konu, // konu adı değişikliği istenirse burası da input olmalı
        sure: gun // burada 'gun' yerine 'sure' inputu olmalı, modalı güncelleyebiliriz
      });
      // State'i güncelle
      const newSchedule = JSON.parse(JSON.stringify(schedule));
      const arr = newSchedule[editItem.month][editItem.week];
      const idx = arr.findIndex((i) => i.id === editItem.id);
      if (idx !== -1) {
        arr[idx].sure = gun; // burada 'sure' güncelleniyor
      }
      setLessonSchedules((prev) => ({ ...prev, [selectedLesson]: newSchedule }));
    } catch (err) {
      console.error('Düzenleme sırasında hata:', err);
    }
    setEditModalOpen(false);
    setEditItem(null);
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-lg overflow-x-auto">
      <div className="p-2 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-4">
          <h1 className="text-xl md:text-3xl font-bold text-blue-700 mb-2 md:mb-0">Ders Programı</h1>
          <select
            value={selectedLesson}
            onChange={handleLessonChange}
            className="border p-1 md:p-2 rounded-lg text-base md:text-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            {LESSONS.map(lesson => (
              <option key={lesson} value={lesson}>{lesson}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[600px] md:min-w-max w-full border-collapse text-xs md:text-sm">
              <thead>
                <tr>
                  <th className="p-1 md:p-2 bg-blue-200 text-blue-900 border border-blue-300">Hafta</th>
                  {MONTHS.map((month) => (
                    <th key={month} className="p-1 md:p-2 bg-blue-200 text-blue-900 border border-blue-300">{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WEEKS.map((week) => (
                  <tr key={week}>
                    <td className="p-1 md:p-2 bg-blue-50 border border-blue-100 text-center font-bold">{week}</td>
                    {MONTHS.map((month) => (
                      <td
                        key={month}
                        onClick={() => handleCellClick(month, week)}
                        className={`align-top min-w-[120px] md:min-w-[180px] bg-white border border-blue-100 ${
                          selectedItem ? 'cursor-pointer hover:bg-blue-50' : ''
                        }`}
                      >
                        {schedule[month][week].map((k) => (
                          <SortableItem
                            key={k.id}
                            id={k.id}
                            konu={k.konu}
                            sure={k.sure}
                            onMove={handleMove}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            isLastRow={week === WEEKS[WEEKS.length - 1]}
                          />
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Düzenle Modalı */}
      <UpdateModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
        konu={editItem?.konu || ''}
        mevcutGun={editItem?.sure || ''}
        mevcutSaat={''}
      />
    </div>
  );
};

export default ProgramPage;
