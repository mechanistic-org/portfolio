import  { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	useGLTF,
	Environment,
	Float,
	ContactShadows,
	PresentationControls,
} from "@react-three/drei";
import * as THREE from "three";

function Model({ url }: { url: string }) {
	const { scene } = useGLTF(url);
	const ref = useRef<THREE.Group>(null);

	// The "Wiggle" Animation (Matched to Parallax Version)
	useFrame((state) => {
		if (!ref.current) return;
		const t = state.clock.getElapsedTime();
		// 1. Idle "Breathing" (Original)
		ref.current.rotation.y = Math.sin(t * 0.5) * 0.3;
		ref.current.rotation.x = Math.sin(t * 0.3) * 0.1;
	});

	// Base Scale matched to WiggleLogoParallax (Starts at 9.0 -> Boosted to 12.0)
	return <primitive object={scene} ref={ref} scale={12} />;
}

export default function WiggleLogo3D() {
	// ... (comments omitted for brevity) ...

	return (
		<div className="h-full w-full bg-transparent">
			<Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
				<ambientLight intensity={1.0} />
				{/* Key Light: High Front-Right */}
				<spotLight position={[5, 10, 10]} angle={0.25} penumbra={1} intensity={8} />
				{/* Fill Light: Direct Frontal Flash to catch the Carbon texture */}
				<directionalLight position={[0, 0, 5]} intensity={5} color="#ffffff" />
				{/* Rim Light: Cool Blue from below/left */}
				<pointLight position={[-5, -5, 5]} intensity={3} color="#44aaff" />

				<Suspense fallback={null}>
					<PresentationControls
						global={false} // Only work when hovering the canvas
						cursor={true}
						snap={true} // Elastic snap-back
						speed={2} // Interaction speed
						zoom={1} // Disable zoom
						rotation={[0, 0, 0]}
						polar={[-Math.PI / 4, Math.PI / 4]} // Vertical limits
						azimuth={[-Math.PI / 4, Math.PI / 4]} // Horizontal limits
					>
						<Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
							<Model url="/assets/models/en_logo.glb" />
						</Float>
					</PresentationControls>
				</Suspense>
				<Environment preset="city" background={false} />
				{/* <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} /> */}
			</Canvas>
		</div>
	);
}
