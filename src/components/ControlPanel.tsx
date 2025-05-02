"use client";

import React, { useEffect, useState } from "react";

interface ControlPanelProps {
	dustSpeed: number;
	onDustSpeedChange: (value: number) => void;
	starfighterSpeed: number;
	onStarfighterSpeedChange: (value: number) => void;
	planetSize: number;
	onPlanetSizeChange: (value: number) => void;
	// spaceColor: string;
	// onSpaceColorChange: (value: string) => void;
	onHyperspeedJump?: () => void;
	onCockpitView?: () => void;
	/** Optional reset handler */
	onReset?: () => void;
}

export function ControlPanel({
	dustSpeed,
	onDustSpeedChange,
	starfighterSpeed,
	onStarfighterSpeedChange,
	planetSize,
	onPlanetSizeChange,
	// spaceColor,
	// onSpaceColorChange,
	onHyperspeedJump,
	onCockpitView,
	onReset,
}: ControlPanelProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<div className="fixed top-20 right-4 bg-black/80 p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg z-50">
			<h2 className="text-white text-lg font-bold mb-4">
				Space Controls
			</h2>

			<div className="space-y-4">
				{/* Dust Speed Control */}
				<div>
					<label className="text-white text-sm block mb-2">
						Space Dust Speed: {dustSpeed.toFixed(1)}
					</label>
					<input
						type="range"
						min="0.5"
						max="5"
						step="0.1"
						value={dustSpeed}
						onChange={(e) =>
							onDustSpeedChange(parseFloat(e.target.value))
						}
						className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
					/>
				</div>

				{/* Starfighter Speed Control */}
				<div>
					<label className="text-white text-sm block mb-2">
						Starfighter Speed: {starfighterSpeed.toFixed(1)}
					</label>
					<input
						type="range"
						min="0.1"
						max="2"
						step="0.1"
						value={starfighterSpeed}
						onChange={(e) =>
							onStarfighterSpeedChange(parseFloat(e.target.value))
						}
						className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
					/>
				</div>

				{/* Planet Size Control */}
				<div>
					<label className="text-white text-sm block mb-2">
						Planet Size: {planetSize.toFixed(1)}
					</label>
					<input
						type="range"
						min="0.5"
						max="2"
						step="0.1"
						value={planetSize}
						onChange={(e) =>
							onPlanetSizeChange(parseFloat(e.target.value))
						}
						className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
					/>
				</div>

				{/* Space Color Control */}
				{/*
				<div>
					<label className="text-white text-sm block mb-2">
						Space Color Tone
					</label>
					<input
						type="color"
						value={spaceColor}
						onChange={(e) => onSpaceColorChange(e.target.value)}
						className="w-full h-8 rounded cursor-pointer"
					/>
				</div>
				*/}
			</div>

			{/* Hyperspeed Button */}
			<button
				onClick={onHyperspeedJump}
				disabled={!onHyperspeedJump}
				className="mt-6 w-full px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg border-2 border-blue-400 hover:bg-blue-500 transition-all text-lg tracking-wider animate-pulse focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
			>
				🚀 Hyperjump
			</button>

			{/* Cockpit View Button */}
			<button
				onClick={onCockpitView}
				disabled={!onCockpitView}
				className="mt-4 w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg border-2 border-green-400 hover:bg-green-500 transition-all text-lg tracking-wider focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
			>
				🛩️ Cockpit
			</button>

			{/* Reset Button */}
			<button
				onClick={onReset}
				disabled={!onReset}
				className="mt-4 w-full px-4 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-lg border-2 border-gray-400 hover:bg-gray-600 transition-all text-lg tracking-wider focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Reset
			</button>
		</div>
	);
}
