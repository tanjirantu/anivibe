"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.0008;

function JupiterModel() {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/earth_nasa.glb");

	useFrame((state, delta) => {
		if (group.current) {
			// Rotate the planet
			group.current.rotation.y += delta * 0.2;
		}
	});

	return (
		<group ref={group} scale={[SCALE, SCALE, SCALE]}>
			<primitive object={scene} />
		</group>
	);
}

export function Planet3D() {
	return (
		<div className="absolute top-[13%] left-[30%] w-full h-full animate-planet-glow">
			<Canvas
				camera={{ position: [0, 0, 5], fov: 90 }}
				style={{ background: "transparent" }}
			>
				{/* Ambient light for general illumination */}
				<ambientLight intensity={5} />

				{/* Main directional light */}
				<directionalLight
					position={[5, 5, 5]}
					intensity={1}
					color="#ffffff"
				/>

				{/* Accent light for planet glow */}
				<pointLight
					position={[0, 0, 0]}
					intensity={2}
					color="#ffcc00"
					distance={5}
				/>

				{/* Jupiter model */}
				<JupiterModel />

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
