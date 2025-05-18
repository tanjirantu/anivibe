"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface StarFighter3DProps {
	x: number; // screen x in px
	y: number; // screen y in px
	rotation?: number; // radians
	visible?: boolean;
	targetX?: number; // alien ship x position
	targetY?: number; // alien ship y position
}

const scale = 2;

function NabooStarfighterModel({ rotation = 0 }: { rotation?: number }) {
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [retryCount, setRetryCount] = useState(0);

	const { scene } = useGLTF("/models/astronaut_floating_in_space.glb", true);

	const group = useRef<THREE.Group>(null);

	useEffect(() => {
		if (scene) {
			setIsLoading(false);
			setError(null);
		} else if (retryCount < 3) {
			// Retry loading after a delay
			const timer = setTimeout(() => {
				setRetryCount((prev) => prev + 1);
			}, 2000);
			return () => clearTimeout(timer);
		} else {
			setError(new Error("Failed to load model after multiple attempts"));
		}
	}, [scene, retryCount]);

	useFrame(() => {
		if (group.current) {
			group.current.rotation.z = rotation;
		}
	});

	if (error) {
		return (
			<mesh>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="red" />
			</mesh>
		);
	}

	if (isLoading) {
		return (
			<mesh>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="gray" />
			</mesh>
		);
	}

	return (
		<group
			ref={group}
			rotation={[0, Math.PI, rotation]}
			scale={[scale, scale, scale]}
		>
			<primitive object={scene} />
		</group>
	);
}

// Moving ship component with animation
function MovingShip({
	posX,
	posY,
	rotation,
}: {
	posX: number;
	posY: number;
	rotation: number;
	targetX?: number;
	targetY?: number;
}) {
	const shipRef = useRef<THREE.Group>(null);
	const [isFiring, setIsFiring] = useState(false);
	const [, setShipPosition] = useState(new THREE.Vector3(posX, posY, -100));

	// Add turbulence effect values
	const turbulenceRef = useRef({
		xOffset: 0,
		yOffset: 0,
		xFrequency: 0.5 + Math.random() * 0.7, // Increased frequency range
		yFrequency: 0.5 + Math.random() * 0.7,
		xAmplitude: 2.0, // Increased amplitude
		yAmplitude: 2.0,
	});

	// Add wave animation parameters
	const waveRef = useRef({
		amplitude: 25 + Math.random() * 15, // Increased wave height range (25-40)
		frequency: 0.3 + Math.random() * 0.2, // Adjusted frequency range for smoother waves
		phase: Math.random() * Math.PI * 2, // Random starting point
		verticalOffset: Math.random() * 15, // Increased random y offset
	});

	// Animation is now properly inside the Canvas context
	useFrame(({ clock }) => {
		if (shipRef.current) {
			// Calculate the base time in a loop (resets every 18 seconds)
			const loopTime = 18; // seconds for a full cycle - slightly longer cycle
			const cycleTime = clock.getElapsedTime() % loopTime;
			const normalizedTime = cycleTime / loopTime; // 0 to 1

			// Move from far away (-120) to closer and past center (60) - extended range
			const zPos = -120 + normalizedTime * 180; // -120 to 60

			// Apply turbulence effect
			const { xFrequency, yFrequency, xAmplitude, yAmplitude } =
				turbulenceRef.current;
			const xTurbulence =
				Math.sin(clock.getElapsedTime() * xFrequency) * xAmplitude +
				Math.sin(clock.getElapsedTime() * xFrequency * 1.5) *
					(xAmplitude * 0.5); // Added harmonics
			const yTurbulence =
				Math.cos(clock.getElapsedTime() * yFrequency) * yAmplitude +
				Math.cos(clock.getElapsedTime() * yFrequency * 1.3) *
					(yAmplitude * 0.3); // Added harmonics

			// Apply wave motion
			const { amplitude, frequency, phase, verticalOffset } =
				waveRef.current;
			const waveY =
				amplitude *
					Math.sin(normalizedTime * Math.PI * 2 * frequency + phase) +
				verticalOffset;

			// Wave rotation (ship tilts up/down based on wave direction)
			const waveDerivative =
				amplitude *
				Math.cos(normalizedTime * Math.PI * 2 * frequency + phase) *
				frequency *
				Math.PI *
				2;
			const pitchAngle = -Math.atan(waveDerivative / 50) * 0.7; // Increased banking effect

			// Apply position with turbulence and wave
			shipRef.current.position.set(
				posX + xTurbulence,
				posY + yTurbulence + waveY,
				zPos
			);

			// Apply rotations - banking for side motion, pitch for vertical motion
			const bankAmount = xTurbulence * 0.08; // Increased banking intensity
			shipRef.current.rotation.set(
				pitchAngle, // X rotation (pitch)
				bankAmount, // Y rotation (yaw/banking)
				rotation + Math.PI / 8 // Z rotation (roll - from prop)
			);

			// Update ship position for laser origin
			setShipPosition(
				new THREE.Vector3(
					posX + xTurbulence,
					posY + yTurbulence + waveY,
					zPos
				)
			);

			// Fire laser when reaching certain position range
			const firingZoneStart = -50;
			const firingZoneEnd = -10;

			if (zPos > firingZoneStart && zPos < firingZoneEnd && !isFiring) {
				setIsFiring(true);
				// Auto-reset firing state after 0.8 seconds
				setTimeout(() => setIsFiring(false), 800);
			}

			// Reset parameters when starting a new cycle
			if (normalizedTime < 0.05) {
				turbulenceRef.current = {
					xOffset: 0,
					yOffset: 0,
					xFrequency: 0.5 + Math.random() * 0.7,
					yFrequency: 0.5 + Math.random() * 0.7,
					xAmplitude: 2.0,
					yAmplitude: 2.0,
				};

				waveRef.current = {
					amplitude: 25 + Math.random() * 15, // 25-40 range
					frequency: 0.3 + Math.random() * 0.2,
					phase: Math.random() * Math.PI * 2,
					verticalOffset: (Math.random() - 0.5) * 30, // -15 to 15 range
				};
			}
		}
	});

	return (
		<>
			<group
				ref={shipRef}
				position={[posX, posY, -100]}
				rotation={[0, 0, rotation + Math.PI / 8]}
			>
				<NabooStarfighterModel rotation={15} />
			</group>

			{/* Laser beam */}
			{/* {isFiring && <LaserBeam from={shipPosition} to={targetPosition} />} */}
		</>
	);
}

