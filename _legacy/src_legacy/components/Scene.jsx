import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Globe from './Globe';

export default function Scene({ works, characters, selectedWork, onSelectWork }) {
    return (
        <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <color attach="background" args={['#050510']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffd700" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f0ff" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <Suspense fallback={null}>
                    <Globe
                        works={works}
                        characters={characters}
                        selectedWork={selectedWork}
                        onSelectWork={onSelectWork}
                    />
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={3.5}
                    maxDistance={10}
                    autoRotate={!selectedWork}
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
}
