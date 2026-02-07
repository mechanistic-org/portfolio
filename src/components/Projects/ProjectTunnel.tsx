import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image, Text, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

interface Project {
	id: string;
	data: {
		title: string;
		heroImage?: string;
		description?: string;
	};
}

function ProjectCard({ project, z }: { project: Project; z: number; fadeDist: number }) {
	const ref = useRef<THREE.Group>(null);
	const image = project.data.heroImage || "/assets/placeholders/tech-1.jpg"; // Valid fallback

	useFrame(({ camera }) => {
		if (!ref.current) return;

		// Parallax / Opacity logic based on distance to camera
		const dist = ref.current.position.z - camera.position.z;

		// Simple visibility check
		// Allow seeing things behind camera slightly (-15) and further ahead (40)
		ref.current.visible = dist < 40 && dist > -15;
	});

	// Random X/Y placement to create "Tunnel" feel
	const [x, y] = useMemo(() => {
		const theta = Math.random() * Math.PI * 2;
		const r = 3 + Math.random() * 2; // Radius from center
		return [Math.cos(theta) * r, Math.sin(theta) * r];
	}, []);

	return (
		<group ref={ref} position={[x, y, z]}>
			<Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
				<Image url={image} scale={[4, 2.5]} transparent opacity={0.8} />
				<Text
					position={[0, -1.5, 0.1]}
					fontSize={0.3}
					font="/fonts/JetBrainsMono-Regular.ttf" // Ensure this font path is valid or use default
					anchorX="center"
					anchorY="middle"
					color="white"
				>
					{project.data.title.toUpperCase()}
				</Text>
			</Float>
		</group>
	);
}

function TunnelScene({ projects, scrollY }: { projects: Project[]; scrollY: number }) {
	useFrame(({ camera }) => {
		// Map scrollY [0...windowHeight] to Z position
		// We want to fly FORWARD (Negative Z usually, or we place items in Negative Z and move camera Negative)
		// Let's place items at -10, -20, -30...
		// And move camera from 0 to -100

		// 1000px scroll = 20 units of movement
		// Reduce speed factor from 0.05 to 0.02
		const targetZ = -(scrollY * 0.02);
		camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
	});

	return (
		<group>
			<Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
			{projects.map((project, i) => (
				<ProjectCard
					key={project.id}
					project={project}
					z={-10 - i * 8} // Space them out every 8 units
					fadeDist={20}
				/>
			))}
		</group>
	);
}

export default function ProjectTunnel({ projects }: { projects: Project[] }) {
	const containerRef = useRef<HTMLDivElement>(null);

	const [scrollY, setScrollY] = React.useState(0);

	React.useEffect(() => {
		const container = document.getElementById("hyperspace-container");
		if (!container) return;

		const handleScroll = () => {
			// Calculate relative scroll for Realm II
			// We want movement to start slightly before we hit the section for smoother entry
			const sectionTop = window.innerHeight; // Assuming Realm II starts at 100vh
			const currentScroll = container.scrollTop;

			// Offset relative to the start of Realm II
			const offset = currentScroll - sectionTop;

			// Allow moving as we approach (start updating when within 1.5 screens)
			if (offset > -window.innerHeight * 1.5 && offset < window.innerHeight * 2) {
				// Add 500 to offset so it starts moving before we fully arrive
				setScrollY(offset + 500);
			}
		};
		container.addEventListener("scroll", handleScroll, { passive: true });
		return () => container.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div ref={containerRef} className="h-full w-full">
			<Canvas camera={{ position: [0, 0, 0], fov: 60 }}>
				<ambientLight intensity={0.5} />
				<fog attach="fog" args={["#171717", 5, 30]} />
				<TunnelScene projects={projects} scrollY={scrollY} />
			</Canvas>

			{/* HTML Overlay for context */}
			<div className="pointer-events-none absolute bottom-10 left-10">
				<h2 className="text-4xl font-bold text-white/20">WORK_TUNNEL</h2>
			</div>
		</div>
	);
}
