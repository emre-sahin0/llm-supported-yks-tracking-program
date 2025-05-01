import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

const initialSchedule = {
  August: {
    week1: [
      { id: 'k1', konu: 'Temel Kavramlar', gun: 'Pazartesi', saat: '10:00', sure: '2 gün' },
      { id: 'k2', konu: 'Sayılar', gun: 'Salı', saat: '12:00', sure: '1 gün' }
    ],
    week2: [],
    week3: [],
    week4: []
  },
  September: { week1: [], week2: [], week3: [], week4: [] },
  October: { week1: [], week2: [], week3: [], week4: [] },
  November: { week1: [], week2: [], week3: [], week4: [] },
  December: { week1: [], week2: [], week3: [], week4: [] },
  January: { week1: [], week2: [], week3: [], week4: [] },
  February: { week1: [], week2: [], week3: [], week4: [] },
  March: { week1: [], week2: [], week3: [], week4: [] },
};

const DragDropTimeline = () => {
  const [schedule, setSchedule] = useState(initialSchedule);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const [monthFrom, weekFrom] = active.data.current.sortable.containerId.split('-');
    const [monthTo, weekTo] = over.data.current.sortable.containerId.split('-');

    const item = schedule[monthFrom][weekFrom].find((k) => k.id === active.id);
    const newSchedule = { ...schedule };
    newSchedule[monthFrom][weekFrom] = newSchedule[monthFrom][weekFrom].filter((k) => k.id !== active.id);
    newSchedule[monthTo][weekTo].push(item);
    setSchedule(newSchedule);
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-lg">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Yıllık Matematik Programı</h1>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(schedule).map(([month, weeks]) => (
              <div key={month} className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-purple-700 mb-4">{month}</h2>
                {Object.entries(weeks).map(([week, konular]) => (
                  <div key={week} className="mb-4">
                    <h3 className="font-semibold text-gray-600 mb-2">{week}</h3>
                    <div className="bg-gray-50 p-2 min-h-[80px] rounded border">
                      <SortableContext
                        id={`${month}-${week}`}
                        items={konular.map((k) => k.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {konular.map((k) => (
                          <SortableItem key={k.id} id={k.id} konu={k.konu} gun={k.gun} saat={k.saat} sure={k.sure} />
                        ))}
                      </SortableContext>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default DragDropTimeline;
