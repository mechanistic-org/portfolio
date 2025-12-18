import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    OrbitControls,
    Environment,
    Text,
    PerspectiveCamera,
    Stars,
    Float,
    Line
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import ConstellationNode from './ConstellationNode';
import Nebula from './Nebula';

interface NodeData {
    id: string;
    name: string;
    group?: string;
    color?: string;
    value?: number;
    year?: number;
    category: string;
    img?: string;
    start_date?: string;
    end_date?: string;
}

interface ConstellationEngineProps {
    data: { nodes: NodeData[] };
    layout?: 'tectonic' | 'cylinder';
}

function Stage({ data, layout = 'tectonic' }: { data: { nodes: NodeData[] }, layout?: 'tectonic' | 'cylinder' }) {
    const groupRef = useRef<THREE.Group>(null);

    // Macroscopic Global Physics
    useFrame((state) => {
        if (!groupRef.current) return;
        // Slow majestic rotation
        groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.02;
    });

    const positionedNodes = useMemo(() => {
        const pNodes: any[] = [];
        const realmNodes = data.nodes.filter(n => n.category === 'REALMS');
        const coreNodes = data.nodes.filter(n => n.category === 'CORE');
        const leafNodes = data.nodes.filter(n => n.category !== 'REALMS' && n.category !== 'CORE');

        const origin: [number, number, number] = [0, 0, 0];

        // 1. PLACE CORE (The Self) - Tight spherical cluster near origin
        coreNodes.forEach((node, i) => {
            const phi = Math.acos(-1 + (2 * i) / coreNodes.length);
            const theta = Math.sqrt(coreNodes.length * Math.PI) * phi;
            const dist = 6 + Math.random() * 2;

            const pos: [number, number, number] = [
                dist * Math.cos(theta) * Math.sin(phi),
                dist * Math.sin(theta) * Math.sin(phi),
                dist * Math.cos(phi)
            ];

            pNodes.push({
                ...node,
                position: pos,
                level: 'core',
                clusterCenter: origin
            });
        });

        // 2. ORBIT REALMS (The Macroscopic Anchors) - Non-coplanar spherical distribution
        // Using fixed angles that are explicitly NOT on the XZ plane
        const realmRadius = 45;
        const realmMap: Record<string, [number, number, number]> = {};

        // Explicitly defining spherical coords for the 4 realms to ensure they aren't coplanar
        // [phi (lat), theta (long)]
        const coords: [number, number][] = [
            [Math.PI * 0.4, 0],              // WORK
            [Math.PI * 0.6, Math.PI * 0.5],   // SPECS
            [Math.PI * 0.3, Math.PI],         // SYSTEM
            [Math.PI * 0.7, Math.PI * 1.5]    // ARCHIVE
        ];

        realmNodes.forEach((node, i) => {
            const [phi, theta] = coords[i % coords.length];
            const pos: [number, number, number] = [
                realmRadius * Math.sin(phi) * Math.cos(theta),
                realmRadius * Math.cos(phi),
                realmRadius * Math.sin(phi) * Math.sin(theta)
            ];

            realmMap[node.name.toUpperCase()] = pos;
            pNodes.push({
                ...node,
                position: pos,
                level: 'realm',
                clusterCenter: origin
            });
        });

        // 3. CLUSTER LEAVES (The Satellites) - Spherical branching
        leafNodes.forEach((node) => {
            const parentKey = node.category.toUpperCase();
            const hubPos = realmMap[parentKey] || realmMap['WORK'] || origin;

            // Distributed spherical cluster around hub
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            const dist = 10 + Math.random() * 8;

            const pos: [number, number, number] = [
                hubPos[0] + dist * Math.sin(theta) * Math.cos(phi),
                hubPos[1] + dist * Math.cos(theta),
                hubPos[2] + dist * Math.sin(theta) * Math.sin(phi)
            ];

            pNodes.push({
                ...node,
                position: pos,
                level: 'leaf',
                clusterCenter: hubPos
            });
        });

        return pNodes;
    }, [data.nodes]);

    return (
        <group ref={groupRef}>
            {/* The Nebula Background */}
            <Nebula />

            {/* Majestic Beams */}
            {positionedNodes.map((node, i) => (
                <Line
                    key={`line-${node.id}-${i}`}
                    points={[node.clusterCenter, node.position]}
                    color={node.level === 'realm' ? "#FFFFFF" : (node.color || "#2E5CFF")}
                    lineWidth={node.level === 'realm' ? 2 : 0.4}
                    transparent
                    opacity={node.level === 'realm' ? 0.3 : 0.15}
                />
            ))}

            {/* Nodes */}
            {positionedNodes.map((node) => (
                <ConstellationNode
                    key={node.id}
                    data={node}
                    position={node.position}
                    scale={node.level === 'realm' ? 2 : node.level === 'core' ? 1.5 : 1}
                />
            ))}

            {/* Macroscopic Labels */}
            {positionedNodes.filter(n => n.level !== 'leaf').map((node) => (
                <group key={`label-con-${node.id}`} position={node.position}>
                    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
                        <Text
                            position={[0, node.level === 'realm' ? 3.5 : 2, 0]}
                            fontSize={node.level === 'realm' ? 4.5 : 2.5}
                            color={node.level === 'core' ? "#FFFFFF" : "#00C2FF"}
                            fillOpacity={0.9}
                            outlineWidth={0.06}
                            outlineColor="#000"
                            textAlign="center"
                        >
                            {node.name.toUpperCase()}
                        </Text>
                    </Float>
                </group>
            ))}

            <Stars radius={300} depth={80} count={9000} factor={7} saturation={0} fade speed={1} />

            {/* $10M Post-Processing Glow */}
            <EffectComposer>
                <Bloom
                    luminanceThreshold={1.0}
                    mipmapBlur
                    intensity={1.5}
                    radius={0.4}
                />
                <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </group>
    );
}

export default function ConstellationEngine({ data, layout = 'tectonic' }: ConstellationEngineProps) {
    if (!data || !data.nodes) return null;

    return (
        <div className="w-full h-full bg-black">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 40, 100]} fov={50} />

                <ambientLight intensity={0.5} />
                <pointLight position={[20, 20, 20]} intensity={2} color="#2E5CFF" />
                <spotLight position={[-30, 30, 30]} angle={0.2} penumbra={1} intensity={3} />

                <React.Suspense fallback={null}>
                    <Stage data={data} layout={layout} />
                    <Environment preset="night" />
                </React.Suspense>

                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                    minDistance={10}
                    maxDistance={500}
                    makeDefault
                />
            </Canvas>
        </div>
    );
}
