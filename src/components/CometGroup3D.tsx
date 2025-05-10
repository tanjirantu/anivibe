"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Comet3D } from "./Comet3D";
import * as THREE from "three";

interface CometGroupProps {
	basePosition?: [number, number, number];
	groupSize?: number;
	speed?: number;
}

export function CometGroup3D({
	basePosition = [0, 0, 0],
	groupSize = 5,
	speed = 1,
}: CometGroupProps) {
	const group = useRef<THREE.Group>(null);

	// Create an array of comet configurations
	const comets = React.useMemo(() => {
		return Array.from({ length: groupSize }).map((_, index) => {
			// Randomize positions slightly to create a group formation
			const xOffset = (Math.random() - 0.5) * 3;
			const yOffset = (Math.random() - 0.5) * 2;
			const zOffset = (Math.random() - 0.5) * 4;

			// Randomize scale for variety
			const scale = 0.7 + Math.random() * 0.7;

			// Different rotation for each comet
			const rotation: [number, number, number] = [
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2,
			];

			// Speed variation
			const speedFactor = 0.8 + Math.random() * 0.4;

			return {
				position: [xOffset, yOffset, zOffset] as [
					number,
					number,
					number
				],
				scale,
				rotation,
				speedFactor,
				initialZ: zOffset, // Store initial z for animation
			};
		});
	}, [groupSize]);

	// Animate the entire comet group
	useFrame((state, delta) => {
		if (group.current) {
			// Move the entire group from right to left (negative x direction)
			group.current.position.x -= delta * 10 * speed;

			// Reset position when it goes off-screen to create endless flow
			if (group.current.position.x < -100) {
				group.current.position.x = 100;
			}
		}
	});

	return (
		<group ref={group} position={basePosition}>
			{comets.map((comet, index) => (
				<Comet3D
					key={index}
					position={comet.position}
					scale={comet.scale}
					rotation={comet.rotation}
					speed={comet.speedFactor * speed}
					trail={true}
				/>
			))}
		</group>
	);
}
