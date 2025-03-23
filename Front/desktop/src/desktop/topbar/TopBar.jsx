// components/TopBar.jsx
import React from 'react';

const TopBar = () => {
  const menuItems = ['Finder', 'File', 'Edit', 'View', 'Go', 'Window', 'Help'];
  
  return (
    <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-70 flex justify-between items-center px-2 py-1 text-sm">
      <div className="flex items-center space-x-2 text-black">
        <i className="fab fa-apple text-xs" />
        {menuItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="text-black">
        <span>Mon 10:19 AM</span>
        <i className="fas fa-search ml-1 text-xs" />
      </div>
    </div>
  );
};

export default TopBar;