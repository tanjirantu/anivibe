"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.45;

function XWingModel() {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/starfighter_x_wing.glb");

	return (
		<group
			ref={group}
			scale={[SCALE, SCALE, SCALE]}
			rotation={[Math.PI / 14, 0.05, 0]} // Rotate to face forward
		>
			<primitive object={scene} />
		</group>
	);
}

export function XWingCursor() {
	return (
		<div className="w-16 h-16">
			<Canvas
				camera={{ position: [0, 0, 5], fov: 50 }}
				style={{ background: "transparent" }}
			>
				{/* Ambient light for general illumination */}
				<ambientLight intensity={1.5} />

				{/* Main directional light */}
				<directionalLight
					position={[5, 5, 5]}
					intensity={5}
					color="#ffffff"
				/>

				{/* Accent lights for engine glow */}
				<pointLight
					position={[0, -2, 0]}
					intensity={4}
					color="#00ffff"
					distance={5}
				/>
				<pointLight
					position={[0, -2, 0]}
					intensity={1}
					color="#ffffff"
					distance={3}
				/>

				{/* X-Wing model */}
				<XWingModel />
			</Canvas>
		</div>
	);
}
