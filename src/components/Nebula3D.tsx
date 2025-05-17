"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

const NEBULA_MODELS = [
	{
		name: "Photosphere",
		path: "/models/nebula_space_hdri_background_photosphere.glb",
		scale: [2, 2, 2],
		position: [0, 0, 0],
		rotation: [0, 0, 0],
	},
	{
		name: "Skydome 1",
		path: "/models/space_nebula_hdri_panorama_360_skydome.glb",
		scale: [0.01, 0.01, 0.01],
		position: [0, 0, 0],
		rotation: [0, 0, 0],
	},
	{
		name: "Skydome 2",
		path: "/models/space_nebula_hdri_panorama_360_skydome_2.glb",
		scale: [5, 5, 5],
		position: [0, 0, 0],
		rotation: [0, 0, 0],
	},
];

function NebulaModel({
	modelIndex,
	hyperjumping,
	hyperjumpProgress = 0,
}: {
	modelIndex: number;
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
}) {
	const { scene } = useGLTF(NEBULA_MODELS[modelIndex].path);
	const model = NEBULA_MODELS[modelIndex];
	const meshRef = useRef<THREE.Group>(null);

	useFrame((state, delta) => {
		if (!meshRef.current) return;

		if (hyperjumping) {
			if (modelIndex === 1) {
				// Skydome 1 animation - smoother acceleration
				const rotationSpeed = 0.1 + hyperjumpProgress * 0.1; // Start slower, accelerate more gradually
				meshRef.current.rotation.y += delta * rotationSpeed;
				const scale = 0.5 + hyperjumpProgress * 0.5;
				meshRef.current.scale.set(scale, scale * 1, scale);
				meshRef.current.position.z = hyperjumpProgress * 3;
			} else if (modelIndex === 2) {
				// Skydome 2 animation - smoother acceleration
				const rotationSpeed = 0.1 + hyperjumpProgress * 0.4; // Start slower, accelerate more gradually
				meshRef.current.rotation.y += delta * rotationSpeed;
				// Maintain the large scale but add a slight zoom effect
				const scale = 5 + hyperjumpProgress * 2;
				meshRef.current.scale.set(scale, scale, scale);
				// Move forward more dramatically
				meshRef.current.position.z = hyperjumpProgress * 2.5;
			}
		} else {
			// Normal slow rotation when not hyperjumping
			meshRef.current.rotation.y += delta * 0.05;
		}
	});

	return (
		<primitive
			ref={meshRef}
			object={scene}
			scale={model.scale}
			position={model.position}
			rotation={model.rotation}
		/>
	);
}

interface Nebula3DProps {
	visible: boolean;
	modelIndex: number;
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
}

export function Nebula3D({
	visible,
	modelIndex,
	hyperjumping,
	hyperjumpProgress,
}: Nebula3DProps) {
	if (!visible) return null;

	return (
		<div className="absolute inset-0 w-full h-full">
			<Canvas camera={{ position: [0, 0, 5], fov: 95 }}>
				<ambientLight intensity={1} />
				<NebulaModel
					modelIndex={modelIndex}
					hyperjumping={hyperjumping}
					hyperjumpProgress={hyperjumpProgress}
				/>
				<Environment preset="night" />
			</Canvas>
		</div>
	);
}
