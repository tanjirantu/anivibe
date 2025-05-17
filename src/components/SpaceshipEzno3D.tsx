"use client";

import { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

const SCALE = 0.7;

interface LuminarisStarshipProps {
	speed?: number;
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
	mouseX?: number;
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
			camera.position.z = 15 - 0 * hyperjumpProgress; // More dramatic zoom
			// camera.position.y = -10 + 10 * hyperjumpProgress; // Move up during zoom
			camera.updateProjectionMatrix();
		} else {
			camera.position.z = 15;
			camera.position.y = 0;
			camera.updateProjectionMatrix();
		}
	});
	return null;
}

// Function to create asteroid rocks during hyperjump
function AsteroidField({ hyperjumping = false, hyperjumpProgress = 0 }) {
	// Reduce number of asteroids for better performance
	const count = 25;

	// Create reusable asteroid data with optimized structure
	const asteroids = useMemo(() => {
		const data = new Float32Array(count * 9); // x,y,z, scale, speed, rotX,rotY,rotZ, seed
		const colors = new Float32Array(count * 3); // r,g,b

		for (let i = 0; i < count; i++) {
			const baseIndex = i * 9;
			// Position
			data[baseIndex] = Math.random() * 100 - 50; // x
			data[baseIndex + 1] = Math.random() * 100 - 50; // y
			data[baseIndex + 2] = Math.random() * 200 - 300; // z
			// Scale and speed
			data[baseIndex + 3] = 0.2 + Math.random() * 0.8; // scale
			data[baseIndex + 4] = 1 + Math.random() * 4; // speed
			// Rotation
			data[baseIndex + 5] = Math.random() * Math.PI; // rotX
			data[baseIndex + 6] = Math.random() * Math.PI; // rotY
			data[baseIndex + 7] = Math.random() * Math.PI; // rotZ
			data[baseIndex + 8] = Math.random() * 100; // seed

			// Colors
			const colorIndex = i * 3;
			colors[colorIndex] = 0.3 + Math.random() * 0.2; // r
			colors[colorIndex + 1] = 0.3 + Math.random() * 0.2; // g
			colors[colorIndex + 2] = 0.3 + Math.random() * 0.2; // b
		}

		return { data, colors };
	}, []);

	// Optimize animation frame updates
	useFrame((state) => {
		if (!hyperjumping) return;

		const asteroidMeshes = state.scene.children.filter(
			(c) => c.userData.isAsteroid
		);

		// Batch update positions and rotations
		asteroidMeshes.forEach((mesh, i) => {
			if (!mesh) return;

			const baseIndex = i * 9;
			const speed = asteroids.data[baseIndex + 4];

			// Update position
			mesh.position.z += speed * hyperjumpProgress;

			// Update rotation using pre-calculated speeds
			mesh.rotation.x += 0.01;
			mesh.rotation.y += 0.01;
			mesh.rotation.z += 0.01;

			// Reset asteroid if it passed the camera
			if (mesh.position.z > 50) {
				mesh.position.set(
					asteroids.data[baseIndex],
					asteroids.data[baseIndex + 1],
					-300
				);
			}
		});
	});

	if (!hyperjumping || hyperjumpProgress < 0.2) return null;

	return (
		<>
			{Array.from({ length: count }).map((_, i) => {
				const baseIndex = i * 9;
				const colorIndex = i * 3;
				return (
					<mesh
						key={i}
						position={[
							asteroids.data[baseIndex],
							asteroids.data[baseIndex + 1],
							asteroids.data[baseIndex + 2],
						]}
						rotation={[
							asteroids.data[baseIndex + 5],
							asteroids.data[baseIndex + 6],
							asteroids.data[baseIndex + 7],
						]}
						scale={[
							asteroids.data[baseIndex + 3],
							asteroids.data[baseIndex + 3],
							asteroids.data[baseIndex + 3],
						]}
						userData={{ isAsteroid: true }}
					>
						<icosahedronGeometry args={[1, 0]} />
						<meshStandardMaterial
							color={
								new THREE.Color(
									asteroids.colors[colorIndex],
									asteroids.colors[colorIndex + 1],
									asteroids.colors[colorIndex + 2]
								)
							}
							roughness={0.9}
							metalness={0.1}
						/>
					</mesh>
				);
			})}
		</>
	);
}

