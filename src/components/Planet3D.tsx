"use client";

import React from "react";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.0008;

interface Planet3DProps {
	scale?: number;
}

function JupiterModel({ scale = 1 }: Planet3DProps) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/earth_nasa.glb");

	useFrame((state, delta) => {
		if (group.current) {
			// Rotate the planet
			group.current.rotation.y += delta * 0.2;
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

export function Planet3D({ scale = 1 }: Planet3DProps) {
	return (
		<div
			className="absolute top-[13%] left-[30%] w-full h-full animate-planet-glow"
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
				<JupiterModel scale={scale} />

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
