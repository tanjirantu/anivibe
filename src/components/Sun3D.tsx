"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Sun3DProps {
	scale?: number;
	speed?: number;
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
}

const SCALE = 0.002;

function SunModel({ scale = 1, speed = 1 }: Sun3DProps) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/sun.glb");

	// Center the model and adjust any offsets
	useEffect(() => {
		if (scene) {
			// Center the geometry
			if (scene.children.length > 0) {
				// Create a bounding box to calculate the center
				const box = new THREE.Box3().setFromObject(scene);
				const center = box.getCenter(new THREE.Vector3());

				// Move the scene to center
				scene.position.x = -center.x;
				scene.position.y = -center.y;
				scene.position.z = -center.z;
			}
		}
	}, [scene]);

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
			position={[0, 0, 0]} // Centered position
		>
			<primitive object={scene} />
		</group>
	);
}

export function Sun3D({
	scale = 1,
	speed = 1,
	// hyperjumping = false,
	hyperjumpProgress = 0,
}: Sun3DProps) {
	// Hide the sun during hyperjump
	if (hyperjumpProgress > 0.2) {
		return null;
	}

	// Fade out effect during start of hyperjump
	const opacity = hyperjumpProgress > 0 ? 1 - hyperjumpProgress / 0.2 : 1;

	return (
		<div
			className="absolute top-[5%] left-[75%]"
			style={{
				width: "300px",
				height: "300px",
				opacity,
				zIndex: 15,
				position: "relative",
			}}
		>
			{/* Glow effects positioned below the sun */}
			<div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
				<div className="absolute w-[400px] h-[400px] rounded-full bg-yellow-500/30 blur-[150px] animate-sun-glow" />
				<div className="absolute w-[300px] h-[300px] rounded-full bg-orange-500/30 blur-[120px] animate-sun-glow-delayed" />
				<div className="absolute w-[200px] h-[200px] rounded-full bg-red-500/20 blur-[90px] animate-sun-glow-delayed-2" />
			</div>

			{/* Simple Canvas for the 3D sun model - on top of the glow */}
			<div className="absolute inset-0 z-20">
				<Canvas
					camera={{ position: [0, 0, 10], fov: 40 }}
					style={{ background: "transparent" }}
				>
					{/* Basic lighting */}
					<ambientLight intensity={1.0} />
					<directionalLight
						position={[5, 5, 5]}
						intensity={2}
						color="#ffffff"
					/>

					{/* Just render the sun model */}
					<SunModel scale={scale} speed={speed} />

					<OrbitControls
						enableZoom={false}
						enablePan={false}
						enableRotate={false}
					/>
				</Canvas>
			</div>

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
