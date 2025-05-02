"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
// import * as THREE from "three";
import React from "react";

const SCALE = 0.2;
// const FLY_SPEED = 0.0007;
// const START_Y = -5; // Start from bottom of screen
// const END_Y = 10; // End at top of screen
// const Z_SPEED = 0.09; // Speed of movement towards the viewer
// const MIN_Z = -20; // Minimum z position before reset

interface StarFighter3DProps {
	speed?: number;
	zooming?: boolean;
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
}

function StarFighterModel({
	// speed = 1,
	hyperjumpProgress = 0,
}: {
	speed?: number;
	hyperjumpProgress?: number;
}) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const group = useRef<any>(null);
	const { scene } = useGLTF("/models/spaceship_cb1.glb");

	// Jet fuel burning effect animation
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const flameRef = useRef<any>(null);
	useFrame((state) => {
		if (group.current) {
			// Bouncing effect
			const bounce = Math.sin(state.clock.elapsedTime * 1.5) * 0.5; // speed=1.5, amplitude=0.5
			// Move the starfighter from initial position to bottom during hyperjump, plus bounce
			group.current.position.x = -1 + 1 * hyperjumpProgress; // (or your current X logic)
			group.current.position.y = -5 - 0 * hyperjumpProgress + bounce;
			group.current.position.z = 0 - 50 * hyperjumpProgress; // Move toward camera during hyperjump
		}
		// Animate flame scale and opacity for burning effect
		if (flameRef.current) {
			const t = state.clock.getElapsedTime();
			const scale = 0.7 + Math.sin(t * 20) * 0.15 + Math.random() * 0.05;
			flameRef.current.scale.set(
				0.18 * scale,
				0.18 * scale,
				0.7 + Math.sin(t * 10) * 0.1
			);
			// const mat = flameRef.current.material as THREE.MeshBasicMaterial;
			// mat.opacity = 0.7 + Math.sin(t * 10) * 0.2;
		}
	});

	return (
		<group
			ref={group}
			position={[0, -5, 20]}
			rotation={[0.2, 1.6, 0]}
			scale={[SCALE, SCALE, SCALE]}
		>
			<primitive object={scene} />
			{/* Jet fuel burning effect (cone flame) */}
			<mesh
				ref={flameRef}
				position={[0, -0.2, -2]}
				rotation={[-Math.PI / 2, 0, 0]}
			>
				<coneGeometry args={[0.18, 0.7, 16, 1, true]} />
				<meshBasicMaterial
					color={"#fff7ae"}
					opacity={1}
					transparent={false}
					depthWrite={false}
				>
					{/* <primitive
						object={new THREE.TextureLoader().load(
							"/assets/flame_gradient.png"
						)}
						attach="map"
					/> */}
				</meshBasicMaterial>
			</mesh>
		</group>
	);
}

// Camera zoom animation component
function CameraZoom({
	hyperjumping = false,
	hyperjumpProgress = 0,
}: {
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
}) {
	const { camera } = useThree();
	useFrame(() => {
		// Zoom in during hyperjump
		if (hyperjumping) {
			camera.position.z = 15 - 0 * hyperjumpProgress; // Zoom in
			camera.updateProjectionMatrix();
		} else {
			camera.position.z = 15;
			camera.updateProjectionMatrix();
		}
	});
	return null;
}

export function StarFighter3D({
	speed = 1,
	// zooming = false,
	hyperjumping = false,
	hyperjumpProgress = 0,
}: StarFighter3DProps) {
	return (
		<div className="absolute inset-0 w-full h-full">
			<Canvas
				camera={{ position: [0, 0, 15], fov: 75 }}
				style={{ background: "transparent" }}
			>
				{/* Camera zoom animation */}
				<CameraZoom
					hyperjumping={hyperjumping}
					hyperjumpProgress={hyperjumpProgress}
				/>

				{/* Ambient light for general illumination */}
				<ambientLight intensity={1.5} />

				{/* Main directional light for the starfighter */}
				<directionalLight
					position={[1, 5, 5]}
					intensity={1}
					color="#ffffff"
				/>

				{/* Accent lights for engine glow */}
				<pointLight
					position={[0, 2, 0]}
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

				{/* Starfighter model */}
				<StarFighterModel
					speed={speed}
					hyperjumpProgress={hyperjumpProgress}
				/>

				{/* Disable orbit controls for the flying animation */}
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					enableRotate={false}
				/>
			</Canvas>
		</div>
	);
}
