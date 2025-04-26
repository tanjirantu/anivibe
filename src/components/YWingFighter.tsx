import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.4;
const FLY_SPEED = 0.001;
const START_Y = -5; // Start from bottom of screen
const END_Y = 10; // End at top of screen
const Z_SPEED = 0.05; // Speed of movement towards the viewer
const MIN_Z = -20; // Minimum z position before reset

export function YWingFighter() {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/assets/starwars_ywing_fighterbomber.glb");

	useFrame(() => {
		if (group.current) {
			// Move the Y-wing from bottom to top
			group.current.position.y += FLY_SPEED;

			// Move towards the viewer (negative z)
			group.current.position.z -= Z_SPEED;

			// Reset position when it reaches the top or gets too close
			if (
				group.current.position.y > END_Y ||
				group.current.position.z < MIN_Z
			) {
				group.current.position.y = START_Y;
				group.current.position.z = 20; // Start from the end of the screen
			}
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
		</group>
	);
}
