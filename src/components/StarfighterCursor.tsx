"use client";

import { useEffect, useState } from "react";
import Starfighter from "./Starfighter";

export function StarfighterCursor() {
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setPosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<div
			className="fixed pointer-events-none z-50"
			style={{
				left: position.x,
				top: position.y,
				transform: "translate(-50%, -50%)",
			}}
		>
			{/* <Starfighter x={0} y={0} scale={0.3} rotation={0} /> */}
		</div>
	);
}
