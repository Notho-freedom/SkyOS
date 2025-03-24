import React from "react";

const DesktopBackground = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <img
        alt="Cloudy sky with a bright horizon"
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
        src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fG1vdW50YWlufGVufDB8fHx8MTYzMjY0NjY2NQ&ixlib=rb-1.2.1&q=80&w=1080"
      />
      <div className="relative w-full h-full">{children}</div>
    </div>
  );
};

export default DesktopBackground;
