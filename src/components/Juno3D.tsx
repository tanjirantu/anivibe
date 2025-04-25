"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.02;

function JunoModel() {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/juno.glb");

	useFrame((state, delta) => {
		if (group.current) {
			// Rotate the satellite
			group.current.rotation.y += delta * 0.3;
			// Add a slight floating motion
			group.current.position.y =
				Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
		}
	});

	return (
		<group
			ref={group}
			scale={[SCALE, SCALE, SCALE]}
			rotation={[Math.PI / 4, 0, 0]} // Tilt for better visibility
		>
			<primitive object={scene} />
		</group>
	);
}

export function Juno3D() {
	return (
		<div className="absolute top-[-30%] right-[27%] w-full h-full">
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
				<JunoModel />

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
