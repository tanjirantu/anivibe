"use client";

import React from "react";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Sun3DProps {
	scale?: number;
	speed?: number;
}

const SCALE = 0.0005;

function SunModel({ scale = 1, speed = 1 }: Sun3DProps) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/sun.glb");

	useFrame((state, delta) => {
		if (group.current) {
			// Rotate the sun
			group.current.rotation.y += delta * speed * 0.2;
		}
	});

	return (
		<group
			ref={group}
			scale={[scale * SCALE, scale * SCALE, scale * SCALE]}
			rotation={[0, 0, 0]}
		>
			<primitive object={scene} />
		</group>
	);
}

export function Sun3D({ scale = 1, speed = 1 }: Sun3DProps) {
	return (
		<div
			className="absolute top-[-20%] right-[-35%] w-full h-full"
			style={{ transform: `scale(${scale})` }}
		>
			{/* Glow Effect */}
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="absolute w-[300px] h-[300px] rounded-full bg-yellow-500/30 blur-[100px] animate-sun-glow" />
				<div className="absolute w-[200px] h-[200px] rounded-full bg-orange-500/30 blur-[80px] animate-sun-glow-delayed" />
				<div className="absolute w-[150px] h-[150px] rounded-full bg-red-500/20 blur-[60px] animate-sun-glow-delayed-2" />
			</div>

			<Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
				{/* Ambient light for general illumination */}
				<ambientLight intensity={0.5} />

				{/* Main directional light for sunlight */}
				<directionalLight
					position={[5, 5, 5]}
					intensity={2}
					color="#ffcc00"
				/>

				{/* Point light for sun glow */}
				<pointLight
					position={[0, 0, 0]}
					intensity={5}
					color="#ffcc00"
					distance={10}
				/>

				{/* Sun model */}
				<SunModel scale={scale} speed={speed} />

				{/* Disable orbit controls for static display */}
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					enableRotate={false}
				/>
			</Canvas>

			{/* Sun Glow Animation */}
			<style jsx global>{`
				@keyframes sun-glow {
					0% {
						transform: scale(1);
						opacity: 0.4;
					}
					50% {
						transform: scale(1.2);
						opacity: 0.6;
					}
					100% {
						transform: scale(1);
						opacity: 0.4;
					}
				}
				.animate-sun-glow {
					animation: sun-glow 4s ease-in-out infinite;
				}
				.animate-sun-glow-delayed {
					animation: sun-glow 4s ease-in-out infinite;
					animation-delay: 1s;
				}
				.animate-sun-glow-delayed-2 {
					animation: sun-glow 4s ease-in-out infinite;
					animation-delay: 2s;
				}
			`}</style>
		</div>
	);
}
