import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    const ref = useRef<THREE.Group>(null);

    // The "Wiggle" Animation
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime();
        // Anisotropic "Breathing" rotation
        ref.current.rotation.y = Math.sin(t * 0.5) * 0.3;
        ref.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    });

    return <primitive object={scene} ref={ref} scale={2} />;
}

export default function WiggleLogo3D() {
    // Path to the requested GLB (served via public or imported)
    // Since it's in a separate repo, we assume it's copied to public/assets or we access via relative path if aligned?
    // User path: d:\GitHub\quantum-assets\R2_STAGING\_site\EN_Logo_ForgedCarbon.glb
    // We need to ensure this file is accessible to the dev server. 
    // Ideally, we copy it to public/assets/models/

    // For now, I will assume I need to COPY it first.
    // Placeholder URL until copy step is done: "/assets/models/EN_Logo_ForgedCarbon.glb"

    return (
        <div className="w-full h-96">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Model url="/assets/models/en_logo.glb" />
                </Float>

                <Environment preset="city" />
                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
            </Canvas>
        </div>
    );
}
