import  { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random";
import * as THREE from "three";

const colorPalette = ["#ffddcc", "#ccddff", "#ffffff", "#ffeebb"]; // Warm/Cool whites

export default function Starfield(props: any) {
	const ref = useRef<any>(null);
	const ref2 = useRef<any>(null); // Second layer for depth

	// Layer 1: Background Dust (Faint, numerous)
	const [sphere] = useState(() => random.inSphere(new Float32Array(6000 * 3), { radius: 1200 }));

	// Layer 2: Bright Stars (Fewer, larger, colored)
	const [brightSphere] = useState(() =>
		random.inSphere(new Float32Array(800 * 3), { radius: 900 }),
	);

	// Color buffer for bright stars
	const [colors] = useState(() => {
		const data = new Float32Array(800 * 3);
		for (let i = 0; i < 800; i++) {
			const color = new THREE.Color(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
			color.toArray(data, i * 3);
		}
		return data;
	});

	useFrame((state, delta) => {
		// Parallax & Drift Logic
		const { mouse } = state;
		const x = mouse.x * 0.05; // Dampened for "heaviness"
		const y = mouse.y * 0.05;

		if (ref.current) {
			ref.current.rotation.x -= delta / 200;
			ref.current.rotation.y -= delta / 300;
			ref.current.rotation.x += y * 0.0005;
			ref.current.rotation.y += x * 0.0005;
		}

		if (ref2.current) {
			// Second layer moves slightly faster for parallax depth
			ref2.current.rotation.x -= delta / 150;
			ref2.current.rotation.y -= delta / 250;
			ref2.current.rotation.x += y * 0.001;
			ref2.current.rotation.y += x * 0.001;
		}
	});

	return (
		<group rotation={[0, 0, Math.PI / 4]}>
			{/* Layer 1: Stardust */}
			<Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
				<PointMaterial
					transparent
					color="#888888" // Dimmer
					size={1.5}
					sizeAttenuation={true}
					depthWrite={false}
					opacity={0.6}
				/>
			</Points>

			{/* Layer 2: Bright Stars */}
			<Points ref={ref2} positions={brightSphere} stride={3} frustumCulled={false} {...props}>
				<PointMaterial
					transparent
					vertexColors
					size={2.5}
					sizeAttenuation={true}
					depthWrite={false}
					opacity={0.9}
				/>
				{/* Inject Colors */}
				<bufferAttribute
					attach="geometry-attributes-color"
					count={colors.length / 3}
					args={[colors, 3]}
				/>
			</Points>
		</group>
	);
}
