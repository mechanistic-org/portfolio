import  { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, scrollY }: { url: string; scrollY: number }) {
    const { scene } = useGLTF(url);
    const ref = useRef<THREE.Group>(null);

    // Interaction State
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    // The "Wiggle" Animation + Scroll Parallax + Interaction Impulse
    useFrame((state, delta) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime();

        // 1. Idle "Breathing" (Original)
        const idleRotY = Math.sin(t * 0.5) * 0.3;
        const idleRotX = Math.sin(t * 0.3) * 0.1;

        // 2. Scroll Parallax (Refined)
        const scrollRotY = (scrollY / 3000) * Math.PI * 2;

        // 3. Interaction Impulse (Lerp)
        // Hover: +10% Scale, Click/Grab: -5% Scale (Tactile Squeeze)
        const targetScaleImpulse = active ? 0.95 : (hovered ? 1.1 : 1.0);
        // We use a mutable ref for smooth damping if we wanted, but lerping property is fine
        // We need to access the current scale to lerp it. 
        // But we are setting it every frame based on Scroll Zoom.
        // So we should calculate the Base Zoom, then multiply by Impulse.

        // Base Zoom (Scroll)
        const baseZoom = Math.min(25.0, 9.0 + (scrollY / 800) * 16);

        // We need a persistent state for the CURRENT impulse to lerp it smoothly
        // Hack: Store impulse in userData or just rely on visual smoothness
        // Let's use a local variable for the smoothed impulse if we could, 
        // but react functional component re-runs. 
        // Actually, let's just use a ref for the impulse value.
    });

    // We need a ref to store the current impulse value to lerp it
    const impulse = useRef(1);

    useFrame((state, delta) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime();

        // 1. Rotation logic
        const idleRotY = Math.sin(t * 0.5) * 0.3;
        const idleRotX = Math.sin(t * 0.3) * 0.1;
        const scrollRotY = (scrollY / 3000) * Math.PI * 2;

        ref.current.rotation.y = idleRotY + scrollRotY;
        ref.current.rotation.x = idleRotX;

        // 2. Scale logic
        const targetImpulse = active ? 0.9 : (hovered ? 1.1 : 1.0);
        // Smooth lerp (Spring-like speed)
        impulse.current = THREE.MathUtils.lerp(impulse.current, targetImpulse, delta * 10);

        const baseZoom = Math.min(25.0, 9.0 + (scrollY / 800) * 16);

        ref.current.scale.setScalar(baseZoom * impulse.current);
    });

    return (
        <primitive
            object={scene}
            ref={ref}
            onPointerOver={() => { document.body.style.cursor = 'grab'; setHover(true); }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
            onPointerDown={() => { document.body.style.cursor = 'grabbing'; setActive(true); }}
            onPointerUp={() => { document.body.style.cursor = 'grab'; setActive(false); }}
        />
    );
}

export default function WiggleLogoParallax() {
    const [scrollY, setScrollY] = useState(0);

    // Track Window Scroll (Refactored for Body Scroll arch)
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                {/* Optimized Lighting (Matched to WiggleLogo3D 'Best Lit' Config) */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                <PresentationControls
                    global={false} // Only spin when grabbing the mesh
                    cursor={true}
                    snap={true} // Elastic snap-back
                    speed={2} // Fast spin
                    zoom={0.8} // Bounce zoom
                    rotation={[0, 0, 0]}
                    polar={[-Math.PI / 4, Math.PI / 4]} // Vertical limit
                    azimuth={[-Math.PI / 2, Math.PI / 2]} // Horizontal limit
                >
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <Model url="/assets/models/en_logo.glb" scrollY={scrollY} />
                    </Float>
                </PresentationControls>

                <Environment preset="city" />
                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
            </Canvas>
        </div>
    );
}
