"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function StarFighterModel() {
	const group = useRef<THREE.Group>(null);
	const { scene } = useGLTF(
		"/models/arc_170_starfighter_pathfinder_modification.glb"
	);

	useFrame((state, delta) => {
		if (group.current) {
			group.current.rotation.y += delta * 0.5; // Slow rotation
		}
	});

	return (
		<group ref={group} position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
			<primitive object={scene} />
		</group>
	);
}

export function StarFighter() {
	return (
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
			<Canvas
				camera={{ position: [0, 0, 5], fov: 50 }}
				style={{ background: "transparent" }}
			>
				<ambientLight intensity={0.5} />
				<directionalLight position={[10, 10, 5]} intensity={1} />
				<pointLight position={[-10, -10, -5]} intensity={0.5} />
				<StarFighterModel />
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					autoRotate
					autoRotateSpeed={0.5}
				/>
			</Canvas>
		</div>
	);
}
