"use client";

import React from "react";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface BlackHole3DProps {
	scale?: number;
	speed?: number;
}

const SCALE = 0.08;

function BlackHoleModel({ scale = 1, speed = 1 }: BlackHole3DProps) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/blackhole_02.glb");

	useFrame((state, delta) => {
		if (group.current) {
			// Rotate the blackhole
			group.current.rotation.y += delta * speed * 0.5;
		}
	});

	return (
		<group
			ref={group}
			scale={[scale * SCALE, scale * SCALE, scale * SCALE]}
			rotation={[Math.PI / 5, 2, 0]} // Tilt for better visibility
		>
			<primitive object={scene} />
		</group>
	);
}

export function BlackHole3D({ scale = 1, speed = 1 }: BlackHole3DProps) {
	return (
		<div
			className="absolute top-[10%] left-[20%] w-full h-full"
			style={{ transform: `scale(${scale})` }}
		>
			{/* Glow Effect */}
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="absolute w-[200px] h-[200px] rounded-full bg-purple-500/20 blur-[50px] animate-pulse-glow" />
				<div className="absolute w-[150px] h-[150px] rounded-full bg-purple-600/20 blur-[40px] animate-pulse-glow-delayed" />
			</div>

			<Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
				{/* Ambient light for general illumination */}
				<ambientLight intensity={0.5} />

				{/* Main directional light */}
				<directionalLight
					position={[5, 5, 5]}
					intensity={1}
					color="#ffffff"
				/>

				{/* Accent light for blackhole glow */}
				<pointLight
					position={[0, 0, 0]}
					intensity={3}
					color="#ff00ff"
					distance={5}
				/>

				{/* Blackhole model */}
				<BlackHoleModel scale={scale} speed={speed} />

				{/* Disable orbit controls for static display */}
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					enableRotate={false}
				/>
			</Canvas>

			{/* Glow Animation */}
			<style jsx global>{`
				@keyframes pulse-glow {
					0% {
						transform: scale(1);
						opacity: 0.3;
					}
					50% {
						transform: scale(1.2);
						opacity: 0.6;
					}
					100% {
						transform: scale(1);
						opacity: 0.3;
					}
				}
				.animate-pulse-glow {
					animation: pulse-glow 3s ease-in-out infinite;
				}
				.animate-pulse-glow-delayed {
					animation: pulse-glow 3s ease-in-out infinite;
					animation-delay: 1.5s;
				}
			`}</style>
		</div>
	);
}
