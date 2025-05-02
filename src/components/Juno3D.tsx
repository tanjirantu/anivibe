"use client";

import React from "react";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.02;

interface Juno3DProps {
	scale?: number;
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
	speed?: number;
}

function JunoModel({
	scale = 1,
	hyperjumpProgress = 0,
	speed = 1,
}: Juno3DProps) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/juno.glb");

	// Initial positions
	// const initialX = 8;
	// const initialZ = 0;

	useFrame((state, delta) => {
		if (group.current) {
			// // Rotate the satellite
			// group.current.rotation.y += delta * 0.3;
			// // Add a slight floating motion
			// group.current.position.y =
			// 	Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
			// // Move outward during hyperjump (reversed)
			// group.current.position.x = 0 + 8 * (1 - hyperjumpProgress); // Move from outward to initial
			// group.current.position.z = 2 - 100 * (1 - hyperjumpProgress); // Move from outward to initial
			// Rotate the planet
			group.current.rotation.y += delta * speed * 0.3;
			// Move outward during hyperjump (reversed)
			group.current.position.x = 0 + 8 * (1 - hyperjumpProgress); // Move from outward to initial
			group.current.position.z = 0 - 15 * (1 - hyperjumpProgress); // Move from outward to initial
			// Move Saturn out of the screen as the animation ends
			group.current.position.x = 5 - 10 * hyperjumpProgress;
			group.current.position.z = 0 - 10 * hyperjumpProgress;
		}
	});

	return (
		<group
			ref={group}
			scale={[scale * SCALE, scale * SCALE, scale * SCALE]}
			rotation={[Math.PI / 4, 0, 0]} // Tilt for better visibility
		>
			<primitive object={scene} />
		</group>
	);
}

export function Juno3D({
	scale = 1,
	// hyperjumping = false,
	hyperjumpProgress = 0,
}: Juno3DProps) {
	return (
		<div
			className="absolute top-[-30%] right-[27%] w-full h-full"
			style={{ transform: `scale(${scale})` }}
		>
			<Canvas
				camera={{ position: [0, 0, 5], fov: 60 }}
				style={{ background: "transparent" }}
			>
				{/* Ambient light for general illumination */}
				<ambientLight intensity={1.5} />

				{/* Main directional light */}
				<directionalLight
					position={[5, 5, 5]}
					intensity={0.75}
					color="#ffffff"
				/>

				{/* Accent light for satellite glow */}
				<pointLight
					position={[0, 0, 0]}
					intensity={1}
					color="#00ffff"
					distance={5}
				/>

				{/* Juno model */}
				<JunoModel
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
