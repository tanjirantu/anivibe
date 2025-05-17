"use client";

import { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

const SCALE = 0.2;

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
			// camera.position.y = -1 - 1 * hyperjumpProgress; // Move up during zoom
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

function LuminarisModel({
	hyperjumpProgress = 0,
}: {
	hyperjumpProgress?: number;
}) {
	const group = useRef<THREE.Group | null>(null);
	const flameRef = useRef<THREE.Mesh | null>(null);
	// const trailRef = useRef<THREE.Mesh | null>(null);
	const { scene } = useGLTF("/models/luminaris_starship.glb");

	useFrame((state: { clock: THREE.Clock }) => {
		if (group.current) {
			// Bouncing effect
			const bounce = Math.sin(state.clock.elapsedTime * 1.5) * 0.5;

			// Automatic left-right movement during hyperjump
			const autoMovement = Math.sin(state.clock.elapsedTime * 0.4) * 8;

			// Create turbulence effect
			const turbulenceX =
				Math.sin(state.clock.elapsedTime * 2.7) * 0.3 +
				Math.sin(state.clock.elapsedTime * 4.6) * 0.2;
			const turbulenceY =
				Math.sin(state.clock.elapsedTime * 3.1) * 0.2 +
				Math.cos(state.clock.elapsedTime * 5.3) * 0.15;
			const turbulenceZ =
				Math.sin(state.clock.elapsedTime * 2.3) * 0.4 +
				Math.cos(state.clock.elapsedTime * 3.7) * 0.3;

			// Add random jitter
			const jitterAmount = 0.1;
			const jitterX = (Math.random() - 0.5) * jitterAmount;
			const jitterY = (Math.random() - 0.5) * jitterAmount;
			const jitterZ = (Math.random() - 0.5) * jitterAmount;

			// Calculate positions
			const xPosition = -1 + 1 * hyperjumpProgress;
			const mouseControlStrength = Math.min(hyperjumpProgress * 2, 1);
			const turbulenceStrength = Math.min(hyperjumpProgress * 3, 1.5);

			// Update position with lightspeed effect
			group.current.position.x =
				xPosition +
				autoMovement * mouseControlStrength +
				(turbulenceX + jitterX) * turbulenceStrength;
			group.current.position.y =
				-5 - // Start from lower position
				0 * hyperjumpProgress +
				bounce +
				(turbulenceY + jitterY) * turbulenceStrength;
			group.current.position.z =
				0 -
				50 * hyperjumpProgress + // Forward movement
				(turbulenceZ + jitterZ) * turbulenceStrength;

			// Update rotation with more dramatic effect during hyperjump
			group.current.rotation.z =
				-autoMovement * 0.01 * mouseControlStrength +
				turbulenceX * 0.03 * turbulenceStrength;
			group.current.rotation.x =
				0.2 + turbulenceY * 0.02 * turbulenceStrength;
			group.current.rotation.y =
				Math.PI + turbulenceZ * 0.02 * turbulenceStrength;

			// Scale effect during hyperjump
			const scale = 1 + hyperjumpProgress * 0.5;
			group.current.scale.set(
				SCALE * scale,
				SCALE * scale,
				SCALE * scale
			);
		}

		// Animate flame with enhanced effect during hyperjump
		// if (flameRef.current) {
		// 	const t = state.clock.getElapsedTime();
		// 	const scale = 0.7 + Math.sin(t * 20) * 0.15 + Math.random() * 0.05;
		// 	const hyperjumpScale = 1 + hyperjumpProgress * 2; // Increase flame size during hyperjump
		// 	flameRef.current.scale.set(
		// 		0.18 * scale * hyperjumpScale,
		// 		0.18 * scale * hyperjumpScale,
		// 		0.7 + Math.sin(t * 10) * 0.1
		// 	);
		// }

		// Animate speed trail during hyperjump
		// if (trailRef.current) {
		// 	const t = state.clock.getElapsedTime();
		// 	const trailScale = 1 + Math.sin(t * 10) * 0.2;
		// 	const trailLength =
		// 		hyperjumpProgress > 0 ? 2 + hyperjumpProgress * 5 : 0;
		// 	trailRef.current.scale.set(
		// 		0.5 * trailScale,
		// 		0.5 * trailScale,
		// 		trailLength
		// 	);
		// 	trailRef.current.material.opacity =
		// 		hyperjumpProgress > 0 ? 0.7 + Math.sin(t * 5) * 0.3 : 0;
		// }
	});

	return (
		<group
			ref={group}
			position={[0, 0, 0]}
			rotation={[0, Math.PI, 0]}
			scale={[SCALE, SCALE, SCALE]}
		>
			<primitive object={scene} />
			{/* Jet fuel burning effect */}
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
				/>
			</mesh>
			{/* Speed trail effect during hyperjump */}
			{/* <mesh ref={trailRef} position={[0, 0, -3]} rotation={[0, 0, 0]}>
				<coneGeometry args={[0.5, 2, 16, 1, true]} />
				<meshBasicMaterial
					color={"#00ffff"}
					opacity={0}
					transparent={true}
					depthWrite={false}
				/>
			</mesh> */}
		</group>
	);
}

export function LuminarisStarship({
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

				{/* Luminaris model */}
				<LuminarisModel hyperjumpProgress={hyperjumpProgress} />

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
