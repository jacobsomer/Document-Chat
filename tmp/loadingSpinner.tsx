import React from 'react';

interface Props {
  colorHex: string;
  size: number,
}

const LoadingSpinner = ({ colorHex, size }: Props): JSX.Element => {
  const height = 24;

  const spinnerRotateKeyframes = `@keyframes spinner-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }`;

  return (
    <div
      style={{
        display: 'inline-block',
        position: 'relative',
        width: size,
        height: size
      }}
    >
      <style>{spinnerRotateKeyframes}</style>
      <div
        style={{
          boxSizing: 'border-box',
          display: 'block',
          position: 'absolute',
          width: size + 4,
          height: size + 4,
          padding: 4,
          border: '2px solid',
          //borderColor: "hsl(var(--s))",
          borderRadius: '50%',
          animation:
            'spinner-rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          borderColor: 'hsl(var(--s)) transparent transparent transparent'
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
