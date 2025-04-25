"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.006;

function SaturnModel() {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/saturn_v1.1.glb");

	useFrame((state, delta) => {
		if (group.current) {
			// Rotate the planet
			group.current.rotation.y += delta * 0.2;
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

export function Saturn3D() {
	return (
		<div className="absolute top-[30%] right-[15%] w-full h-full">
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
				<SaturnModel />

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
