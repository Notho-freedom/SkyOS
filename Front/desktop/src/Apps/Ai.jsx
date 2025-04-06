import React, { useEffect, useRef } from 'react';

const RealisticAI = () => {
  const headRef = useRef(null);

  useEffect(() => {
    let angle = 0;
    const animate = () => {
      angle += 0.5; // Ralentir un peu l'animation
      headRef.current.style.transform = `rotateY(${angle}deg)`;
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div style={{
      width: '200px',
      height: '300px',
      perspective: '1000px',
      margin: '50px auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Tête */}
      <div ref={headRef} style={{
        position: 'relative',
        width: '120px',
        height: '160px',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s linear'
      }}>
        {/* Visage (avant) */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, #FFDBAC, #F5C27C)',
          borderRadius: '60% 60% 50% 50%',
          transform: 'translateZ(30px)',
          border: '2px solid #E8B796',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
        }}>
          {/* Yeux */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            paddingTop: '40px'
          }}>
            <div style={{
              width: '20px',
              height: '10px',
              background: '#333',
              borderRadius: '50%',
              borderBottom: '3px solid #fff'
            }} />
            <div style={{
              width: '20px',
              height: '10px',
              background: '#333',
              borderRadius: '50%',
              borderBottom: '3px solid #fff'
            }} />
          </div>
          
          {/* Nez */}
          <div style={{
            width: '10px',
            height: '15px',
            background: '#E8B796',
            margin: '15px auto',
            borderRadius: '40%'
          }} />
          
          {/* Bouche */}
          <div style={{
            width: '30px',
            height: '10px',
            background: '#D75A6B',
            margin: '15px auto',
            borderRadius: '0 0 20px 20px',
            boxShadow: 'inset 0 -5px 0 rgba(0,0,0,0.2)'
          }} />
        </div>
        
        {/* Côté droit du visage */}
        <div style={{
          position: 'absolute',
          width: '30px',
          height: '160px',
          background: 'linear-gradient(to left, #F5C27C, #E8B796)',
          right: '0',
          top: '0',
          transform: 'rotateY(90deg) translateZ(60px)',
          borderRadius: '0 20px 20px 0'
        }} />
        
        {/* Côté gauche du visage */}
        <div style={{
          position: 'absolute',
          width: '30px',
          height: '160px',
          background: 'linear-gradient(to right, #F5C27C, #E8B796)',
          left: '0',
          top: '0',
          transform: 'rotateY(-90deg) translateZ(60px)',
          borderRadius: '20px 0 0 20px'
        }} />
        
        {/* Arrière de la tête */}
        <div style={{
          position: 'absolute',
          width: '120px',
          height: '160px',
          background: 'linear-gradient(to bottom, #E8B796, #D7A278)',
          borderRadius: '50%',
          transform: 'rotateY(180deg) translateZ(30px)'
        }} />
        
        {/* Cheveux */}
        <div style={{
          position: 'absolute',
          width: '140px',
          height: '180px',
          background: '#5D4037',
          borderRadius: '70% 70% 50% 50%',
          top: '-15px',
          left: '-10px',
          transform: 'translateZ(15px)',
          boxShadow: 'inset 0 -20px 20px rgba(0,0,0,0.3)'
        }} />
      </div>
    </div>
  );
};

export default RealisticAI;