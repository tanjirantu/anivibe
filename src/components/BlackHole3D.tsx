"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface BlackHole3DProps {
	position?: [number, number, number];
	scale?: number;
}

// Inner component that handles the actual 3D model
function BlackHoleModel({
	position = [0, 0, 0],
	scale = 0.5,
}: {
	position: [number, number, number];
	scale: number;
}) {
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
	useFrame((state) => {
		if (blackHoleRef.current) {
			// Rotate continuously
			blackHoleRef.current.rotation.y =
				state.clock.getElapsedTime() * 0.2;

			// Subtle pulsing effect
			const pulseFactor =
				1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
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
}

// Wrapper component that handles client-side rendering safely
const BlackHole3D: React.FC<BlackHole3DProps> = ({
	position = [30, 0, 0],
	scale = 0.5,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null; // Return null on server-side
	}

	return (
		<div className="absolute inset-0 w-full h-full">
			<Canvas
				camera={{ position: [0, 0, 50], fov: 60 }}
				style={{ background: "transparent" }}
			>
				<ambientLight intensity={0.5} />
				<directionalLight position={[10, 10, 10]} intensity={1} />
				<BlackHoleModel position={position} scale={scale} />
			</Canvas>
		</div>
	);
};

export default BlackHole3D;
