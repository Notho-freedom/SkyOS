// BackgroundImage.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const BackgroundImage = ({
  src,
  onLoad,
  zIndex,
  blur,
  hidden,
  animateFade,
}) => {
  return (
    <img
      alt="Background"
      src={src}
      onLoad={onLoad}
      className={clsx(
        'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
        {
          [`blur-${blur} brightness-75 scale-105`]: blur,
          'opacity-0': hidden,
          'opacity-100': !hidden,
          [`z-[${zIndex}]`]: true,
        }
      )}
      draggable={false}
    />
  );
};

BackgroundImage.propTypes = {
  src: PropTypes.string.isRequired,
  onLoad: PropTypes.func,
  zIndex: PropTypes.number,
  blur: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hidden: PropTypes.bool,
  animateFade: PropTypes.bool,
};

BackgroundImage.defaultProps = {
  onLoad: () => {},
  zIndex: 0,
  blur: null,
  hidden: false,
  animateFade: false,
};

export default BackgroundImage;
