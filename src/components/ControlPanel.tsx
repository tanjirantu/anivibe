"use client";

import React, { useEffect, useState } from "react";
import {
	FaRocket,
	// FaUserAstronaut,
	FaRedo,
	FaCog,
	FaCompressArrowsAlt,
	FaExpandArrowsAlt,
} from "react-icons/fa";

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
	galaxyName?: string;
	onNextGalaxy?: () => void;
	is3DNebula?: boolean;
	onNebulaToggle?: () => void;
	nebulaModelIndex?: number;
	onNebulaModelChange?: (index: number) => void;
	spaceshipModelIndex: number;
	onSpaceshipModelChange: (index: number) => void;
	hyperjumping: boolean;
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
	// onCockpitView,
	onReset,
	galaxyName,
	onNextGalaxy,
	is3DNebula,
	onNebulaToggle,
	nebulaModelIndex = 0,
	onNebulaModelChange,
	spaceshipModelIndex,
	onSpaceshipModelChange,
	hyperjumping,
}: ControlPanelProps) {
	const [isMounted, setIsMounted] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isExpanded, setIsExpanded] = useState(true);
	const [showMobileControls, setShowMobileControls] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		const checkMobile = () => setIsMobile(window.innerWidth <= 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	if (!isMounted) {
		return null;
	}

	if (isMobile)
		return (
			<>
				{/* Mobile Controls Toggle Button */}
				<button
					onClick={() => setShowMobileControls(!showMobileControls)}
					className="fixed bottom-4 right-4 z-50 bg-black/70 text-white rounded-full p-3 shadow-lg border border-white/20 backdrop-blur-sm"
					aria-label={
						showMobileControls ? "Hide controls" : "Show controls"
					}
				>
					<FaCog
						size={24}
						className={showMobileControls ? "animate-spin" : ""}
					/>
				</button>

				{/* Mobile Controls Panel */}
				{showMobileControls && (
					<div className="fixed bottom-20 left-4 right-4 z-50 bg-black/80 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg p-4 space-y-4">
						{/* Quick Action Buttons */}
						<div className="grid grid-cols-2 gap-3">
							<button
								onClick={onHyperspeedJump}
								disabled={!onHyperspeedJump}
								className="col-span-1 px-4 py-3 bg-blue-600/80 text-white font-medium rounded-lg shadow-md border border-blue-400/60 hover:bg-blue-500/80 transition-all text-sm tracking-wide animate-pulse focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
							>
								<FaRocket className="mr-2" /> Jump
							</button>
							<button
								onClick={onReset}
								disabled={!onReset}
								className="col-span-1 px-4 py-3 bg-gray-700/80 text-white font-medium rounded-lg shadow-md border border-gray-400/60 hover:bg-gray-600/80 transition-all text-sm tracking-wide focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
							>
								<FaRedo className="mr-2" /> Reset
							</button>
						</div>

						{/* Sliders */}
						<div className="space-y-4">
							{/* Dust Speed Control */}
							<div>
								<label className="text-white text-sm block mb-2">
									Space Dust: {dustSpeed.toFixed(1)}
								</label>
								<input
									type="range"
									min="0.5"
									max="5"
									step="0.1"
									value={dustSpeed}
									onChange={(e) =>
										onDustSpeedChange(
											parseFloat(e.target.value)
										)
									}
									className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
								/>
							</div>

							{/* Starfighter Speed Control */}
							<div>
								<label className="text-white text-sm block mb-2">
									Speed: {starfighterSpeed.toFixed(1)}
								</label>
								<input
									type="range"
									min="0.1"
									max="2"
									step="0.1"
									value={starfighterSpeed}
									onChange={(e) =>
										onStarfighterSpeedChange(
											parseFloat(e.target.value)
										)
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
										onPlanetSizeChange(
											parseFloat(e.target.value)
										)
									}
									className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
								/>
							</div>
						</div>

						{/* Galaxy Background Switcher */}
						{galaxyName && onNextGalaxy && (
							<button
								onClick={onNextGalaxy}
								className="w-full px-4 py-3 bg-indigo-900/60 text-indigo-200 font-medium text-sm rounded-lg border border-indigo-400/60 hover:bg-indigo-800/60 transition-colors"
							>
								{galaxyName} <span className="ml-1">🔄</span>
							</button>
						)}

						{/* Nebula Controls */}
						{onNebulaToggle && (
							<div className="space-y-2">
								<div className="relative py-2">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-gray-600"></div>
									</div>
								</div>

								{/* 3D Nebula Model Selection */}
								<div className="flex flex-col gap-2">
									<button
										onClick={() => {
											if (!is3DNebula) {
												onNebulaToggle();
											}
											if (onNebulaModelChange) {
												onNebulaModelChange(0);
											}
										}}
										className={`w-full px-2 py-1 text-sm rounded-md transition-colors ${
											is3DNebula && nebulaModelIndex === 0
												? "bg-blue-600 text-white"
												: "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
										}`}
									>
										Photosphere
									</button>
									<button
										onClick={() => {
											if (!is3DNebula) {
												onNebulaToggle();
											}
											if (onNebulaModelChange) {
												onNebulaModelChange(1);
											}
										}}
										className={`w-full px-2 py-1 text-sm rounded-md transition-colors ${
											is3DNebula && nebulaModelIndex === 1
												? "bg-blue-600 text-white"
												: "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
										}`}
									>
										Skydome 1
									</button>
									<button
										onClick={() => {
											if (!is3DNebula) {
												onNebulaToggle();
											}
											if (onNebulaModelChange) {
												onNebulaModelChange(2);
											}
										}}
										className={`w-full px-2 py-1 text-sm rounded-md transition-colors ${
											is3DNebula && nebulaModelIndex === 2
												? "bg-blue-600 text-white"
												: "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
										}`}
									>
										Skydome 2
									</button>
								</div>
							</div>
						)}

						{/* Spaceship Model Selection */}
						<div className="flex items-center gap-2">
							<button
								onClick={() => onSpaceshipModelChange(0)}
								disabled={hyperjumping}
								className="px-3 py-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded transition-colors"
							>
								{spaceshipModelIndex === 0
									? "Starfighter"
									: "Luminaris"}
							</button>
						</div>
					</div>
				)}
			</>
		);

	return (
		<div
			className={`fixed top-20 right-4 bg-black/80 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg z-50 transition-all duration-300 ${
				isExpanded ? "p-4 w-[260px]" : "p-2 w-[60px]"
			}`}
		>
			{/* Toggle button */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="absolute -left-3 top-4 bg-indigo-600 text-white rounded-full p-2 shadow-lg border border-indigo-400 hover:bg-indigo-500 transition-colors z-10"
				aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
			>
				{isExpanded ? (
					<FaCompressArrowsAlt size={14} />
				) : (
					<FaExpandArrowsAlt size={14} />
				)}
			</button>

			{/* Collapsed state */}
			{!isExpanded && (
				<div className="flex flex-col items-center space-y-4">
					<button
						onClick={() => setIsExpanded(true)}
						className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
						aria-label="Show controls"
					>
						<FaCog size={24} className="animate-spin-slow" />
					</button>

					<button
						onClick={onHyperspeedJump}
						disabled={!onHyperspeedJump}
						className="text-blue-400 bg-blue-900/40 rounded-full p-2 flex items-center justify-center shadow-md border border-blue-400/40 hover:bg-blue-700/40 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
						aria-label="Hyperjump"
					>
						<FaRocket size={20} />
					</button>

					<button
						onClick={onReset}
						disabled={!onReset}
						className="text-gray-300 bg-gray-800/40 rounded-full p-2 flex items-center justify-center shadow-md border border-gray-400/40 hover:bg-gray-700/40 transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
						aria-label="Reset"
					>
						<FaRedo size={20} />
					</button>
				</div>
			)}

			{/* Expanded state */}
			{isExpanded && (
				<>
					<h2 className="text-white text-lg font-bold mb-4 flex items-center">
						<FaCog className="mr-2" /> Controls
					</h2>

					<div className="space-y-6">
						{/* Skies Section */}
						<div className="space-y-3">
							<h3 className="text-white text-sm font-semibold flex items-center">
								<FaCompressArrowsAlt className="mr-2" /> Skies
							</h3>

							{/* Galaxy Background Switcher */}
							{galaxyName && onNextGalaxy && (
								<div className="mb-2">
									<button
										onClick={onNextGalaxy}
										className="w-full px-2 py-1.5 bg-indigo-900/60 text-indigo-200 font-medium text-sm rounded-md border border-indigo-400/60 hover:bg-indigo-800/60 transition-colors"
									>
										{galaxyName}{" "}
										<span className="ml-1">🔄</span>
									</button>
								</div>
							)}

							{/* Nebula Controls */}
							{onNebulaToggle && (
								<div className="space-y-2">
									{/* 2D Nebula Separator */}
									<div className="relative py-2">
										<div className="absolute inset-0 flex items-center">
											<div className="w-full border-t border-gray-600"></div>
										</div>
									</div>

									{/* 3D Nebula Model Selection */}
									<div className="flex flex-col gap-2">
										<button
											onClick={() => {
												if (!is3DNebula) {
													onNebulaToggle();
												}
												if (onNebulaModelChange) {
													onNebulaModelChange(0);
												}
											}}
											className={`w-full px-2 py-1 text-sm rounded-md transition-colors ${
												is3DNebula &&
												nebulaModelIndex === 0
													? "bg-blue-600 text-white"
													: "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
											}`}
										>
											Photosphere
										</button>
										<button
											onClick={() => {
												if (!is3DNebula) {
													onNebulaToggle();
												}
												if (onNebulaModelChange) {
													onNebulaModelChange(1);
												}
											}}
											className={`w-full px-2 py-1 text-sm rounded-md transition-colors ${
												is3DNebula &&
												nebulaModelIndex === 1
													? "bg-blue-600 text-white"
													: "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
											}`}
										>
											Skydome 1
										</button>
										<button
											onClick={() => {
												if (!is3DNebula) {
													onNebulaToggle();
												}
												if (onNebulaModelChange) {
													onNebulaModelChange(2);
												}
											}}
											className={`w-full px-2 py-1 text-sm rounded-md transition-colors ${
												is3DNebula &&
												nebulaModelIndex === 2
													? "bg-blue-600 text-white"
													: "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
											}`}
										>
											Skydome 2
										</button>
									</div>
								</div>
							)}
						</div>

						{/* Spaceships Section */}
						<div className="space-y-3">
							<h3 className="text-white text-sm font-semibold flex items-center">
								<FaRocket className="mr-2" /> Spaceships
							</h3>

							<div className="grid grid-cols-2 gap-2">
								<button
									onClick={(e) => {
										e.preventDefault();
										onSpaceshipModelChange(0);
									}}
									disabled={hyperjumping}
									className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
										spaceshipModelIndex === 0
											? "bg-blue-600 text-white"
											: "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
									} disabled:opacity-50 disabled:cursor-not-allowed`}
								>
									Starfighter
								</button>
								<button
									onClick={(e) => {
										e.preventDefault();
										onSpaceshipModelChange(2);
									}}
									disabled={hyperjumping}
									className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
										spaceshipModelIndex === 2
											? "bg-blue-600 text-white"
											: "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
									} disabled:opacity-50 disabled:cursor-not-allowed`}
								>
									Ezno
								</button>
							</div>
						</div>

						{/* Actions Section */}
						<div className="space-y-3">
							<h3 className="text-white text-sm font-semibold flex items-center">
								<FaRocket className="mr-2" /> Actions
							</h3>
							<div className="grid grid-cols-2 gap-2">
								<button
									onClick={onHyperspeedJump}
									disabled={!onHyperspeedJump}
									className="px-3 py-1.5 text-sm rounded-md transition-colors bg-blue-600/80 text-white hover:bg-blue-500/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
								>
									<FaRocket className="mr-2" /> Hyperjump
								</button>
								<button
									onClick={onReset}
									disabled={!onReset}
									className="px-3 py-1.5 text-sm rounded-md transition-colors bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
								>
									<FaRedo className="mr-2" /> Reset
								</button>
							</div>
						</div>

						{/* Settings Section */}
						<div className="space-y-3">
							<h3 className="text-white text-sm font-semibold flex items-center">
								<FaCog className="mr-2" /> Settings
							</h3>

							{/* Dust Speed Control */}
							<div>
								<label className="text-white text-sm block mb-2">
									Space Dust: {dustSpeed.toFixed(1)}
								</label>
								<input
									type="range"
									min="0.5"
									max="5"
									step="0.1"
									value={dustSpeed}
									onChange={(e) =>
										onDustSpeedChange(
											parseFloat(e.target.value)
										)
									}
									className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
								/>
							</div>

							{/* Starfighter Speed Control */}
							<div>
								<label className="text-white text-sm block mb-2">
									Speed: {starfighterSpeed.toFixed(1)}
								</label>
								<input
									type="range"
									min="0.1"
									max="2"
									step="0.1"
									value={starfighterSpeed}
									onChange={(e) =>
										onStarfighterSpeedChange(
											parseFloat(e.target.value)
										)
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
										onPlanetSizeChange(
											parseFloat(e.target.value)
										)
									}
									className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
								/>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
