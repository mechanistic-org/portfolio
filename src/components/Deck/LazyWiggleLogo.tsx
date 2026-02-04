import React, { Suspense } from "react";

// Dynamic Import to isolate Three.js dependencies from SSR build
const WiggleLogo3D = React.lazy(() => import("./WiggleLogo3D"));

export default function LazyWiggleLogo() {
	return (
		<Suspense fallback={null}>
			<WiggleLogo3D />
		</Suspense>
	);
}
