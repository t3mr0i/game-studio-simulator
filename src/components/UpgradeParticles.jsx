import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function UpgradeParticles() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          color: { value: "#ffffff" },
          links: { enable: false },
          move: {
            direction: "top",
            enable: true,
            outModes: "out",
            random: false,
            speed: 2,
            straight: false
          },
          number: { density: { enable: true, area: 800 }, value: 50 },
          opacity: {
            animation: { enable: true, minimumValue: 0, speed: 1, sync: false },
            random: { enable: true, minimumValue: 0.1 },
            value: 1
          },
          shape: { type: "circle" },
          size: {
            random: { enable: true, minimumValue: 1 },
            value: 3
          }
        },
        detectRetina: true
      }}
    />
  );
}

export default UpgradeParticles;
