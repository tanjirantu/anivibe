"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";

const SCALE = 0.0085;

interface Planet3DProps {
	scale?: number;
	hyperjumping?: boolean;
	hyperjumpProgress?: number;
}

// Alien Ship component that will orbit around the planet
function AlienShip() {
	const shipRef = useRef<HTMLDivElement>(null);
	const [lightBeamActive, setLightBeamActive] = useState(true);
	const lightBeamIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const [orbitAngle, setOrbitAngle] = useState(0);

	useEffect(() => {
		// Setup light beam pulsing effect
		lightBeamIntervalRef.current = setInterval(() => {
			setLightBeamActive((prev) => !prev);
		}, 2000);

		// Setup the continuous orbiting animation
		const orbitAnimation = () => {
			setOrbitAngle((prev) => (prev + 0.5) % 360);
			requestAnimationFrame(orbitAnimation);
		};
		const animationId = requestAnimationFrame(orbitAnimation);

		return () => {
			if (lightBeamIntervalRef.current) {
				clearInterval(lightBeamIntervalRef.current);
			}
			cancelAnimationFrame(animationId);
		};
	}, []);

	// Calculate the position on a circular orbit around the planet center
	const orbitRadius = 120;
	const angleRad = (orbitAngle * Math.PI) / 180;

	// Using standard parametric equations for a circle
	const x = orbitRadius * Math.cos(angleRad);
	const y = orbitRadius * Math.sin(angleRad) * 0.4; // Flatten the y-axis for perspective

	// Determine if the ship is in front of or behind the planet
	const isInFront = Math.sin(angleRad) < 0;
	const zIndex = isInFront ? 20 : 0;

	// Scale based on vertical position to simulate depth
	const distanceScale = 0.5 + (Math.sin(angleRad) + 1) * 0.25; // 0.5-1.0 scale range

	return (
		<div
			ref={shipRef}
			className="absolute w-[48px] h-[48px]"
			style={{
				transform: `translate(${x}px, ${y}px) scale(${distanceScale})`,
				transformOrigin: "center center",
				zIndex,
				transition: "transform 0.05s linear",
			}}
		>
			{/* UFO Light Beam Effect - only show when in front half of orbit */}
			{lightBeamActive && isInFront && (
				<div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-[16px] h-[120px] bg-gradient-to-b from-[#57eaff] to-transparent opacity-15"></div>
			)}

			{/* UFO Glow Effect */}
			<div className="absolute inset-0 rounded-full bg-[#57eaff]/20 blur-[5px] animate-pulse"></div>

			<Image
				src="/assets/alien_ship.png"
				alt="Alien Ship"
				width={48}
				height={48}
				className="w-full h-full object-contain"
			/>
		</div>
	);
}

// Glowing Moon component
function GlowingMoon() {
	const moonRef = useRef<HTMLDivElement>(null);

	// Fixed position relative to the Earth - top right
	const x = 50; // Positive value moves right
	const y = -40; // Negative value moves up

	// Moon is significantly smaller than Earth (about 27% of Earth's diameter)
	const moonSize = 27; // Size in pixels, Earth is typically around 100px in this scene

	return (
		<div
			ref={moonRef}
			className="absolute"
			style={{
				width: `${moonSize}px`,
				height: `${moonSize}px`,
				transform: `translate(${x}px, ${y}px)`,
				transformOrigin: "center center",
				zIndex: 15, // Always in front for visibility
			}}
		>
			{/* Moon Glow Effect */}
			<div className="absolute inset-0 rounded-full bg-blue-100/30 blur-[8px] animate-moon-pulse"></div>

			{/* Moon Image */}
			<Image
				src="/assets/glowing_full_moon.png"
				alt="Glowing Moon"
				width={moonSize}
				height={moonSize}
				className="w-full h-full object-contain"
			/>
		</div>
	);
}

function JupiterModel({ scale = 1, hyperjumpProgress = 0 }: Planet3DProps) {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/earth_nasa.glb");

	// Initial positions
	const initialX = -10;
	const initialZ = -5;

	useFrame((state, delta) => {
		if (group.current) {
			// Rotate the planet
			group.current.rotation.y += delta * 0.2;
			// Move outward during hyperjump
			group.current.position.x = initialX + 20 * (1 - hyperjumpProgress); // Move from outward to initial
			group.current.position.z = initialZ - 70 * (1 - hyperjumpProgress); // Move from outward to initial
		}
	});

	return (
		<group
			ref={group}
			scale={[scale * SCALE, scale * SCALE, scale * SCALE]}
		>
			<primitive object={scene} />
		</group>
	);
}

export function Planet3D({
	scale = 1.5,
	// hyperjumping = false,
	hyperjumpProgress = 0,
}: Planet3DProps) {
	// Hide the planet and alien ship during hyperjump
	if (hyperjumpProgress > 0.2) {
		return null;
	}

	// Fade out effect during start of hyperjump
	const opacity = hyperjumpProgress > 0 ? 1 - hyperjumpProgress / 0.2 : 1;

	return (
		<div
			className="absolute top-[-20%] right-[40%] w-full h-full animate-planet-glow"
			style={{
				transform: `scale(${scale})`,
				opacity,
			}}
		>
			{/* Alien ship that orbits around the planet */}
			<div
				className="absolute"
				style={{
					top: "50%",
					left: "50%",
					width: "1px",
					height: "1px",
					transform: "translate(-50%, -50%)",
				}}
			>
				<AlienShip />
			</div>

			{/* Glowing Moon positioned at a fixed position relative to Earth */}
			<div
				className="absolute"
				style={{
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}
			>
				<GlowingMoon />
			</div>

			<Canvas
				camera={{ position: [0, 0, 5], fov: 75 }}
				style={{ background: "transparent" }}
			>
				{/* Ambient light for general illumination */}
				<ambientLight intensity={3} />

				{/* Main directional light */}
				<directionalLight
					position={[0, 0, 5]}
					intensity={2}
					color="#ffffff"
				/>

				{/* Accent light for planet glow */}
				<pointLight
					position={[0, 0, 5]}
					intensity={1}
					color="#ffcc00"
					distance={2}
				/>

				{/* Jupiter model */}
				<JupiterModel
					scale={scale}
					hyperjumpProgress={hyperjumpProgress}
				/>

				{/* Disable orbit controls for static display */}
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					enableRotate={false}
				/>
			</Canvas>
		</div>
	);
}
