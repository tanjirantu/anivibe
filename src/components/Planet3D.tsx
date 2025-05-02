"use client";

import React from "react";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.0008;

interface Planet3DProps {
	scale?: number;
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
}

function JupiterModel({ scale = 1, hyperjumpProgress = 0 }: Planet3DProps) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/earth_nasa.glb");

	// Initial positions
	const initialX = 10;
	const initialZ = -5;

	useFrame((state, delta) => {
		if (group.current) {
			// Rotate the planet
			group.current.rotation.y += delta * 0.2;
			// Move outward during hyperjump
			group.current.position.x = initialX + 20 * (1 - hyperjumpProgress); // Move from outward to initial
			group.current.position.z = initialZ - 40 * (1 - hyperjumpProgress); // Move from outward to initial
		}
	});

	return (
		<group
			ref={group}
			scale={[scale * SCALE, scale * SCALE, scale * SCALE]}
		>
			<primitive object={scene} />
		</group>
	);
}

export function Planet3D({
	scale = 1,
	// hyperjumping = false,
	hyperjumpProgress = 0,
}: Planet3DProps) {
	return (
		<div
			className="absolute top-[-20%] right-[40%] w-full h-full animate-planet-glow"
			style={{ transform: `scale(${scale})` }}
		>
			<Canvas
				camera={{ position: [0, 0, 5], fov: 75 }}
				style={{ background: "transparent" }}
			>
				{/* Ambient light for general illumination */}
				<ambientLight intensity={3} />

				{/* Main directional light */}
				<directionalLight
					position={[0, 0, 5]}
					intensity={2}
					color="#ffffff"
				/>

				{/* Accent light for planet glow */}
				<pointLight
					position={[0, 0, 5]}
					intensity={1}
					color="#ffcc00"
					distance={2}
				/>

				{/* Jupiter model */}
				<JupiterModel
					scale={scale}
					hyperjumpProgress={hyperjumpProgress}
				/>

				{/* Disable orbit controls for static display */}
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					enableRotate={false}
				/>
			</Canvas>
		</div>
	);
}
