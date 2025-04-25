import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCALE = 0.2;
const WALK_SPEED = 0.01;
const LEG_SWING_AMPLITUDE = 0.5;
const LEG_SWING_SPEED = 2;

export function ATATWalker() {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF("/models/imperial_at-at_walker_-_star_wars.glb");

	// Find leg parts in the model
	const frontLeftLeg = useRef<THREE.Object3D | null>(null);
	const frontRightLeg = useRef<THREE.Object3D | null>(null);
	const backLeftLeg = useRef<THREE.Object3D | null>(null);
	const backRightLeg = useRef<THREE.Object3D | null>(null);

	useEffect(() => {
		// Traverse the scene to find leg parts
		scene.traverse((child) => {
			if (child.name.toLowerCase().includes("front_left_leg")) {
				frontLeftLeg.current = child;
			} else if (child.name.toLowerCase().includes("front_right_leg")) {
				frontRightLeg.current = child;
			} else if (child.name.toLowerCase().includes("back_left_leg")) {
				backLeftLeg.current = child;
			} else if (child.name.toLowerCase().includes("back_right_leg")) {
				backRightLeg.current = child;
			}
		});
	}, [scene]);

	useFrame((state, delta) => {
		if (group.current) {
			// Move the AT-AT from right to left
			group.current.position.x -= WALK_SPEED;

			// Reset position when it goes off screen
			if (group.current.position.x < -20) {
				group.current.position.x = 20;
			}

			// Animate legs
			const time = state.clock.getElapsedTime();

			// Front legs animation
			if (frontLeftLeg.current) {
				frontLeftLeg.current.rotation.x =
					Math.sin(time * LEG_SWING_SPEED) * LEG_SWING_AMPLITUDE;
			}
			if (frontRightLeg.current) {
				frontRightLeg.current.rotation.x =
					-Math.sin(time * LEG_SWING_SPEED) * LEG_SWING_AMPLITUDE;
			}

			// Back legs animation (slightly out of phase with front legs)
			if (backLeftLeg.current) {
				backLeftLeg.current.rotation.x =
					-Math.sin(time * LEG_SWING_SPEED) * LEG_SWING_AMPLITUDE;
			}
			if (backRightLeg.current) {
				backRightLeg.current.rotation.x =
					Math.sin(time * LEG_SWING_SPEED) * LEG_SWING_AMPLITUDE;
			}
		}
	});

	return (
		<group
			ref={group}
			position={[20, -2, 0]}
			rotation={[0, Math.PI / 2, 0]}
			scale={[SCALE, SCALE, SCALE]}
		>
			<primitive object={scene} />
		</group>
	);
}
