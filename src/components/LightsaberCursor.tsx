"use client";

import { useEffect, useState } from "react";

type LightsaberColor = "blue" | "red" | "green" | "purple" | "yellow";

export function LightsaberCursor() {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isActive, setIsActive] = useState(false);
	const [color, setColor] = useState<LightsaberColor>("blue");

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setPosition({ x: e.clientX, y: e.clientY });
		};

		const handleMouseDown = () => setIsActive(true);
		const handleMouseUp = () => setIsActive(false);

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	const getColorStyles = (color: LightsaberColor) => {
		switch (color) {
			case "blue":
				return {
					blade: "#fff",
					bladeGradient: "rgba(0, 128, 255, 0.8)",
					glow: "0 0 5px #fff, 0 0 10px #fff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff",
					light: "rgba(0, 128, 255, 0.15)",
					lightGlow: "0 0 30px rgba(0, 128, 255, 0.5)",
				};
			case "red":
				return {
					blade: "#fff",
					bladeGradient: "rgba(255, 0, 0, 0.8)",
					glow: "0 0 5px #fff, 0 0 10px #fff, 0 0 20px #f00, 0 0 30px #f00, 0 0 40px #f00",
					light: "rgba(255, 0, 0, 0.15)",
					lightGlow: "0 0 30px rgba(255, 0, 0, 0.5)",
				};
			case "green":
				return {
					blade: "#fff",
					bladeGradient: "rgba(0, 255, 0, 0.8)",
					glow: "0 0 5px #fff, 0 0 10px #fff, 0 0 20px #0f0, 0 0 30px #0f0, 0 0 40px #0f0",
					light: "rgba(0, 255, 0, 0.15)",
					lightGlow: "0 0 30px rgba(0, 255, 0, 0.5)",
				};
			case "purple":
				return {
					blade: "#fff",
					bladeGradient: "rgba(255, 0, 255, 0.8)",
					glow: "0 0 5px #fff, 0 0 10px #fff, 0 0 20px #f0f, 0 0 30px #f0f, 0 0 40px #f0f",
					light: "rgba(255, 0, 255, 0.15)",
					lightGlow: "0 0 30px rgba(255, 0, 255, 0.5)",
				};
			case "yellow":
				return {
					blade: "#fff",
					bladeGradient: "rgba(255, 255, 0, 0.8)",
					glow: "0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff0, 0 0 30px #ff0, 0 0 40px #ff0",
					light: "rgba(255, 255, 0, 0.15)",
					lightGlow: "0 0 30px rgba(255, 255, 0, 0.5)",
				};
		}
	};

	const colorStyles = getColorStyles(color);

	return (
		<>
			{/* Lightsaber Blade */}
			<div
				className="fixed pointer-events-none z-50"
				style={{
					left: position.x,
					top: position.y,
					transform: "translate(-80%, -80%)",
				}}
			>
				<div
					className={`w-[2px] h-40 transition-all duration-200 ${
						isActive ? "opacity-100" : "opacity-0"
					}`}
					style={{
						background: colorStyles.blade,
						boxShadow: isActive ? colorStyles.glow : "none",
					}}
				>
					<div
						className="absolute inset-0"
						style={{
							background: `radial-gradient(circle, ${colorStyles.bladeGradient} 0%, transparent 100%)`,
						}}
					/>
				</div>
			</div>

			{/* Lightsaber Hilt */}
			<div
				className="fixed pointer-events-none z-50"
				style={{
					left: position.x,
					top: position.y,
					transform: "translate(-50%, 0)",
				}}
			>
				<div className="relative w-3">
					{/* Emitter */}
					<div className="h-1.5 bg-gradient-to-r from-gray-600 via-gray-300 to-gray-600 rounded-sm" />
					<div className="h-0.5 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700" />

					{/* Upper Grip */}
					<div className="h-3 bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800">
						<div className="absolute w-full h-full grid grid-rows-4">
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className="border-b border-gray-600"
								/>
							))}
						</div>
					</div>

					{/* Control Box */}
					<div className="h-4 relative">
						<div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700">
							<div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-red-500 rounded-full" />
							<div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-blue-500 rounded-full" />
							<div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-2 bg-gray-800 rounded" />
						</div>
					</div>

					{/* Lower Grip */}
					{/* <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800">
						<div className="absolute w-full h-full grid grid-rows-4">
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className="border-b border-gray-600"
								/>
							))}
						</div>
					</div> */}

					{/* Pommel */}
					<div className="h-1.5 bg-gradient-to-r from-gray-600 via-gray-300 to-gray-600 rounded-b-sm" />
				</div>
			</div>

			{/* Light Effect */}
			<div
				className="fixed pointer-events-none z-40"
				style={{
					left: position.x,
					top: position.y,
					transform: "translate(-50%, -100%)",
					width: "150px",
					height: "150px",
					background: colorStyles.light,
					boxShadow: isActive ? colorStyles.lightGlow : "none",
					borderRadius: "50%",
					opacity: isActive ? 1 : 0,
					transition: "all 0.2s ease-in-out",
				}}
			/>

			{/* Color Selector */}
			<div className="fixed bottom-4 right-4 z-50 flex gap-2">
				{(
					[
						"blue",
						"red",
						"green",
						"purple",
						"yellow",
					] as LightsaberColor[]
				).map((c) => (
					<button
						key={c}
						onClick={() => setColor(c)}
						className={`w-4 h-4 rounded-full border-2 ${
							color === c
								? `border-${c}-500 bg-${c}-300`
								: `border-${c}-400 bg-${c}-200`
						} transition-all duration-200`}
						title={`Select ${c} lightsaber`}
					/>
				))}
			</div>
		</>
	);
}
