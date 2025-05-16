"use client";

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";

function SpaceEffectModel({
	hyperjumping,
	hyperjumpProgress = 0,
}: {
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
}) {
	const { scene } = useGLTF("/models/need_some_space.glb");
	const meshRef = useRef<THREE.Group>(null);

	useFrame(() => {
		if (!meshRef.current) return;

		if (hyperjumping) {
			// Only animate during hyperjump
			const scale = 1 + hyperjumpProgress * 0.5;
			meshRef.current.scale.set(scale, scale, scale);
			meshRef.current.position.z = hyperjumpProgress * 2.5;
		}
	});

	return (
		<primitive
			ref={meshRef}
			object={scene}
			scale={[10, 10, -20]}
			position={[10, 0, -60]}
			rotation={[0, 0, -10]}
		/>
	);
}

interface SpaceEffect3DProps {
	visible: boolean;
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
}

export function SpaceEffect3D({
	visible,
	hyperjumping,
	hyperjumpProgress,
}: SpaceEffect3DProps) {
	if (!visible) return null;

	return (
		<div className="absolute inset-0 w-full h-full">
			<Canvas camera={{ position: [0, 0, 0], fov: 60 }}>
				<ambientLight intensity={2} />
				<SpaceEffectModel
					hyperjumping={hyperjumping}
					hyperjumpProgress={hyperjumpProgress}
				/>
			</Canvas>
		</div>
	);
}
