// src/components/Banana.tsx
import { JSX } from 'react';
import { useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';

// o '?url' faz o Vite devolver uma URL pública para o arquivo
import bananaUrl from './banana.glb?url';

type BananaGLTF = GLTF & { nodes: any; materials: any };

export function Banana(props: JSX.IntrinsicElements['group']) {
  const { scene } = useGLTF(bananaUrl) as BananaGLTF;
  return <primitive object={scene} {...props} />;
}