function LuminarisModel({
	hyperjumpProgress = 0,
}: {
	hyperjumpProgress?: number;
}) {
	const group = useRef<THREE.Group | null>(null);

	const { scene } = useGLTF("/models/spaceship_ezno.glb");

	useFrame((state) => {
		if (group.current) {
			const t = state.clock.getElapsedTime();

			// Calculate base movement
			const bounce = Math.sin(t * 1.5) * 0.5;
			const autoMovement = Math.sin(t * 0.4) * 8;

			// Simplified turbulence calculation
			const turbulenceX = Math.sin(t * 2.7) * 0.3;
			const turbulenceY = Math.sin(t * 3.1) * 0.2;
			const turbulenceZ = Math.sin(t * 2.3) * 0.4;

			// Optimize position updates
			const mouseControlStrength = Math.min(hyperjumpProgress * 2, 1);
			const turbulenceStrength = Math.min(hyperjumpProgress * 3, 1.5);

			// Update position with optimized calculations
			group.current.position.x =
				autoMovement * mouseControlStrength +
				turbulenceX * turbulenceStrength;
			group.current.position.y =
				-5 + bounce + turbulenceY * turbulenceStrength;
			group.current.position.z =
				-50 * hyperjumpProgress + turbulenceZ * turbulenceStrength;

			// Simplified rotation updates
			group.current.rotation.z =
				-autoMovement * 0.01 * mouseControlStrength;
			group.current.rotation.x = 0.2 + turbulenceY * 0.02;
			group.current.rotation.y = Math.PI + turbulenceZ * 0.02;

			// Optimize scale updates
			const scale = 1 + hyperjumpProgress * 0.5;
			group.current.scale.setScalar(SCALE * scale);
		}
	});

	return (
		<group
			ref={group}
			position={[0, 0, 0]}
			rotation={[0, Math.PI, 0]}
			scale={[SCALE, SCALE, SCALE]}
		>
			<primitive object={scene} />
		</group>
	);
}

// Crew Dragon component for horizontal movement
// function CrewDragon() {
// 	const group = useRef<any>(null);
// 	const { scene } = useGLTF("/models/space_x_crew_dragon.glb");

// 	useFrame((state) => {
// 		if (group.current) {
// 			const t = state.clock.getElapsedTime();

// 			// Horizontal movement from left to right
// 			// Using sine wave for smooth back and forth movement
// 			const x = Math.sin(t * 0.2) * 30; // Reduced frequency from 0.5 to 0.2 for slower movement

// 			// Calculate movement direction
// 			const direction = Math.cos(t * 0.2); // Derivative of sin is cos

// 			// Update position
// 			group.current.position.x = x;

// 			// Rotate based on movement direction
// 			// When direction is positive (moving right), rotation is 0
// 			// When direction is negative (moving left), rotation is Math.PI (180 degrees)
// 			group.current.rotation.y = direction > 0 ? 0 : Math.PI;
// 		}
// 	});

// 	return (
// 		<group
// 			ref={group}
// 			position={[0, 5, -10]} // Moved back along z-axis to appear further away
// 			rotation={[0, 0, 0]}
// 			scale={[0.5, 0.5, 0.5]} // Keep the smaller scale
// 		>
// 			<primitive object={scene} />
// 		</group>
// 	);
// }

export function SpaceshipEzno3D({
	// speed = 1,
	hyperjumping = false,
	hyperjumpProgress = 0,
}: // mouseX = 0.5,
LuminarisStarshipProps) {
	return (
		<div className="absolute inset-0 w-full h-full">
			<Canvas
				camera={{
					position: [0, 0, 15],
					fov: 60,
					near: 0.1,
					far: 1000,
				}}
				style={{ background: "transparent" }}
			>
				{/* Camera zoom animation */}
				<CameraZoom
					hyperjumping={hyperjumping}
					hyperjumpProgress={hyperjumpProgress}
				/>

				{/* Ambient light for general illumination */}
				<ambientLight intensity={1.5} />

				{/* Main directional light for the starship */}
				<directionalLight
					position={[1, 5, 5]}
					intensity={5}
					color="#ffffff"
				/>

				{/* Accent lights for engine glow */}
				<pointLight
					position={[0, 2, 0]}
					intensity={4}
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

				{/* Luminaris model */}
				<LuminarisModel hyperjumpProgress={hyperjumpProgress} />

				{/* Add Crew Dragon */}
				{/* <CrewDragon /> */}

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
