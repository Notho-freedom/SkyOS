import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState
} from 'react';
import PropTypes from 'prop-types';
import useBackgroundManager from './useBackgroundManager';
import Loader from '../../../animations/loader';
import BackgroundImage from './BackgroundImage';

const DesktopBackground = forwardRef(({ children, width, height }, ref) => {
  const {
    currentBg,
    nextBg,
    loading,
    imageLoaded,
    setImageLoaded,
    refreshBackground,
    saveCurrentBackground,
    setCurrentBg,
    blurEnabled,
    blurAmount,
  } = useBackgroundManager(width, height);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useImperativeHandle(ref, () => ({
    refreshBackground,
    saveCurrentBackground,
    isImageLoaded: imageLoaded,
  }));

  useEffect(() => {
    return () => {
      [currentBg, nextBg].forEach((url) => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [currentBg, nextBg]);

  const handleNextBgLoad = () => {
    setIsTransitioning(true);
    setImageLoaded(true);

    setTimeout(() => {
      setCurrentBg(nextBg);
      setIsTransitioning(false);
    }, 1000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-100">
          <Loader />
        </div>
      ) : (
        <>
          {currentBg && (
            <BackgroundImage
              src={currentBg}
              onLoad={() => setImageLoaded(true)}
              zIndex={0}
              blur={blurEnabled ? blurAmount : null}
              hidden={isTransitioning}
            />
          )}

          {nextBg && isTransitioning && (
            <BackgroundImage
              src={nextBg}
              onLoad={handleNextBgLoad}
              zIndex={1}
              blur={blurEnabled ? blurAmount : null}
              hidden={false}
              animateFade
            />
          )}

          <div className="relative z-20 w-full h-full">{children}</div>
        </>
      )}
    </div>
  );
});

DesktopBackground.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number,
  height: PropTypes.number,
};

DesktopBackground.defaultProps = {
  width: typeof window !== 'undefined' ? window.innerWidth : 1920,
  height: typeof window !== 'undefined' ? window.innerHeight : 1080,
};

export default DesktopBackground;
