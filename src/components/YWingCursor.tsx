"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.4;

function YWingModel() {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/starwars_ywing_fighterbomber.glb");

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

export function YWingCursor() {
	return (
		<div className="w-full h-full">
			<Canvas
				camera={{ position: [0, 0, 5], fov: 70 }}
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

				{/* Y-Wing model */}
				<YWingModel />
			</Canvas>
		</div>
	);
}
