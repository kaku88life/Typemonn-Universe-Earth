import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

// Convert lat/lng to 3D vector on a sphere of radius R
function latLngToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
}

const Marker = ({ position, label, color, isSelected, onClick, type = 'work' }) => {
    const [hovered, setHovered] = useState(false);

    // Scale marker on hover/selection
    const scale = hovered || isSelected ? 1.5 : 1;
    const size = type === 'character' ? 0.05 : 0.08;

    return (
        <group position={position}>
            <mesh
                onClick={onClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={[scale, scale, scale]}
            >
                <sphereGeometry args={[size, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isSelected || hovered ? 2 : 0.5}
                    toneMapped={false}
                />
            </mesh>
            {(isSelected || hovered) && (
                <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
                    <div className="glass-panel" style={{
                        padding: '6px 10px',
                        minWidth: 'max-content',
                        transform: 'translate3d(-50%, -150%, 0)',
                        marginTop: '-10px'
                    }}>
                        <div style={{ color: color, fontWeight: 'bold', fontSize: '12px' }}>{label}</div>
                    </div>
                </Html>
            )}
        </group>
    );
};

export default function Globe({ works, characters, selectedWork, onSelectWork }) {
    const groupRef = useRef();

    // Auto-rotation when idle
    useFrame((state, delta) => {
        if (!selectedWork && groupRef.current) {
            groupRef.current.rotation.y += delta * 0.05;
        }
    });

    // Smoothly rotate to target when selected (simple implementation)
    useFrame(() => {
        if (selectedWork && groupRef.current) {
            // Advanced rotation logic would go here. 
            // For now, we rely on the user to explore or initial orientation.
            // Or we could implement a simple lerp to face the selected work.
            const work = works.find(w => w.id === selectedWork.id);
            if (work) {
                // Find target rotation to bring work.location to z-positive
                // This is complex to do right without camera controls, strictly optional for MVP.
                // We just stop auto-rotation.
            }
        }
    });

    return (
        <group ref={groupRef}>
            {/* Base Planet */}
            <Sphere args={[2, 64, 64]}>
                <meshStandardMaterial
                    color="#0a1a3a"
                    roughness={0.7}
                    metalness={0.5}
                />
            </Sphere>

            {/* Wireframe / Grid Atmosphere */}
            <Sphere args={[2.02, 32, 32]}>
                <meshBasicMaterial
                    color="#1a3a6a"
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </Sphere>

            {/* Markers: Works */}
            {works.map((work) => {
                const pos = latLngToVector3(work.location.lat, work.location.lng, 2.02);
                const isSelected = selectedWork && selectedWork.id === work.id;
                return (
                    <Marker
                        key={work.id}
                        position={pos}
                        label={work.location.name}
                        color={work.color}
                        isSelected={isSelected}
                        type="work"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectWork(work);
                        }}
                    />
                );
            })}

            {/* Markers: Characters */}
            {characters.map((char) => {
                const pos = latLngToVector3(char.origin.lat, char.origin.lng, 2.02);
                return (
                    <Marker
                        key={`char-${char.id}`}
                        position={pos}
                        label={`${char.name} (Origin)`}
                        color="#00F0FF" // Cyan for characters, distinct from colored works
                        isSelected={false}
                        type="character"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Placeholder for character selection logic if needed
                        }}
                    />
                );
            })}
        </group>
    );
}
