// src/pages/SortableItem.jsx
import React, { useState } from 'react';

const SortableItem = ({ id, konu, sure, onMove, onDelete, onEdit, isLastRow }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative p-3 bg-gradient-to-r from-blue-50 to-purple-100 border border-blue-200 rounded-lg shadow hover:shadow-xl mb-2 transition-all">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
      >
        ⋮
      </button>
      {showMenu && (
        <div
          className={`absolute right-1 z-10 bg-white rounded-lg shadow-lg border border-gray-200 ${
            isLastRow ? 'bottom-full mb-2' : 'top-8'
          }`}
        >
          <button
            onClick={() => {
              onMove(id);
              setShowMenu(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Taşı
          </button>
          <button
            onClick={() => {
              onEdit(id);
              setShowMenu(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Düzenle
          </button>
          <button
            onClick={() => {
              onDelete(id);
              setShowMenu(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
          >
            Sil
          </button>
        </div>
      )}
      <div className="font-bold text-blue-700 text-base mb-1">{konu}</div>
      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
        {sure && <span>🕒 {sure}</span>}
      </div>
    </div>
  );
};

export default SortableItem;
