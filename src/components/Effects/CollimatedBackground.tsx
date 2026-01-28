import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Starfield from "./Starfield";

export default function CollimatedBackground() {
	return (
		<div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen bg-transparent">
			<Canvas
				camera={{ position: [0, 0, 1] }}
				gl={{ alpha: true }}
				style={{ background: "transparent" }}
			>
				<Suspense fallback={null}>
					<Starfield />
				</Suspense>
			</Canvas>
		</div>
	);
}
