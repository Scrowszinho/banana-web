// src/components/BlinkingStarfield.tsx
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

type BlinkingStarfieldProps = {
  count?: number; // número de estrelas
  radius?: number; // raio de dispersão
  minSize?: number; // tamanho mínimo do ponto
  maxSize?: number; // tamanho máximo do ponto
  blinkSpeed?: number; // velocidade do fade
};

export const BlinkingStarfield: React.FC<BlinkingStarfieldProps> = ({
  count = 1000,
  radius = 50,
  minSize = 0.1,
  maxSize = 0.3,
  blinkSpeed = 0.5,
}) => {
  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // posição esférica
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random());
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // início de alpha entre 0 e 1
      alphas[i] = Math.random();
      // tamanho aleatório entre minSize e maxSize
      sizes[i] = THREE.MathUtils.lerp(minSize, maxSize, Math.random());
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, [count, radius, minSize, maxSize]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: `
        attribute float size;
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard; // forma circular
          gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha);
        }
      `,
    });
  }, []);

  const points = useRef<THREE.Points>(null!);

  useFrame((_, delta) => {
    const alphas = (geom.getAttribute('alpha') as THREE.BufferAttribute)
      .array as Float32Array;
    const positions = (geom.getAttribute('position') as THREE.BufferAttribute)
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      // fade out
      let a = alphas[i] - blinkSpeed * delta * Math.random();
      if (a <= 0) {
        // reposiciona
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = radius * Math.cbrt(Math.random());
        positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        a = 1.0;
      }
      alphas[i] = a;
    }

    geom.getAttribute('alpha').needsUpdate = true;
    geom.getAttribute('position').needsUpdate = true;
  });

  return (
    <points
      ref={points}
      geometry={geom}
      material={material}
      frustumCulled={false}
    />
  );
};
