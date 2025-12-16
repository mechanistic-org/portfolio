import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// --- LAYER COMPONENT ---
function StackLayer({
    label,
    subtext,
    color,
    baseY,
    progress,
    delay
}: {
    label: string,
    subtext: string,
    color: string,
    baseY: number,
    progress: number,
    delay: number
}) {
    const ref = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!ref.current) return;

        // Easing: Smooth step for the progress
        // Explode Factor: At progress 0, we want big gap (factor 5). At progress 1, gap is 1 (normal).
        // Actually, let's map Progress 0 -> y * 4. Progress 1 -> y * 1.

        // We clamp progress 0-1.
        const p = THREE.MathUtils.clamp(progress, 0, 1);

        // Inverse: 0 input = 1 (active/assembled)? 
        // Let's make: Scroll Down -> Assembles.
        // So at Start (Top of section), Process = 0. State = Exploded.
        // At End (Bottom of section), Process = 1. State = Assembled.

        const separation = THREE.MathUtils.lerp(3.5, 0, p); // Large gap to Zero gap relative to base

        // Apply separation relative to center.
        // Top layer (baseY > 0) moves UP. Bot layer (baseY < 0) moves DOWN.
        // Center layer (baseY 0) stays.

        // Wait, baseY defines the "Assembled" position relative to each other?
        // Let's say Assembled is baseY.
        // Exploded is baseY * 4.

        // Exception: Center layer (0) won't move if we multiply by 4.
        // So we add an offset.

        const explodeOffset = baseY * 3; // Extra distance
        const targetY = baseY + (explodeOffset * (1 - p));

        // Rotation: Spin when exploded, lock when assembled.
        const revP = 1 - p; // 1 at start, 0 at end
        const rotX = Math.sin(state.clock.elapsedTime + delay) * 0.2 * revP;
        const rotZ = Math.cos(state.clock.elapsedTime + delay) * 0.1 * revP;

        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, delta * 5);
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, rotX, delta * 5);
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, rotZ, delta * 5);
    });

    return (
        <group ref={ref}>
            {/* The Glass Board */}
            <RoundedBox args={[4, 0.5, 4]} radius={0.05} receiveShadow castShadow>
                <meshPhysicalMaterial
                    color={color}
                    transparent
                    opacity={0.8}
                    transmission={0.5}
                    roughness={0.1}
                    metalness={0.1}
                    thickness={0.5}
                />
            </RoundedBox>

            {/* The Circuit Traces (Visual) */}
            <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[3.8, 3.8]} />
                <meshBasicMaterial color={color} wireframe opacity={0.2} transparent />
            </mesh>

            {/* Label Front */}
            <Text
                position={[0, 0, 2.1]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnF8RD8yKxTOlOV.woff"
            >
                {label}
            </Text>
            <Text
                position={[0, -0.2, 2.1]}
                fontSize={0.15}
                color="#aaa"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnF8RD8yKxTOlOV.woff"
            >
                {subtext}
            </Text>
        </group>
    );
}

// --- SCENE ---
function AssemblyScene({ progress }: { progress: number }) {
    // Progress 0 = Exploded, 1 = Assembled
    // Reverse it? No, let's say as you arrive (0), it's messy. As you finish (1), it's solid.

    // We want it to be fully assembled when the user stops at the bottom.
    // So targetY should be 0 at progress 1.

    return (
        <group rotation={[Math.PI / 6, Math.PI / 4, 0]}>
            <Float floatIntensity={0.5} speed={2}>
                {/* 1. TOP LAYER: CLIENT */}
                <StackLayer
                    label="CLIENT_SIDE"
                    subtext="REACT // THREE.JS"
                    color="#00d8ff"
                    baseY={1.2}
                    progress={progress}
                    delay={0}
                />

                {/* 2. MID LAYER: SERVER */}
                <StackLayer
                    label="EDGE_COMPUTE"
                    subtext="ASTRO // SSR"
                    color="#ff5d00"
                    baseY={0}
                    progress={progress}
                    delay={0.1}
                />

                {/* 3. BOT LAYER: INFRA */}
                <StackLayer
                    label="INFRASTRUCTURE"
                    subtext="CLOUDFLARE // R2"
                    color="#f38020"
                    baseY={-1.2}
                    progress={progress}
                    delay={0.2}
                />
            </Float>
            <Environment preset="city" />
        </group>
    );
}



// --- COMPONENT ---
export default function SystemAssembly() {
    const [progress, setProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = document.getElementById('hyperspace-container');
        if (!container) return;

        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Logic:
            // When section top enters bottom of viewport -> Start (0)
            // When section bottom enters bottom of viewport -> End?
            // Actually, we want it to assemble as we center it.

            // Let's say: 
            // 0% when Top of Section is at Bottom of Viewport.
            // 100% when Top of Section is at Top of Viewport (or Center).

            const start = viewportHeight; // Bottom of screen
            const end = 0; // Top of screen

            // rect.top is position relative to viewport top.
            // distance = start - rect.top
            // range = start - end = viewportHeight
            // pct = distance / range

            const rawPct = (start - rect.top) / viewportHeight;
            const pct = Math.max(0, Math.min(1, rawPct));

            setProgress(pct);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative"
        >
            <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <AssemblyScene progress={progress} />
            </Canvas>

            <div className="absolute bottom-32 left-0 w-full text-center pointer-events-none">
                <p className="font-mono text-xs text-neutral-500">
                    SYSTEM INTEGRITY: {Math.round(progress * 100)}%
                </p>
            </div>
        </div>
    );
}
