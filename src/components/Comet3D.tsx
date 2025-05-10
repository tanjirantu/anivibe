"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.3;

interface Comet3DProps {
	position: [number, number, number];
	scale?: number;
	rotation?: [number, number, number];
	speed?: number;
	trail?: boolean;
}

function CometModel({
	position,
	scale = 1,
	rotation = [0, 0, 0],
	speed = 1,
	trail = true,
}: Comet3DProps) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/little_comet.glb");

	// Clone the scene to manipulate materials for the trail effect
	const clonedScene = React.useMemo(() => {
		const clone = scene.clone();
		if (trail) {
			clone.traverse((node) => {
				if (node instanceof THREE.Mesh) {
					// Add glow effect to the comet
					node.material = new THREE.MeshStandardMaterial({
						emissive: new THREE.Color(0x88ccff),
						emissiveIntensity: 2,
						color: new THREE.Color(0xffffff),
					});
				}
			});
		}
		return clone;
	}, [scene, trail]);

	// Animate the comet
	useFrame((state, delta) => {
		if (group.current) {
			// Rotate the comet for animation effect
			group.current.rotation.z += delta * speed * 0.5;
			group.current.rotation.x += delta * speed * 0.3;
		}
	});

	return (
		<group
			ref={group}
			position={position}
			scale={[scale * SCALE, scale * SCALE, scale * SCALE]}
			rotation={rotation}
		>
			<primitive object={clonedScene} />

			{/* Optional trail effect */}
			{trail && (
				<pointLight
					color="#88ccff"
					intensity={3}
					distance={5}
					decay={2}
					position={[0, 0, -0.5]}
				/>
			)}
		</group>
	);
}

export function Comet3D({
	position = [0, 0, 0],
	scale = 1,
	rotation,
	speed = 1,
	trail = true,
}: Comet3DProps) {
	return (
		<CometModel
			position={position}
			scale={scale}
			rotation={rotation}
			speed={speed}
			trail={trail}
		/>
	);
}

// Preload the model
useGLTF.preload("/models/little_comet.glb");
