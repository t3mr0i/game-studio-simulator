import React, { useState, useEffect } from 'react';

function FloatingNumber({ value, x, y }) {
  const [position, setPosition] = useState({ x, y });
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setPosition(prev => ({ x: prev.x, y: prev.y - 1 }));
      setOpacity(prev => prev - 0.02);
    });

    if (opacity <= 0) {
      cancelAnimationFrame(animationFrame);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [position, opacity]);

  if (opacity <= 0) return null;

  return (
    <div
      className="absolute text-yellow-300 font-bold text-lg pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        opacity,
      }}
    >
      +{value}
    </div>
  );
}

export default FloatingNumber;