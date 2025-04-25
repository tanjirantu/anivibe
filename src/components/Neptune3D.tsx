"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.0004;

function NeptuneModel() {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/neptune_nasa.glb");

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
			rotation={[Math.PI / 5, 0, 0]} // Slight tilt for better visibility
		>
			<primitive object={scene} />
		</group>
	);
}

export function Neptune3D() {
	return (
		<div className="absolute bottom-[32%] right-[40%] w-full h-full">
			<Canvas
				camera={{ position: [0, 0, 5], fov: 60 }}
				style={{ background: "transparent" }}
			>
				{/* Ambient light for general illumination */}
				<ambientLight intensity={1.5} />

				{/* Main directional light */}
				<directionalLight
					position={[5, 0, 0]}
					intensity={0.75}
					color="#ffffff"
				/>

				{/* Accent light for planet glow */}
				<pointLight
					position={[0, 0, 0]}
					intensity={1}
					color="#4b7bec"
					distance={5}
				/>

				{/* Neptune model */}
				<NeptuneModel />

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
