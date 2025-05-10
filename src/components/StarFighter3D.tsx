"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
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
	mouseX?: number; // Add mouse X position to control starfighter during hyperjump
}

// Function to create asteroid rocks during hyperjump
function AsteroidField({ hyperjumping = false, hyperjumpProgress = 0 }) {
	// Number of asteroids in the field
	const count = 40;

	// Create reusable asteroid data
	const asteroids = useMemo(() => {
		return Array.from({ length: count }).map(() => {
			// Create random positions spread in space
			// Keep z position far away so they start outside view
			return {
				position: [
					Math.random() * 100 - 50, // x: -50 to 50
					Math.random() * 100 - 50, // y: -50 to 50
					Math.random() * 200 - 300, // z: -300 to -100 (behind camera)
				] as [number, number, number],
				scale: 0.2 + Math.random() * 0.8, // Size variation
				speed: 1 + Math.random() * 4, // Speed variation
				rotation: [
					Math.random() * Math.PI,
					Math.random() * Math.PI,
					Math.random() * Math.PI,
				] as [number, number, number],
				rotationSpeed: [
					Math.random() * 0.02 - 0.01,
					Math.random() * 0.02 - 0.01,
					Math.random() * 0.02 - 0.01,
				] as [number, number, number],
				color: new THREE.Color(
					0.3 + Math.random() * 0.2,
					0.3 + Math.random() * 0.2,
					0.3 + Math.random() * 0.2
				), // Gray/brown variations
				seed: Math.random() * 100, // Unique seed for each asteroid's "shape"
			};
		});
	}, [count]);

	// Animation of asteroids
	useFrame((state) => {
		// Only animate if hyperjumping
		if (!hyperjumping) return;

		// Get all asteroid meshes
		const asteroidMeshes = state.scene.children.filter(
			(c) => c.userData.isAsteroid
		);

		// Update each asteroid
		asteroidMeshes.forEach((mesh, i) => {
			if (!mesh) return;

			const data = asteroids[i];
			if (!data) return;

			// Move asteroid toward camera (positive z)
			mesh.position.z += data.speed * hyperjumpProgress;

			// Rotate asteroid
			mesh.rotation.x += data.rotationSpeed[0];
			mesh.rotation.y += data.rotationSpeed[1];
			mesh.rotation.z += data.rotationSpeed[2];

			// Reset asteroid if it passed the camera
			if (mesh.position.z > 50) {
				mesh.position.set(
					Math.random() * 100 - 50,
					Math.random() * 100 - 50,
					-300
				);
			}
		});
	});

	// Don't render if not hyperjumping or in early stages
	if (!hyperjumping || hyperjumpProgress < 0.2) return null;

	return (
		<>
			{asteroids.map((data, i) => (
				<mesh
					key={i}
					position={data.position}
					rotation={data.rotation}
					scale={[data.scale, data.scale, data.scale]}
					userData={{ isAsteroid: true }}
				>
					<icosahedronGeometry args={[1, 0]} />{" "}
					{/* Simple rock shape */}
					<meshStandardMaterial
						color={data.color}
						roughness={0.9}
						metalness={0.1}
					/>
				</mesh>
			))}
		</>
	);
}

function StarFighterModel({
	// speed = 1,
	hyperjumpProgress = 0,
	mouseX = 0.5, // Default to center
}: {
	speed?: number;
	hyperjumpProgress?: number;
	mouseX?: number;
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

			// Automatic left-right movement during hyperjump (slow oscillation)
			// Use a different frequency than the bounce to create more interesting motion
			const autoMovement = Math.sin(state.clock.elapsedTime * 0.4) * 8; // 0.4 = slow frequency, 8 = wide range

			// Create turbulence effect on all axes - multiple sine waves at different frequencies and small amplitudes
			const turbulenceX =
				Math.sin(state.clock.elapsedTime * 2.7) * 0.3 +
				Math.sin(state.clock.elapsedTime * 4.6) * 0.2;

			const turbulenceY =
				Math.sin(state.clock.elapsedTime * 3.1) * 0.2 +
				Math.cos(state.clock.elapsedTime * 5.3) * 0.15;

			const turbulenceZ =
				Math.sin(state.clock.elapsedTime * 2.3) * 0.4 +
				Math.cos(state.clock.elapsedTime * 3.7) * 0.3;

			// Add some random jitter for more realistic turbulence
			const jitterAmount = 0.1;
			const jitterX = (Math.random() - 0.5) * jitterAmount;
			const jitterY = (Math.random() - 0.5) * jitterAmount;
			const jitterZ = (Math.random() - 0.5) * jitterAmount;

			// Calculate X position based on mouse when hyperjumping
			// Map mouseX from 0-1 to -8 to 8 for movement range
			const mouseXOffset = (mouseX - 0.5) * 16;

			// Move the starfighter from initial position to bottom during hyperjump, plus bounce
			// Apply mouseX control during hyperjump, increasing effect as hyperjump progresses
			const xPosition = -1 + 1 * hyperjumpProgress;
			const mouseControlStrength = Math.min(hyperjumpProgress * 2, 1); // Gradually increase mouse control

			// Increase turbulence strength as hyperjump progresses
			const turbulenceStrength = Math.min(hyperjumpProgress * 3, 1.5);

			// Use automatic movement instead of mouse control
			group.current.position.x =
				xPosition +
				autoMovement * mouseControlStrength +
				(turbulenceX + jitterX) * turbulenceStrength;
			group.current.position.y =
				-5 -
				0 * hyperjumpProgress +
				bounce +
				(turbulenceY + jitterY) * turbulenceStrength;
			group.current.position.z =
				0 -
				50 * hyperjumpProgress +
				(turbulenceZ + jitterZ) * turbulenceStrength; // Move toward camera during hyperjump

			// Add slight rotation based on auto movement for banking effect
			group.current.rotation.z =
				-autoMovement * 0.01 * mouseControlStrength +
				turbulenceX * 0.03 * turbulenceStrength;
			// Add slight pitch and yaw turbulence
			group.current.rotation.x =
				0.2 + turbulenceY * 0.02 * turbulenceStrength;
			group.current.rotation.y =
				1.6 + turbulenceZ * 0.02 * turbulenceStrength;
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
	mouseX = 0.5, // Default to center
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

				{/* Asteroid field during hyperjump */}
				<AsteroidField
					hyperjumping={hyperjumping}
					hyperjumpProgress={hyperjumpProgress}
				/>

				{/* Starfighter model */}
				<StarFighterModel
					speed={speed}
					hyperjumpProgress={hyperjumpProgress}
					mouseX={mouseX}
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
