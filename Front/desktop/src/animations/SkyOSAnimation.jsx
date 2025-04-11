import React, { useEffect, useState } from "react";
import "./SkyOSAnimation.css"; // Assurez-vous d'inclure ce fichier CSS dans le projet

const SkyOSAnimation = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch((prev) => !prev);
    }, 2000); // Change le glitch tous les 2s

    return () => clearInterval(interval); // Nettoie l'intervalle au démontage
  }, []);

  return (
    <div className="skyos-container">
      <h1 className={`skyos-title ${glitch ? "glitch" : ""}`}>
        <span>S</span>.<span>k</span>.<span>y</span>.<span>O</span>.<span>S</span>
      </h1>
    </div>
  );
};

export default SkyOSAnimation;
