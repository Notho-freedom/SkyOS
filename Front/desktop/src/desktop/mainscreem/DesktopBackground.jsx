// components/DesktopBackground.jsx
import React from 'react';

const DesktopBackground = ({ children }) => {
  return (
    <div className="relative w-full h-screen bg-gray-100">
      <img
        alt="Cloudy sky with a bright horizon"
        className="w-full h-full object-cover absolute inset-0"
        src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG1vdW50YWlufGVufDB8fHx8MTYzMjY0NjY2NQ&ixlib=rb-1.2.1&q=80&w=1080"
      />
      {children}
    </div>
  );
};

export default DesktopBackground;