const StarFighter: React.FC<StarFighter3DProps> = ({
	x,
	y,
	rotation = 0,
	visible = true,
	targetX,
	targetY,
}) => {
	// Initialize state here to ensure hooks are always called in the same order
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		// Update window dimensions only on client side
		const handleResize = () => {
			if (typeof window !== "undefined") {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}
		};

		// Initial size
		handleResize();

		// Add event listener (only in browser)
		if (typeof window !== "undefined") {
			window.addEventListener("resize", handleResize);
			// Cleanup
			return () => window.removeEventListener("resize", handleResize);
		}
	}, []);

	// If not visible, return null
	if (!visible) return null;

	// Don't render during SSR
	if (typeof window === "undefined") return null;

	// Convert screen x/y to Three.js coordinates (centered)
	const posX = x - windowSize.width / 2;
	const posY = -(y - windowSize.height / 2);

	// Convert target coordinates
	const targetPosX = targetX ? targetX - windowSize.width / 2 : undefined;
	const targetPosY = targetY ? -(targetY - windowSize.height / 2) : undefined;

	return (
		<div
			style={{
				position: "fixed",
				left: 0,
				top: 0,
				width: "100vw",
				height: "100vh",
				pointerEvents: "none",
				zIndex: 32,
			}}
		>
			<Canvas
				style={{
					width: "100vw",
					height: "100vh",
					background: "transparent",
					pointerEvents: "none",
				}}
				camera={{ position: [-30, 30, 0], fov: 60 }}
			>
				<ambientLight intensity={0.5} />
				<directionalLight
					position={[-50, 0, 50]}
					intensity={5}
					color="#fff"
				/>
				<MovingShip
					posX={posX}
					posY={posY}
					rotation={rotation}
					targetX={targetPosX}
					targetY={targetPosY}
				/>
			</Canvas>
		</div>
	);
};

export default StarFighter;
