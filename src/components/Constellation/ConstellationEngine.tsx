import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
    OrbitControls,
    Environment,
    Text,
    PerspectiveCamera,
    Stars,
    Float,
    Line
} from '@react-three/drei';
import * as THREE from 'three';
import ConstellationNode from './ConstellationNode';

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

    // Hierarchical Processing
    const positionedNodes = useMemo(() => {
        const pNodes: any[] = [];
        const rootNode = data.nodes.find(n => n.category === 'ROOT');
        const realmNodes = data.nodes.filter(n => n.category === 'REALMS');
        const leafNodes = data.nodes.filter(n => n.category !== 'ROOT' && n.category !== 'REALMS');

        // 1. PLACE ROOT
        const corePos: [number, number, number] = [0, 0, 0];
        if (rootNode) {
            pNodes.push({
                ...rootNode,
                position: corePos,
                level: 'root',
                clusterCenter: corePos
            });
        }

        // 2. ORBIT REALMS (The Hubs)
        const realmRadius = 35;
        const realmMap: Record<string, [number, number, number]> = {};

        realmNodes.forEach((node, i) => {
            const angle = (i / realmNodes.length) * Math.PI * 2;
            const pos: [number, number, number] = [
                Math.cos(angle) * realmRadius,
                0,
                Math.sin(angle) * realmRadius
            ];
            realmMap[node.name.toUpperCase()] = pos;
            pNodes.push({
                ...node,
                position: pos,
                level: 'realm',
                clusterCenter: corePos // Linked to Root
            });
        });

        // 3. CLUSTER LEAVES (The Spokes)
        leafNodes.forEach((node) => {
            // Find parent hub by category name matching realm name
            const parentKey = node.category.toUpperCase();
            const hubPos = realmMap[parentKey] || [0, 0, 0];

            // Random offset within the sector cluster
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            const dist = 8 + Math.random() * 6;

            const pos: [number, number, number] = [
                hubPos[0] + dist * Math.sin(theta) * Math.cos(phi),
                hubPos[1] + dist * Math.sin(theta) * Math.sin(phi),
                hubPos[2] + dist * Math.cos(theta)
            ];

            pNodes.push({
                ...node,
                position: pos,
                level: 'leaf',
                clusterCenter: hubPos // Linked to Realm Hub
            });
        });

        return pNodes;
    }, [data.nodes]);

    return (
        <group ref={groupRef}>
            {/* Hierarchical Connections */}
            {positionedNodes.map((node, i) => {
                if (node.id === 'home') return null; // Root has no parent
                return (
                    <Line
                        key={`line-${node.id}-${i}`}
                        points={[node.clusterCenter, node.position]}
                        color={node.level === 'realm' ? "#FFFFFF" : (node.color || "#2E5CFF")}
                        lineWidth={node.level === 'realm' ? 1.5 : 0.4}
                        transparent
                        opacity={node.level === 'realm' ? 0.4 : 0.15}
                    />
                );
            })}

            {/* Nodes */}
            {positionedNodes.map((node) => (
                <ConstellationNode
                    key={node.id}
                    data={node}
                    position={node.position}
                    scale={node.level === 'root' ? 2 : node.level === 'realm' ? 1.5 : 1}
                />
            ))}

            {/* Labels - Only for Root and Realms to provide "Direction to Approach" */}
            {positionedNodes.filter(n => n.level !== 'leaf').map((node) => (
                <group key={`label-con-${node.id}`} position={[node.position[0], node.position[1] + (node.level === 'root' ? 3 : 2), node.position[2]]}>
                    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                        <Text
                            fontSize={node.level === 'root' ? 5 : 3.5}
                            color={node.level === 'root' ? "#FFFFFF" : "#00C2FF"}
                            fillOpacity={0.9}
                            outlineWidth={0.05}
                            outlineColor="#000"
                            textAlign="center"
                        >
                            {node.name.toUpperCase()}
                        </Text>
                    </Float>
                </group>
            ))}

            <Stars radius={200} depth={60} count={6000} factor={4} saturation={0} fade speed={1.5} />
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
