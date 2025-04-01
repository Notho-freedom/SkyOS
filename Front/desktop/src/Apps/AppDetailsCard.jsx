import React from 'react';
import { useWebApps } from './AppManager';

const AppDetailsCard = () => {
    const {sApp} = useWebApps();
  const { name, url, icon, createdAt, description, image } = sApp;

  return (
    <div className="w-full h-full p-8 bg-white shadow-lg overflow-hidden transition transform">
<div className='col col-12'>      {/* Header with App Icon and Info */}
      <div className="flex items-center p-4 space-x-4">
        <img
          src={icon}
          alt={`${name} icon`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-blue-500">
            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
          </p>
        </div>
      </div>

      {/* Body with Description */}
      <div className="px-4 py-3 space-y-4">
        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Description</h3>
          <p className="text-gray-600">{description || 'Aucune description disponible.'}</p>
        </div>

        {/* Image Preview */}
        {image && (
          <div className="mt-4">
            <img src={image} alt={`${name} preview`} className="w-full h-auto rounded-lg" />
          </div>
        )}

        {/* Created At */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            <strong>Créé le :</strong> {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
</div>
    </div>
  );
};

export default AppDetailsCard;
