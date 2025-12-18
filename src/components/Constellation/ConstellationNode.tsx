import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface NodeProps {
    data: any;
    position: [number, number, number];
    scale?: number;
}

export default function ConstellationNode({ data, position, scale = 1 }: NodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;

        // 1. Subtle "Breathing" / Wiggle
        const t = state.clock.getElapsedTime();
        const wiggle = Math.sin(t + (data.id?.charCodeAt(0) || 0)) * 0.05;
        meshRef.current.position.y = position[1] + wiggle;

        // 2. Scale Lerp on Hover
        const baseScale = scale;
        const targetScale = hovered ? baseScale * 1.5 : baseScale;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    const handleNodeClick = (e: any) => {
        e.stopPropagation();
        if (data.url) {
            window.location.href = data.url;
        } else if (data.id.startsWith('realm-')) {
            window.location.href = `/#${data.id}`;
        } else {
            // Default to project view if it looks like a project ID
            window.location.href = `/projects/${data.id}`;
        }
    };

    return (
        <group position={position}>
            {/* The Physical Node */}
            <mesh
                ref={meshRef}
                onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { setHover(false); document.body.style.cursor = 'auto'; }}
                onClick={handleNodeClick}
            >
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial
                    color={hovered ? "#00C2FF" : (data.color || "#2E5CFF")}
                    emissive={hovered ? "#00C2FF" : "#000"}
                    emissiveIntensity={hovered ? 0.8 : 0}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>

            {/* Floating Label */}
            <group position={[0, 0.7, 0]}>
                <Text
                    fontSize={0.2}
                    color="white"
                    maxWidth={2}
                    textAlign="center"
                    fillOpacity={hovered ? 1 : 0.5}
                >
                    {data.name?.toUpperCase() || "UNKNOWN"}
                </Text>

                {hovered && (data.group || data.year) && (
                    <Text
                        position={[0, -0.2, 0]}
                        fontSize={0.1}
                        color="#00C2FF"
                    >
                        {data.group?.toUpperCase() || ""} {data.year ? `// ${data.year}` : ""}
                    </Text>
                )}
            </group>
        </group>
    );
}
