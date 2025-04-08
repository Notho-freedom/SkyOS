import React from 'react';

const Loader = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent space-y-4 gap-4">
      <div className="relative w-[4vw] h-[4vw] group cursor-pointer">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-sky-200 animate-complexSpin transform-gpu">
          <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/40 to-transparent animate-pulse"></div>
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-300/30 to-blue-400/30 animate-energyFlow mix-blend-screen"></div>
          <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-dynamicReflect"></div>
        </div>

        <div className="absolute -inset-6 rounded-full bg-radial-gradient(from_60%_60%, #00aaff10, transparent 60%) animate-haloPulse mix-blend-lighten"></div>

        <div className="absolute inset-0 rounded-full animate-particleFloat">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-white font-semibold text-[clamp(0.8rem, 1.5vw, 1.1rem)]">
        Chargement...
      </div>
    </div>
  );
};

export default Loader;
