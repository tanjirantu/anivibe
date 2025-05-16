"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Asteroid {
	id: number;
	x: number;
	y: number;
	z: number; // Add z-coordinate for 3D space
	size: number;
	speed: number;
	rotation: number;
	rotationSpeed: number;
	// Add new rotation properties
	rotationAxis: "x" | "y" | "z";
	rotationVariation: number;
	rotationPhase: number;
	opacity: number;
	zIndex: number;
	// Add new properties for random movement
	targetX: number;
	targetY: number;
	targetZ: number; // Add target z-coordinate
	moveSpeed: number;
	zigzag: boolean;
	zigzagDirection: number;
	zigzagAmplitude: number;
	zigzagFrequency: number;
	// Store perspective values for rendering
	perspectiveScale: number;
	perspectiveOpacity: number;
	// Add new properties for dynamic behavior
	movementPattern: "normal" | "spiral" | "wave" | "orbit";
	patternPhase: number;
	patternSpeed: number;
	patternRadius: number;
	// Add fly away properties
	isFlyingAway: boolean;
	flyAwayDirection: { x: number; y: number; z: number };
	flyAwaySpeed: number;
	flyAwayStartTime: number;
}

interface FloatingAsteroidsProps {
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
}

export function FloatingAsteroids({
	hyperjumping = false,
	hyperjumpProgress = 0,
}: FloatingAsteroidsProps) {
	const [asteroids, setAsteroids] = useState<Asteroid[]>([]);

	useEffect(() => {
		// Create initial asteroids with fly away properties
		const initialAsteroids: Asteroid[] = Array.from(
			{ length: 15 },
			(_, i) => ({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				z: Math.random() * 100,
				size: Math.random() * 10 + 5,
				speed: Math.random() * 0.05 + 0.02,
				rotation: Math.random() * 360,
				rotationSpeed: Math.random() * 0.02 + 0.01,
				rotationAxis: ["x", "y", "z"][Math.floor(Math.random() * 3)] as
					| "x"
					| "y"
					| "z",
				rotationVariation: Math.random() * 0.01 + 0.005,
				rotationPhase: Math.random() * Math.PI * 2,
				opacity: Math.random() * 0.5 + 0.3,
				zIndex: Math.floor(Math.random() * 3),
				targetX: Math.random() * 100,
				targetY: Math.random() * 100,
				targetZ: Math.random() * 100,
				moveSpeed: Math.random() * 0.08 + 0.02,
				zigzag: Math.random() > 0.5,
				zigzagDirection: Math.random() * Math.PI * 2,
				zigzagAmplitude: Math.random() * 10 + 5,
				zigzagFrequency: Math.random() * 0.005 + 0.002,
				perspectiveScale: 0.5,
				perspectiveOpacity: 0.3,
				movementPattern: ["normal", "spiral", "wave", "orbit"][
					Math.floor(Math.random() * 4)
				] as unknown as "normal" | "spiral" | "wave" | "orbit",
				patternPhase: Math.random() * Math.PI * 2,
				patternSpeed: Math.random() * 0.02 + 0.01,
				patternRadius: Math.random() * 20 + 10,
				isFlyingAway: false,
				flyAwayDirection: { x: 0, y: 0, z: 0 },
				flyAwaySpeed: 0,
				flyAwayStartTime: 0,
			})
		);

		setAsteroids(initialAsteroids);

		// Function to trigger fly away for a random asteroid
		const triggerFlyAway = () => {
			setAsteroids((prevAsteroids) => {
				const nonFlyingAsteroids = prevAsteroids.filter(
					(a) => !a.isFlyingAway
				);
				if (nonFlyingAsteroids.length === 0) return prevAsteroids;

				const randomIndex = Math.floor(
					Math.random() * nonFlyingAsteroids.length
				);
				const asteroidToFly = nonFlyingAsteroids[randomIndex];

				// Calculate random direction vector
				const direction = {
					x: Math.random() * 2 - 1,
					y: Math.random() * 2 - 1,
					z: Math.random() * 2 - 1,
				};

				// Normalize direction vector
				const length = Math.sqrt(
					direction.x * direction.x +
						direction.y * direction.y +
						direction.z * direction.z
				);
				direction.x /= length;
				direction.y /= length;
				direction.z /= length;

				return prevAsteroids.map((asteroid) =>
					asteroid.id === asteroidToFly.id
						? {
								...asteroid,
								isFlyingAway: true,
								flyAwayDirection: direction,
								flyAwaySpeed: Math.random() * 0.5 + 0.2,
								flyAwayStartTime: Date.now(),
						  }
						: asteroid
				);
			});
		};

		// Set up random fly away triggers
		const flyAwayInterval = setInterval(() => {
			if (Math.random() < 0.1) {
				// 10% chance every interval
				triggerFlyAway();
			}
		}, 5000); // Check every 5 seconds

		// Enhanced animation loop with fly away behavior
		const animate = () => {
			setAsteroids((prevAsteroids) =>
				prevAsteroids.map((asteroid) => {
					let newX = asteroid.x;
					let newY = asteroid.y;
					let newZ = asteroid.z;

					// Handle fly away behavior
					if (asteroid.isFlyingAway) {
						const elapsedTime =
							(Date.now() - asteroid.flyAwayStartTime) / 1000; // Convert to seconds
						const flyAwayProgress = Math.min(elapsedTime / 2, 1); // 2 seconds duration

						// Calculate new position based on fly away direction
						newX +=
							asteroid.flyAwayDirection.x *
							asteroid.flyAwaySpeed *
							50;
						newY +=
							asteroid.flyAwayDirection.y *
							asteroid.flyAwaySpeed *
							50;
						newZ +=
							asteroid.flyAwayDirection.z *
							asteroid.flyAwaySpeed *
							100;

						// Update scale and opacity for fly away effect
						const flyAwayScale = 1 + flyAwayProgress * 2;
						const flyAwayOpacity = 1 - flyAwayProgress;

						return {
							...asteroid,
							x: newX,
							y: newY,
							z: newZ,
							perspectiveScale: flyAwayScale,
							perspectiveOpacity: flyAwayOpacity,
							rotation:
								asteroid.rotation + asteroid.rotationSpeed * 2, // Faster rotation during fly away
						};
					}

					// Normal movement behavior for non-flying asteroids
					const newPhase =
						asteroid.patternPhase + asteroid.patternSpeed;
					const time = Date.now() * 0.001;
					const rotationVariation =
						Math.sin(time + asteroid.rotationPhase) *
						asteroid.rotationVariation;
					const newRotation =
						asteroid.rotation +
						(asteroid.rotationSpeed + rotationVariation);

					// Apply movement pattern
					switch (asteroid.movementPattern) {
						case "spiral":
							newX +=
								Math.cos(newPhase) *
								asteroid.patternRadius *
								0.1;
							newY +=
								Math.sin(newPhase) *
								asteroid.patternRadius *
								0.1;
							newZ +=
								Math.cos(newPhase * 0.5) *
								asteroid.patternRadius *
								0.05;
							break;
						case "wave":
							newX +=
								Math.sin(newPhase) *
								asteroid.patternRadius *
								0.1;
							newY +=
								Math.cos(newPhase * 0.5) *
								asteroid.patternRadius *
								0.1;
							newZ +=
								Math.sin(newPhase * 0.3) *
								asteroid.patternRadius *
								0.05;
							break;
						case "orbit":
							const centerX = 50;
							const centerY = 50;
							const orbitRadius = asteroid.patternRadius;
							newX = centerX + Math.cos(newPhase) * orbitRadius;
							newY = centerY + Math.sin(newPhase) * orbitRadius;
							newZ += Math.sin(newPhase * 0.5) * 5;
							break;
						default:
							// Normal movement with target
							if (
								Math.abs(asteroid.x - asteroid.targetX) < 1 &&
								Math.abs(asteroid.y - asteroid.targetY) < 1 &&
								Math.abs(asteroid.z - asteroid.targetZ) < 1
							) {
								asteroid.targetX = Math.random() * 100;
								asteroid.targetY = Math.random() * 100;
								asteroid.targetZ = Math.random() * 100;
							}

							const dx = asteroid.targetX - asteroid.x;
							const dy = asteroid.targetY - asteroid.y;
							const dz = asteroid.targetZ - asteroid.z;
							const distance = Math.sqrt(
								dx * dx + dy * dy + dz * dz
							);

							if (distance > 0) {
								newX += (dx / distance) * asteroid.moveSpeed;
								newY += (dy / distance) * asteroid.moveSpeed;
								newZ += (dz / distance) * asteroid.moveSpeed;
							}
					}

					// Add zigzag movement if enabled
					if (asteroid.zigzag) {
						const time = Date.now() * asteroid.zigzagFrequency;
						const zigzagOffset =
							Math.sin(time) * asteroid.zigzagAmplitude;
						newX +=
							Math.cos(asteroid.zigzagDirection) * zigzagOffset;
						newY +=
							Math.sin(asteroid.zigzagDirection) * zigzagOffset;
						newZ += Math.cos(time) * zigzagOffset * 0.25;
					}

					// Hyperjump effect
					if (hyperjumping) {
						const hyperjumpFactor =
							Math.sin(hyperjumpProgress * Math.PI) * 2;
						newX += Math.cos(newPhase) * hyperjumpFactor * 5;
						newY += Math.sin(newPhase) * hyperjumpFactor * 5;
						newZ += hyperjumpFactor * 10;
					}

					// Keep within bounds
					newX = Math.max(0, Math.min(100, newX));
					newY = Math.max(0, Math.min(100, newY));
					newZ = Math.max(0, Math.min(100, newZ));

					// Calculate perspective scale and opacity with hyperjump effect
					const baseScale = 0.5 + (newZ / 100) * 0.5;
					const baseOpacity = 0.3 + (newZ / 100) * 0.5;
					const hyperjumpScale = hyperjumping
						? 1 + Math.sin(hyperjumpProgress * Math.PI) * 0.5
						: 1;
					const hyperjumpOpacity = hyperjumping
						? 1 - hyperjumpProgress * 0.5
						: 1;

					return {
						...asteroid,
						x: newX,
						y: newY,
						z: newZ,
						rotation: newRotation,
						patternPhase: newPhase,
						perspectiveScale: baseScale * hyperjumpScale,
						perspectiveOpacity: baseOpacity * hyperjumpOpacity,
					};
				})
			);
		};

		const interval = setInterval(animate, 100);
		return () => {
			clearInterval(interval);
			clearInterval(flyAwayInterval);
		};
	}, [hyperjumping, hyperjumpProgress]);

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none perspective-[1000px]">
			{asteroids.map((asteroid) => (
				<div
					key={asteroid.id}
					className="absolute transform-style-3d"
					style={{
						left: `${asteroid.x}%`,
						top: `${asteroid.y}%`,
						transform: `
							rotate${asteroid.rotationAxis}(${asteroid.rotation}deg)
							scale(${asteroid.perspectiveScale})
							translateZ(${asteroid.z}px)
						`,
						opacity: asteroid.perspectiveOpacity,
						zIndex: Math.floor(asteroid.z / 10),
						transition: asteroid.isFlyingAway
							? "transform 2s ease-out"
							: "transform 1s linear",
					}}
				>
					<Image
						src="/assets/asteriod-var-5.png"
						alt="Asteroid"
						width={asteroid.size}
						height={asteroid.size}
						className="object-contain"
					/>
				</div>
			))}
		</div>
	);
}
