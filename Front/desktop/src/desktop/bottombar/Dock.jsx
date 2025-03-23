// components/Dock.jsx
import React from 'react';

const dockItems = [
  { name: 'Mail', icon: 'https://img.icons8.com/fluency/48/000000/apple-mail.png' },
  { name: 'Contacts', icon: 'https://img.icons8.com/fluency/48/000000/contacts.png' },
  { name: 'Calendar', icon: 'https://img.icons8.com/fluency/48/000000/calendar.png' },
  { name: 'Notes', icon: 'https://img.icons8.com/fluency/48/000000/note.png' },
  { name: 'Messages', icon: 'https://img.icons8.com/fluency/48/000000/sms.png' },
  { name: 'Maps', icon: 'https://img.icons8.com/fluency/48/000000/maps.png' },
  { name: 'App Store', icon: 'https://img.icons8.com/fluency/48/000000/apple-app-store.png' },
  { name: 'System Preferences', icon: 'https://img.icons8.com/fluency/48/000000/settings.png' },
  { name: 'Trash', icon: 'https://img.icons8.com/fluency/48/000000/trash.png' }
];

const Dock = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center py-2">
      <div className="flex justify-center items-center space-x-4 bg-white bg-opacity-70 py-2 px-4 rounded-lg">
        {dockItems.map((item) => (
          <img
            key={item.name}
            alt={item.name}
            className="w-10 h-10 hover:scale-110 transition-transform cursor-pointer"
            src={item.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default Dock;