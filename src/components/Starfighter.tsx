import React from "react";
import Image from "next/image";

interface StarfighterProps {
	x?: number;
	y?: number;
	scale?: number;
	rotation?: number; // in degrees
}

const Starfighter: React.FC<StarfighterProps> = ({
	x = 0,
	y = 0,
	scale = 1,
	rotation = 0,
}) => {
	const style: React.CSSProperties = {
		position: "absolute",
		left: x,
		top: y,
		transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
		transformOrigin: "center center",
		pointerEvents: "none",
		width: "128px",
		height: "128px",
		minWidth: "128px",
		minHeight: "128px",
	};

	return (
		<Image
			src="/assets/starwars_starfighter.png"
			alt="Starfighter"
			width={128}
			height={128}
			style={style}
		/>
	);
};

export default Starfighter;
