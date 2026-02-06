import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Banana } from './Banana';
import { BlinkingStarfield } from './Starfield';

export const Scene: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        onCreated={({ gl, camera }) => {
          const resize = () => {
            const { width, height } = gl.domElement.getBoundingClientRect();
            gl.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          };
          window.addEventListener('resize', resize);
          resize();
          return () => window.removeEventListener('resize', resize);
        }}
        camera={{
          fov: 40,
          near: 0.1,
          far: 10,
          position: [0, 0, 6],
        }}
        style={{
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(50% 50% at 50% 50%, #000000 0%, #000002 94.5%)',
          backdropFilter: 'blur(120px)',
        }}
      >
        <BlinkingStarfield count={1500} radius={30} />
        <ambientLight intensity={0.4} />
        <pointLight
          color="#FDFFD3"
          position={[10, 10, 10]}
          intensity={100}
          distance={100}
          decay={1.2}
        />
        <Suspense fallback={null}>
          <Banana position={[0, 0, 0]} scale={[3, 3, 3]} />
        </Suspense>
        <OrbitControls minDistance={4} maxDistance={9} />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(10px, 5vh, 20px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.6)',
          color: '#fff',
          padding: 'clamp(4px, 1.5vw, 8px) clamp(8px, 3vw, 16px)',
          borderRadius: '4px',
          fontSize: 'clamp(12px, 1.2vw, 18px)',
          pointerEvents: 'none',
        }}
      >
        Banana'dev
      </div>
    </div>
  );
};
