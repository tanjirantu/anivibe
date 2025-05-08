import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BlackHoleProps {
	position?: [number, number, number];
	scale?: number;
}

const BlackHole: React.FC<BlackHoleProps> = ({
	position = [30, 0, 0],
	scale = 0.5,
}) => {
	const { scene } = useGLTF("/models/blackhole_02.glb");
	const blackHoleRef = useRef<THREE.Group>(null);

	// Set up black hole materials and effects
	useEffect(() => {
		if (!scene) return;

		scene.traverse((child: any) => {
			if (child.isMesh) {
				// Enhance materials for better visual effect
				if (child.material) {
					// Make it slightly transparent for better blending
					child.material.transparent = true;

					// If it's the event horizon or core, make it dark with subtle glow
					if (
						child.name.includes("horizon") ||
						child.name.includes("core")
					) {
						child.material.emissive = new THREE.Color(0x000000);
						child.material.emissiveIntensity = 1;
					}

					// If it's the accretion disk, make it glow with blue/purple hue
					if (
						child.name.includes("disk") ||
						child.name.includes("accretion")
					) {
						child.material.emissive = new THREE.Color(0x0088ff);
						child.material.emissiveIntensity = 2;
					}
				}
			}
		});
	}, [scene]);

	// Animate the black hole
	useFrame(({ clock }) => {
		if (blackHoleRef.current) {
			// Rotate continuously
			blackHoleRef.current.rotation.y = clock.getElapsedTime() * 0.2;

			// Subtle pulsing effect
			const pulseFactor =
				1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
			const currentScale = scale * pulseFactor;
			blackHoleRef.current.scale.set(
				currentScale,
				currentScale,
				currentScale
			);
		}
	});

	return (
		<group ref={blackHoleRef} position={position}>
			<primitive object={scene} />
		</group>
	);
};

export default BlackHole;
