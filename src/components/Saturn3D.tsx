"use client";

import React from "react";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Saturn3DProps {
	speed?: number;
	scale?: number;
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
}

const SCALE = 0.006;

function SaturnModel({
	speed = 1,
	hyperjumpProgress = 0,
}: {
	speed?: number;
	hyperjumpProgress?: number;
}) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/saturn_v1.1.glb");

	// Initial positions
	// const initialX = -12;
	// const initialZ = 0;

	useFrame((state, delta) => {
		if (group.current) {
			// Rotate the planet
			group.current.rotation.y += delta * speed * 0.2;
			// Move outward during hyperjump (reversed)
			group.current.position.x = 0 - 12 * (1 - hyperjumpProgress); // Move from outward to initial
			group.current.position.z = 0 - 18 * (1 - hyperjumpProgress); // Move from outward to initial
			// Move Saturn out of the screen as the animation ends
			group.current.position.x = 0 - 24 * hyperjumpProgress;
			group.current.position.z = 0 - 10 * hyperjumpProgress;
		}
	});

	return (
		<group
			ref={group}
			scale={[SCALE, SCALE, SCALE]}
			rotation={[Math.PI / 8, 0, 3]} // Add 30-degree rotation around X-axis
		>
			<primitive object={scene} />
		</group>
	);
}

export function Saturn3D({
	speed = 1,
	scale = 1,
	// hyperjumping = false,
	hyperjumpProgress = 0,
}: Saturn3DProps) {
	// Hide Saturn during hyperjump
	if (hyperjumpProgress > 0.2) {
		return null;
	}

	// Fade out effect during start of hyperjump
	const opacity = hyperjumpProgress > 0 ? 1 - hyperjumpProgress / 0.2 : 1;

	return (
		<div
			className="absolute top-[30%] right-[15%] w-full h-full"
			style={{
				transform: `scale(${scale})`,
				opacity,
			}}
		>
			<Canvas
				camera={{ position: [0, 0, 5], fov: 70 }}
				// style={{ background: "transparent" }}
			>
				{/* Ambient light for general illumination */}
				<ambientLight intensity={0.75} />

				{/* Main directional light */}
				<directionalLight
					position={[5, 5, 5]}
					intensity={1}
					color="#ffffff"
				/>

				{/* Accent light for planet glow */}
				<pointLight
					position={[0, 0, 0]}
					intensity={1}
					color="#ffcc00"
					distance={5}
				/>

				{/* Saturn model */}
				<SaturnModel
					speed={speed}
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
