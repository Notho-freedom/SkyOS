import { useApp } from "../../../../desktop/AppContext"
import React, { useState, useEffect } from 'react';
import { useContextMenu } from "../../../../desktop/contextual_menu/ContextMenuContext"

const DockPositionPopup = ({ currentPosition, onClose, onSave }) => {
  const [position, setPosition] = useState('bottom'); // Default position
  const { setTop, setShowDock } = useApp();

  useEffect(() => {
    setPosition(currentPosition || 'bottom');
  }, [currentPosition]);

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  const handleSave = () => {
    onSave(position);
    setTop(position);      // Applique la position choisie au dock
    setShowDock(true);     // Montre le dock (si tu veux que ce soit automatique ici)
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Modify Dock Position</h2>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Position:</label>
          <select
            value={position}
            onChange={handlePositionChange}
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DockPositionPopup;
