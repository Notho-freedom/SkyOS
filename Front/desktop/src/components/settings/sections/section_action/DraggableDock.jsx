import React, { useState, useRef, useEffect } from 'react';

const DraggableDock = ({ initialPosition = 'bottom', onPositionChange }) => {
  const [position, setPosition] = useState(initialPosition);
  const dockRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - dockRef.current.getBoundingClientRect().left,
      y: e.clientY - dockRef.current.getBoundingClientRect().top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const dockRect = dockRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const newPosition = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };

    // Determine the dock position based on the new coordinates
    if (newPosition.y < windowHeight / 3) {
      setPosition('top');
    } else if (newPosition.y > (2 * windowHeight) / 3) {
      setPosition('bottom');
    } else if (newPosition.x < windowWidth / 3) {
      setPosition('left');
    } else if (newPosition.x > (2 * windowWidth) / 3) {
      setPosition('right');
    }

    onPositionChange(position);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  const getDockStyle = () => {
    switch (position) {
      case 'top':
        return { top: 0, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { bottom: 0, left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { top: '50%', left: 0, transform: 'translateY(-50%)' };
      case 'right':
        return { top: '50%', right: 0, transform: 'translateY(-50%)' };
      default:
        return { bottom: 0, left: '50%', transform: 'translateX(-50%)' };
    }
  };

  return (
    <div
      ref={dockRef}
      className="bg-gray-800 text-white py-2 px-4 rounded cursor-move select-none"
      style={getDockStyle()}
      onMouseDown={handleMouseDown}
    >
      Draggable Dock
    </div>
  );
};

export default DraggableDock;
