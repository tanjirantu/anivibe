"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import React from "react";

const SCALE = 0.8;
const FLY_SPEED = 0.0007;
const START_Y = -5; // Start from bottom of screen
const END_Y = 10; // End at top of screen
const Z_SPEED = 0.09; // Speed of movement towards the viewer
const MIN_Z = -20; // Minimum z position before reset

interface StarFighter3DProps {
	speed?: number;
}

function StarFighterModel({ speed = 1 }: StarFighter3DProps) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/tie_fighter_low-poly.glb");

	useFrame(() => {
		if (group.current) {
			// Move the starfighter from bottom to top
			group.current.position.y += FLY_SPEED * speed;

			// Move towards the viewer (negative z)
			group.current.position.z -= Z_SPEED * speed;

			// Reset position when it reaches the top or gets too close
			if (
				group.current.position.y > END_Y ||
				group.current.position.z < MIN_Z
			) {
				group.current.position.y = START_Y;
				group.current.position.z = 20; // Start from the end of the screen
			}
		}
	});

	return (
		<group
			ref={group}
			position={[0, START_Y, 20]} // Start from bottom and end of screen
			rotation={[0, 0, 0]} // Face towards the viewer
			scale={[SCALE, SCALE, SCALE]}
		>
			<primitive object={scene} />
		</group>
	);
}

export function StarFighter3D({ speed = 1 }: StarFighter3DProps) {
	return (
		<div className="absolute inset-0 w-full h-full">
			<Canvas
				camera={{ position: [0, 0, 15], fov: 75 }}
				style={{ background: "transparent" }}
			>
				{/* Ambient light for general illumination */}
				<ambientLight intensity={1.5} />

				{/* Main directional light for the starfighter */}
				<directionalLight
					position={[5, 5, 5]}
					intensity={1}
					color="#ffffff"
				/>

				{/* Accent lights for engine glow */}
				<pointLight
					position={[0, -2, 0]}
					intensity={2}
					color="#00ffff"
					distance={5}
				/>
				<pointLight
					position={[0, -2, 0]}
					intensity={1}
					color="#ffffff"
					distance={3}
				/>

				{/* Starfighter model */}
				<StarFighterModel speed={speed} />

				{/* Disable orbit controls for the flying animation */}
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					enableRotate={false}
				/>
			</Canvas>
		</div>
	);
}
