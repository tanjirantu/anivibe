"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import React from "react";

const SCALE = 1.5;
const FLY_SPEED = 0.0007;
const START_Y = -5; // Start from bottom of screen
const END_Y = 10; // End at top of screen
const Z_SPEED = 0.09; // Speed of movement towards the viewer
const MIN_Z = -20; // Minimum z position before reset

interface StarFighter3DProps {
	speed?: number;
	zooming?: boolean;
}

function StarFighterModel({ speed = 1, zooming = false }: StarFighter3DProps) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/mandalorian_n1.glb");

	// Jet fuel burning effect animation
	const flameRef = useRef<THREE.Mesh>(null);
	useFrame((state) => {
		if (group.current) {
			// Move the starfighter from bottom to top
			group.current.position.y += FLY_SPEED * speed;
			// Move towards the viewer (negative z)
			group.current.position.z -= Z_SPEED * speed;
			// Reset position when it reaches the top or gets too close
			if (
				group.current.position.y > END_Y ||
				group.current.position.z < MIN_Z
			) {
				group.current.position.y = START_Y;
				group.current.position.z = 20; // Start from the end of the screen
			}
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
			const mat = flameRef.current.material as THREE.MeshBasicMaterial;
			mat.opacity = 0.7 + Math.sin(t * 10) * 0.2;
		}
	});

	return (
		<group
			ref={group}
			position={[0, START_Y, 20]} // Start from bottom and end of screen
			rotation={[0, 0, 0]} // Face towards the viewer
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
					color={"#fff7ae"} // yellow-white core
					opacity={0.85}
					transparent
					depthWrite={false}
				>
					<primitive
						object={new THREE.TextureLoader().load(
							"/assets/flame_gradient.png"
						)}
						attach="map"
					/>
				</meshBasicMaterial>
			</mesh>
		</group>
	);
}

// Camera zoom animation component
function CameraZoom({ zooming }: { zooming: boolean }) {
	const { camera, clock } = useThree();
	const startTime = React.useRef<number | null>(null);
	useFrame(() => {
		if (zooming) {
			if (startTime.current === null)
				startTime.current = clock.getElapsedTime();
			const elapsed = clock.getElapsedTime() - (startTime.current ?? 0);
			const t = Math.min(elapsed / 1, 1); // 1 second duration
			camera.position.z = 15 - 13 * t;
			camera.updateProjectionMatrix();
		} else {
			startTime.current = null;
			camera.position.z = 15;
			camera.updateProjectionMatrix();
		}
	});
	return null;
}

export function StarFighter3D({
	speed = 1,
	zooming = false,
}: StarFighter3DProps) {
	return (
		<div className="absolute inset-0 w-full h-full">
			<Canvas
				camera={{ position: [0, 0, 15], fov: 75 }}
				style={{ background: "transparent" }}
			>
				{/* Camera zoom animation */}
				<CameraZoom zooming={zooming} />

				{/* Ambient light for general illumination */}
				<ambientLight intensity={1.5} />

				{/* Main directional light for the starfighter */}
				<directionalLight
					position={[5, 5, 5]}
					intensity={1}
					color="#ffffff"
				/>

				{/* Accent lights for engine glow */}
				<pointLight
					position={[0, -2, 0]}
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
				<StarFighterModel speed={speed} zooming={zooming} />

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
