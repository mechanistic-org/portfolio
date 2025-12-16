import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, scrollY }: { url: string; scrollY: number }) {
    const { scene } = useGLTF(url);
    const ref = useRef<THREE.Group>(null);

    // The "Wiggle" Animation + Scroll Parallax
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime();

        // 1. Idle "Breathing" (Original)
        const idleRotY = Math.sin(t * 0.5) * 0.3;
        const idleRotX = Math.sin(t * 0.3) * 0.1;

        // 2. Scroll Parallax (Refined)
        // Rotation: Slow tumbling
        const scrollRotY = (scrollY / 3000) * Math.PI * 2;

        // Zoom: Fit-to-Frustum Start (9.0), then Infinite Zoom (25.0).
        // Compromise: Fits vertically at rest, then explodes.
        const zoom = Math.min(25.0, 9.0 + (scrollY / 800) * 16);

        ref.current.rotation.y = idleRotY + scrollRotY;
        ref.current.rotation.x = idleRotX;
        ref.current.scale.setScalar(zoom);
    });

    return <primitive object={scene} ref={ref} />;
}

export default function WiggleLogoParallax() {
    const [scrollY, setScrollY] = useState(0);

    // Track Container Scroll
    useEffect(() => {
        const container = document.getElementById('hyperspace-container');
        if (!container) return;

        const handleScroll = () => {
            setScrollY(container.scrollTop);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Model url="/assets/models/en_logo.glb" scrollY={scrollY} />
                </Float>

                <Environment preset="city" />
                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
            </Canvas>
        </div>
    );
}
