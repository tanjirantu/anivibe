"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.3;

interface CometProps {
	speed?: number;
	scale?: number;
	trail?: boolean;
	delay?: number;
}

// Helper for lerp
function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

// Create a simple particle system for the comet trail
function CometTrail({ scale = 1 }) {
	const particles = useMemo(() => {
		// Create a few small particles for the trail
		const geometry = new THREE.SphereGeometry(0.1, 8, 8);
		const material = new THREE.MeshBasicMaterial({
			color: new THREE.Color(0xff8800),
			transparent: true,
			opacity: 0.7,
		});

		return Array.from({ length: 6 }).map((_, i) => {
			const particle = new THREE.Mesh(geometry, material.clone());
			// Random position behind the comet
			particle.position.set(
				-1 - Math.random() * 2,
				(Math.random() - 0.5) * 0.5,
				(Math.random() - 0.5) * 0.5
			);
			// Random scale
			const particleScale = 0.1 + Math.random() * 0.3;
			particle.scale.set(particleScale, particleScale, particleScale);
			// Random opacity
			particle.material.opacity = 0.3 + Math.random() * 0.4;
			// Random color variation
			const hue = 0.05 + Math.random() * 0.1; // Orange to yellow range
			const saturation = 0.7 + Math.random() * 0.3;
			const lightness = 0.5 + Math.random() * 0.5;
			particle.material.color.setHSL(hue, saturation, lightness);

			return particle;
		});
	}, []);

	// Animation for particles
	useFrame((state, delta) => {
		particles.forEach((particle) => {
			// Fade out particles
			particle.material.opacity -= delta * 0.5;
			if (particle.material.opacity < 0.1) {
				// Reset particle
				particle.position.set(
					-1 - Math.random() * 2,
					(Math.random() - 0.5) * 0.5,
					(Math.random() - 0.5) * 0.5
				);
				particle.material.opacity = 0.3 + Math.random() * 0.4;
			}
		});
	});

	return (
		<group scale={[scale, scale, scale]}>
			{particles.map((particle, i) => (
				<primitive key={i} object={particle} />
			))}
		</group>
	);
}

// This component is designed to be used inside an existing Canvas
export function SingleComet3D({
	speed = 1,
	scale = 1,
	trail = true,
	delay = 0,
}: CometProps) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/little_comet.glb");

	// Animation progress
	const progress = useRef(-delay); // Start negative to delay animation
	const animationComplete = useRef(false);

	// Clone the scene to manipulate materials for the trail effect
	const clonedScene = React.useMemo(() => {
		const clone = scene.clone();
		if (trail) {
			clone.traverse((node) => {
				if (node instanceof THREE.Mesh) {
					// Add flame-like glow effect to the comet
					node.material = new THREE.MeshStandardMaterial({
						emissive: new THREE.Color(0xff7700), // Orange-red flame color
						emissiveIntensity: 2.5,
						color: new THREE.Color(0xffcc00), // Yellow-orange base color
					});
				}
			});
		}
		return clone;
	}, [scene, trail]);

	// Animate the comet
	useFrame((state, delta) => {
		if (group.current) {
			// Rotate the comet for animation effect
			group.current.rotation.z += delta * speed * 0.5;
			group.current.rotation.x += delta * speed * 0.3;

			// Only animate if not completed yet
			if (!animationComplete.current) {
				// Update progress based on speed
				progress.current += delta * 0.2 * speed;

				// Don't start animation until delay is complete
				if (progress.current < 0) {
					// Hide comet during delay
					group.current.visible = false;
					return;
				} else {
					group.current.visible = true;
				}

				// Linear animation path for comets
				if (progress.current <= 1.0) {
					// Calculate position based on linear path from right to left
					// Start off-screen on the right (positive X)
					const startX = 100;
					const endX = -100;

					// Small arc from top-right to bottom-left
					const startY = 35; // Start higher
					const endY = 15; // End lower

					// Z position (depth)
					const startZ = -50;
					const endZ = -10;

					// Calculate current position based on progress
					const x = lerp(startX, endX, progress.current);

					// Add a slight downward arc (non-linear)
					// High at the start, lower at the end with subtle curve
					const t = progress.current;
					const y =
						startY -
						(startY - endY) * t -
						10 * Math.sin(t * Math.PI);

					// Move slightly closer to camera as it progresses
					const z = lerp(startZ, endZ, progress.current);

					// Set position
					group.current.position.set(x, y, z);

					// Adjust rotation to face the direction of travel
					group.current.rotation.y = Math.PI * 0.25; // 45 degrees

					// Handle opacity (fade in at start, fade out at end)
					const opacity =
						progress.current < 0.1
							? lerp(0, 1, progress.current / 0.1) // Fade in during first 10%
							: progress.current > 0.9
							? lerp(1, 0, (progress.current - 0.9) / 0.1) // Fade out during last 10%
							: 1;

					// Apply opacity
					group.current.traverse((node) => {
						if (node instanceof THREE.Mesh) {
							node.material.opacity = opacity;
							node.material.transparent = true;
						}
					});

					// Reset when animation completes
					if (progress.current >= 1.0) {
						progress.current = 0;
					}
				}
			}
		}
	});

	return (
		<group
			ref={group}
			scale={[scale * SCALE, scale * SCALE, scale * SCALE]}
		>
			<primitive object={clonedScene} />

			{/* Flame lighting effects */}
			{trail && (
				<>
					{/* Main flame core light */}
					<pointLight
						color="#ff5500" // Flame orange color
						intensity={4}
						distance={5}
						decay={1.5}
						position={[0, 0, -0.5]}
					/>

					{/* Secondary yellow glow */}
					<pointLight
						color="#ffcc00" // Yellow glow
						intensity={2}
						distance={3}
						decay={2}
						position={[0, 0, -0.2]}
					/>

					{/* Smaller red hot core */}
					<pointLight
						color="#ff2200" // Hot red
						intensity={2.5}
						distance={1.5}
						decay={2.5}
						position={[0, 0, 0]}
					/>

					{/* Particle trail effect */}
					<CometTrail scale={scale} />
				</>
			)}
		</group>
	);
}

// Preload the model
useGLTF.preload("/models/little_comet.glb");
