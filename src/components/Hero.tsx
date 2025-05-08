"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { StarFighter3D } from "./StarFighter3D";
import { Planet3D } from "./Planet3D";
import { Saturn3D } from "./Saturn3D";
import { Juno3D } from "./Juno3D";
import { ControlPanel } from "./ControlPanel";
import Image from "next/image";
import { StarfieldCanvas } from "./StarfieldCanvas";
import { useGLTF, useProgress } from "@react-three/drei";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import BlackHole3D from "./BlackHole3D";
import StarFighter from "./StarFighter";

// Camera component for cockpit POV with cursor-based movement
function CameraCockpitPOV({
	cursorX,
	cursorY,
}: {
	cursorX: number;
	cursorY: number;
}) {
	const { camera, clock } = useThree();
	const startTime = React.useRef<number | null>(null);
	useFrame(() => {
		if (startTime.current === null)
			startTime.current = clock.getElapsedTime();
		const elapsed = clock.getElapsedTime() - (startTime.current ?? 0);
		const t = Math.min(elapsed / 1, 1); // 1 second duration
		// Camera zoom-in
		const z = 5 - 5 * t;
		// Map cursorX/Y (0-1) to camera rotation/offsets
		// Center is (0.5, 0.5)
		const maxPan = 0.6; // how much to pan left/right (in units)
		const maxTilt = 0.35; // how much to tilt up/down (in units)
		const pan = (cursorX - 0.5) * 2 * maxPan; // -maxPan to +maxPan
		const tilt = (cursorY - 0.5) * 2 * maxTilt; // -maxTilt to +maxTilt
		camera.position.set(pan, -tilt, z);
		// Look at a point slightly ahead, also offset by pan/tilt for realism
		camera.lookAt(pan * 0.7, -tilt * 0.7, 10);
		camera.updateProjectionMatrix();
	});
	return null;
}

// Cockpit view component
interface XWingCockpitViewProps {
	cursorX: number;
	cursorY: number;
}
function XWingCockpitView({ cursorX, cursorY }: XWingCockpitViewProps) {
	const { scene } = useGLTF("/assets/a_wing_cockpit.glb");
	return (
		<div className="absolute inset-0 w-full h-full z-20">
			<Canvas
				camera={{ position: [0, 0, 5], fov: 75 }}
				style={{ background: "transparent" }}
			>
				<CameraCockpitPOV cursorX={cursorX} cursorY={cursorY} />
				<ambientLight intensity={2} />
				<directionalLight
					position={[0, 0, 5]}
					intensity={2}
					color="#ffffff"
				/>
				<primitive object={scene} />
			</Canvas>
		</div>
	);
}

// Global Loader overlay component
function GlobalLoaderOverlay() {
	const { active, progress } = useProgress();
	if (!active) return null;
	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
			<div className="flex flex-col items-center gap-4">
				<svg
					className="animate-spin h-12 w-12 text-yellow-300"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8v8z"
					/>
				</svg>
				<div className="text-yellow-300 text-2xl font-bold">
					Loading... {progress.toFixed(0)}%
				</div>
			</div>
		</div>
	);
}

// Galaxy background variants
const GALAXY_VARIANTS = [
	{
		name: "Classic Deep Space",
		gradient: "bg-gradient-to-b from-[#090921] via-[#161B33] to-[#0F1644]",
	},
	{
		name: "Nebula Blue",
		gradient: "bg-gradient-to-b from-[#0a1a2f] via-[#1a2a4f] to-[#0e1a3a]",
	},
	{
		name: "Purple Night",
		gradient: "bg-gradient-to-b from-[#1a0921] via-[#3a1b4f] to-[#2f0f44]",
	},
	{
		name: "Emerald Void",
		gradient: "bg-gradient-to-b from-[#09211a] via-[#1b334f] to-[#0f442f]",
	},
	{
		name: "Dark Matter",
		gradient: "bg-gradient-to-b from-[#111111] via-[#222233] to-[#181824]",
	},
];

// Helper for lerp
function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

// Naboo Starfighter 3D component
function NabooStarfighter({
	position,
	rotation,
}: {
	position: [number, number, number];
	rotation?: [number, number, number];
}) {
	const { scene } = useGLTF("/models/naboo_starfighter.glb");
	return (
		<primitive
			object={scene}
			position={position}
			rotation={rotation}
			scale={[2.5, 2.5, 2.5]}
		/>
	);
}

export function Hero() {
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [isCursorInHero, setIsCursorInHero] = useState(false);
	const [isCursorInNavbar, setIsCursorInNavbar] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const heroRef = useRef<HTMLElement>(null);

	// Control panel states
	const [dustSpeed, setDustSpeed] = useState(1);
	const [starfighterSpeed, setStarfighterSpeed] = useState(1);
	const [planetSize, setPlanetSize] = useState(1);

	// Cockpit and starfield speed state
	const [isCockpit, setIsCockpit] = useState(false);
	const [starSpeed, setStarSpeed] = useState(0.0035);

	// Hyperjump animation state
	const [hyperjumping, setHyperjumping] = useState(false);
	const [hyperjumpProgress, setHyperjumpProgress] = useState(0); // 0 to 1

	// Sky background variant state
	const [galaxyIndex, setGalaxyIndex] = useState(0);
	const handleNextGalaxy = () =>
		setGalaxyIndex((i) => (i + 1) % GALAXY_VARIANTS.length);

	// Cockpit view handler (used for both Hyperjump and Cockpit buttons)
	const handleCockpitView = () => {
		setIsCockpit(true);
	};

	// New Hyperjump animation handler
	const handleHyperjump = () => {
		setHyperjumping(true);
		setIsCockpit(false);
		let progress = 0;
		const duration = 1800; // ms
		const start = performance.now();
		function animate(now: DOMHighResTimeStamp) {
			progress = Math.min((now - start) / duration, 1);
			setHyperjumpProgress(progress);
			// Animate starSpeed from 0.0035 to 0.02
			setStarSpeed(0.0035 + (0.02 - 0.0035) * progress);
			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setHyperjumping(false); // Animation ends, keep close view
			}
		}
		requestAnimationFrame(animate);
	};

	// Reset handler for ControlPanel
	const handleReset = () => {
		setHyperjumping(false);
		setHyperjumpProgress(0);
		setStarSpeed(0.0035);
	};

	const handleMouseMove = useCallback((e: MouseEvent) => {
		setCursorPosition({ x: e.clientX, y: e.clientY });

		// Check if cursor is in navbar (first 64px from top)
		const isInNavbar = e.clientY <= 64;
		setIsCursorInNavbar(isInNavbar);

		if (heroRef.current) {
			const heroRect = heroRef.current.getBoundingClientRect();
			const isInHero =
				e.clientX >= heroRect.left &&
				e.clientX <= heroRect.right &&
				e.clientY >= heroRect.top &&
				e.clientY <= heroRect.bottom;

			setIsCursorInHero(isInHero);
		}
	}, []);

	useEffect(() => {
		setIsMounted(true);

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);

	// Starfighter animation state and logic
	const [starfighterPos, setStarfighterPos] = useState({ x: -100, y: 0 });
	const [starfighterVisible, setStarfighterVisible] = useState(true);
	const [starfighterRotation, setStarfighterRotation] = useState(0);
	const [bullet, setBullet] = useState<null | {
		x: number;
		y: number;
		t: number;
	}>(null);
	const bulletRef = useRef<HTMLDivElement>(null);
	// Alien ship position (match the floating alien ship in the background)
	const [alienShipPos, setAlienShipPos] = useState({ x: 0, y: 0 });
	useEffect(() => {
		// Only access window in useEffect (client-side)
		if (typeof window !== "undefined") {
			setAlienShipPos({
				x: window.innerWidth * 0.65,
				y: window.innerHeight * 0.25,
			});
		}
	}, []);
	// Random path parameters (amplitude, frequency, phase)
	const pathParams = useRef({
		amplitude: 80 + Math.random() * 120, // px
		frequency: 0.7 + Math.random() * 0.7, // radians per second
		phase: Math.random() * Math.PI * 2,
		verticalOffset: 0, // Will be set in useEffect
		speed: 3.5 + Math.random() * 1.5, // seconds to cross
	});

	useEffect(() => {
		// Update verticalOffset with window height
		if (typeof window !== "undefined") {
			pathParams.current.verticalOffset =
				window.innerHeight / 2 + (Math.random() - 0.5) * 120;
		}
	}, []);

	// useEffect(() => {
	// 	let t = 0;
	// 	let raf: number;
	// 	let hasFired = false;

	// 	// Only run animation on client side
	// 	if (typeof window === "undefined") return;

	// 	function animate() {
	// 		t += 0.016; // ~60fps
	// 		const { amplitude, frequency, phase, verticalOffset, speed } =
	// 			pathParams.current;
	// 		const startX = -100;
	// 		const endX = window.innerWidth + 100;
	// 		const progress = t / speed;
	// 		const x = lerp(startX, endX, progress);
	// 		// Random smooth y path
	// 		const y =
	// 			verticalOffset +
	// 			amplitude * Math.sin(progress * Math.PI * frequency + phase);
	// 		setStarfighterPos({ x, y });
	// 		setStarfighterRotation(0);
	// 		// Fire bullet when starfighter is about 1/3 across the screen
	// 		if (!hasFired && progress > 0.33) {
	// 			setBullet({ x, y, t: 0 });
	// 			hasFired = true;
	// 		}
	// 		// Animate bullet
	// 		if (bullet) {
	// 			const bulletSpeed = 0.025;
	// 			const newT = bullet.t + bulletSpeed;
	// 			const bx = lerp(bullet.x, alienShipPos.x, newT);
	// 			const by = lerp(bullet.y, alienShipPos.y, newT);
	// 			setBullet(
	// 				newT < 1 ? { x: bullet.x, y: bullet.y, t: newT } : null
	// 			);
	// 			if (bulletRef.current) {
	// 				bulletRef.current.style.left = `${bx}px`;
	// 				bulletRef.current.style.top = `${by}px`;
	// 			}
	// 		}
	// 		// When starfighter leaves the screen, reset with new random path
	// 		if (progress >= 1) {
	// 			setTimeout(() => {
	// 				pathParams.current = {
	// 					amplitude: 80 + Math.random() * 120,
	// 					frequency: 0.7 + Math.random() * 0.7,
	// 					phase: Math.random() * Math.PI * 2,
	// 					verticalOffset:
	// 						window.innerHeight / 2 +
	// 						(Math.random() - 0.5) * 120,
	// 					speed: 3.5 + Math.random() * 1.5,
	// 				};
	// 				setStarfighterPos({ x: startX, y });
	// 				setStarfighterVisible(true);
	// 				t = 0;
	// 				hasFired = false;
	// 			}, 500);
	// 			setStarfighterVisible(false);
	// 			return;
	// 		}
	// 		raf = requestAnimationFrame(animate);
	// 	}
	// 	raf = requestAnimationFrame(animate);
	// 	return () => cancelAnimationFrame(raf);
	// 	// eslint-disable-next-line
	// }, [bullet]);

	// Set initial y position for starfighter on client
	useEffect(() => {
		if (typeof window !== "undefined") {
			setStarfighterPos((pos) => ({ ...pos, y: window.innerHeight / 2 }));
		}
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<section
			ref={heroRef}
			className="relative h-screen w-screen overflow-hidden cursor-none"
		>
			<GlobalLoaderOverlay />

			{/* Exit Cockpit View Button */}
			{isCockpit && (
				<button
					onClick={() => setIsCockpit(false)}
					className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-2 bg-black/80 text-yellow-300 font-bold rounded-lg border-2 border-yellow-400 shadow-lg hover:bg-yellow-700/80 transition-colors"
				>
					Exit Cockpit View
				</button>
			)}

			{/* Immersive Starfield Canvas (always rendered as background) */}
			<StarfieldCanvas
				starSpeed={starSpeed}
				shake={hyperjumping ? hyperjumpProgress : 0}
			/>

			{/* Cockpit View */}
			{isCockpit ? (
				<>
					<XWingCockpitView
						cursorX={
							isCursorInHero &&
							!isCursorInNavbar &&
							typeof window !== "undefined"
								? cursorPosition.x / window.innerWidth
								: 0.5
						}
						cursorY={
							isCursorInHero &&
							!isCursorInNavbar &&
							typeof window !== "undefined"
								? cursorPosition.y / window.innerHeight
								: 0.5
						}
					/>
					{/* Crosshair Cursor in Cockpit Mode */}
					{isCursorInHero && !isCursorInNavbar && (
						<div
							className="fixed pointer-events-none z-50"
							style={{
								transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
								transition: `transform ${
									0.1 / starfighterSpeed
								}s ease-out`,
							}}
						>
							<svg
								width="48"
								height="48"
								viewBox="0 0 48 48"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle
									cx="24"
									cy="24"
									r="10"
									stroke="#FFD600"
									strokeWidth="2"
								/>
								<line
									x1="24"
									y1="4"
									x2="24"
									y2="16"
									stroke="#FFD600"
									strokeWidth="2"
								/>
								<line
									x1="24"
									y1="32"
									x2="24"
									y2="44"
									stroke="#FFD600"
									strokeWidth="2"
								/>
								<line
									x1="4"
									y1="24"
									x2="16"
									y2="24"
									stroke="#FFD600"
									strokeWidth="2"
								/>
								<line
									x1="32"
									y1="24"
									x2="44"
									y2="24"
									stroke="#FFD600"
									strokeWidth="2"
								/>
								<circle cx="24" cy="24" r="2" fill="#FFD600" />
							</svg>
						</div>
					)}
				</>
			) : (
				<>
					{/* 3D Models */}
					<div className="absolute inset-0 w-full h-full z-10">
						<Planet3D
							scale={planetSize}
							hyperjumping={hyperjumping}
							hyperjumpProgress={hyperjumpProgress}
						/>
						<Saturn3D
							speed={starfighterSpeed}
							scale={planetSize}
							hyperjumping={hyperjumping}
							hyperjumpProgress={hyperjumpProgress}
						/>
						<StarFighter3D
							speed={starfighterSpeed}
							hyperjumping={hyperjumping}
							hyperjumpProgress={hyperjumpProgress}
						/>
						<Juno3D
							scale={planetSize}
							hyperjumping={hyperjumping}
							hyperjumpProgress={hyperjumpProgress}
						/>
						{/* <BlackHole3D position={[35, 5, -10]} scale={0.8} /> */}
					</div>

					{/* Custom Cursor */}
					{isCursorInHero && !isCursorInNavbar && (
						<div
							className="fixed pointer-events-none z-50"
							style={{
								transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
								transition: `transform ${
									0.1 / starfighterSpeed
								}s ease-out`,
							}}
						>
							{/* Crosshair SVG */}
							<svg
								width="48"
								height="48"
								viewBox="0 0 48 48"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle
									cx="24"
									cy="24"
									r="10"
									stroke="#FFD600"
									strokeWidth="2"
								/>
								<line
									x1="24"
									y1="4"
									x2="24"
									y2="16"
									stroke="#FFD600"
									strokeWidth="2"
								/>
								<line
									x1="24"
									y1="32"
									x2="24"
									y2="44"
									stroke="#FFD600"
									strokeWidth="2"
								/>
								<line
									x1="4"
									y1="24"
									x2="16"
									y2="24"
									stroke="#FFD600"
									strokeWidth="2"
								/>
								<line
									x1="32"
									y1="24"
									x2="44"
									y2="24"
									stroke="#FFD600"
									strokeWidth="2"
								/>
								<circle cx="24" cy="24" r="2" fill="#FFD600" />
							</svg>
						</div>
					)}

					{/* Galaxy Background */}
					<div className="absolute inset-0 z-0">
						{/* Dynamic Galaxy Background */}
						<div
							className={`absolute inset-0 ${GALAXY_VARIANTS[galaxyIndex].gradient}`}
							style={{
								transition: "background-color 0.3s ease",
							}}
						/>

						{/* Stars Layer (commented out, replaced by StarfieldCanvas) */}
						{/*
						<div className="absolute inset-0 transform-style-3d perspective-[1000px]">
							{stars.map((star, i) => (
								<div key={`star-${i}`} className="transform-style-3d">
									<div
										className={`absolute w-[2px] h-[2px] bg-white rounded-full animate-falling-star ${
											star.isGlowing ? "animate-glow" : ""
										}`}
										style={{
											top: star.top,
											left: star.left,
											opacity: star.opacity,
											animationDelay: star.delay,
											animationDuration: `${star.speed}s`,
										}}
									/>
									{star.isGlowing && (
										<div
											key={`glow-${i}`}
											className="absolute w-[2px] h-[2px] bg-white rounded-full animate-glow"
											style={{
												top: star.top,
												left: star.left,
												animationDelay: star.glowDelay,
											}}
										/>
									)}
								</div>
							))}
						</div>
						*/}

						{/* Nebula Effects */}
						<div className="absolute inset-0">
							{/* Purple Nebula */}
							<div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-[100px]" />
							<div className="absolute top-[15%] left-[25%] w-[200px] h-[200px] rounded-full bg-purple-600/20 blur-[80px]" />

							{/* Blue Nebula */}
							<div className="absolute top-[30%] right-[20%] w-[250px] h-[250px] rounded-full bg-blue-500/20 blur-[90px]" />
							<div className="absolute top-[35%] right-[25%] w-[150px] h-[150px] rounded-full bg-blue-600/20 blur-[70px]" />

							{/* Teal Accent */}
							<div className="absolute bottom-[20%] left-[30%] w-[200px] h-[200px] rounded-full bg-teal-500/20 blur-[80px]" />
						</div>

						{/* Cosmic Dust */}
						<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.3)_70%,_rgba(0,0,0,0.4)_100%)]" />

						{/* Floating Satellite */}
						{/* <div className="absolute top-[15%] right-[70%] w-[42px] h-[42px] animate-float-around">
							<img
								src="/assets/space_satellite.png"
								alt="Satellite"
								className="w-full h-full object-contain"
							/>
						</div> */}

						{/* Floating Alien Ship */}
						<div className="absolute top-[25%] right-[35%] w-[48px] h-[48px] animate-float-ship">
							<Image
								src="/assets/alien_ship.png"
								alt="Alien Ship"
								width={48}
								height={48}
								className="w-full h-full object-contain"
							/>
						</div>

						{/* Floating Asteroid */}
						<div className="absolute top-[60%] left-[30%] w-[32px] h-[32px] animate-float-asteroid">
							<Image
								src="/assets/astroid_01.png"
								alt="Asteroid"
								width={32}
								height={32}
								className="w-full h-full object-contain"
							/>
						</div>

						{/* Asteroid Group 1 */}
						<div className="absolute top-[40%] left-[15%] w-[24px] h-[24px] animate-float-asteroid-1">
							<Image
								src="/assets/astroid_01.png"
								alt="Asteroid"
								width={24}
								height={24}
								className="w-full h-full object-contain"
							/>
						</div>
						<div className="absolute top-[45%] left-[18%] w-[20px] h-[20px] animate-float-asteroid-2">
							<Image
								src="/assets/astroid_01.png"
								alt="Asteroid"
								width={20}
								height={20}
								className="w-full h-full object-contain"
							/>
						</div>
						<div className="absolute top-[38%] left-[20%] w-[28px] h-[28px] animate-float-asteroid-3">
							<Image
								src="/assets/astroid_01.png"
								alt="Asteroid"
								width={28}
								height={28}
								className="w-full h-full object-contain"
							/>
						</div>

						{/* Asteroid Group 2 */}
						<div className="absolute top-[70%] right-[25%] w-[18px] h-[18px] animate-float-asteroid-4">
							<Image
								src="/assets/astroid_01.png"
								alt="Asteroid"
								width={18}
								height={18}
								className="w-full h-full object-contain"
							/>
						</div>
						<div className="absolute top-[75%] right-[28%] w-[16px] h-[16px] animate-float-asteroid-5">
							<Image
								src="/assets/astroid_01.png"
								alt="Asteroid"
								width={16}
								height={16}
								className="w-full h-full object-contain"
							/>
						</div>
						<div className="absolute top-[72%] right-[22%] w-[12px] h-[12px] animate-float-asteroid-6">
							<Image
								src="/assets/astroid_01.png"
								alt="Asteroid"
								width={12}
								height={12}
								className="w-full h-full object-contain"
							/>
						</div>

						{/* Comet 1 */}
						<div className="absolute top-0 left-[-40px] w-[40px] h-[40px] animate-comet-1">
							<Image
								src="/assets/comet_04.png"
								alt="Comet"
								width={40}
								height={40}
								className="w-full h-full object-contain"
							/>
							<div className="absolute inset-0 w-full h-full bg-white/30 blur-[20px] animate-comet-trail-1"></div>
						</div>

						{/* Planets */}
						{/* <div className="absolute top-[15%] left-[10%] w-[40px] h-[40px] animate-planet-glow">
							<img
								src="/assets/planet_02.png"
								alt="Planet"
								className="w-full h-full object-contain"
							/>
							<div className="absolute inset-0 w-full h-full bg-blue-500/20 blur-[20px] rounded-full"></div>
						</div> */}

						{/* <div className="absolute top-[60%] right-[15%] w-[100px] h-[100px] animate-planet-glow">
							<img
								src="/assets/planet_03.png"
								alt="Planet"
								className="w-full h-full object-contain"
							/>
							<div className="absolute inset-0 w-full h-full bg-purple-500/20 blur-[30px] rounded-full"></div>
						</div> */}

						{/* <div className="absolute top-[30%] right-[30%] w-[120px] h-[120px] animate-planet-glow">
							<Image
								src="/assets/planet_04.png"
								alt="Planet"
								width={120}
								height={120}
								className="w-full h-full object-contain"
							/>
							<div className="absolute inset-0 w-full h-full bg-orange-500/20 blur-[20px] rounded-full"></div>
						</div> */}

						{/* <div className="absolute top-[70%] left-[25%] w-[90px] h-[90px] animate-planet-glow">
							<img
								src="/assets/planet_05.png"
								alt="Planet"
								className="w-full h-full object-contain"
							/>
							<div className="absolute inset-0 w-full h-full bg-green-500/20 blur-[20px] rounded-full"></div>
						</div> */}
					</div>

					{/* Content */}
					<div className="h-full w-full relative z-10 grid lg:grid-cols-2 gap-8">
						{/* Left Column - Text */}
						{/* <div className="flex flex-col justify-center space-y-6">
							<div className="relative">
								<div className="absolute -left-8 top-0 bottom-0 w-1 bg-yellow-400"></div>
								<h1 className="text-5xl font-bold text-yellow-400 drop-shadow-lg font-star-wars tracking-wider">
									<AnimatedText
										text='"Do or do not, there is no try"'
										typingSpeed={100}
										erasingSpeed={50}
										delay={2000}
									/>
								</h1>
								<p className="text-right text-xl text-yellow-400/80 drop-shadow mt-2 font-star-wars">
									- Master Yoda
								</p>
							</div>
							<p className="text-xl text-white/90 drop-shadow">
								Explore my journey through the digital universe, where
								creativity meets technology.
							</p>
							<div className="flex gap-4">
								<button className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-bold border-2 border-yellow-600 shadow-[0_0_10px_rgba(255,223,0,0.5)] hover:shadow-[0_0_15px_rgba(255,223,0,0.7)]">
									View My Work
								</button>
								<button className="px-6 py-3 bg-transparent text-yellow-400 rounded-lg hover:bg-yellow-400/10 transition-colors font-bold border-2 border-yellow-400 shadow-[0_0_10px_rgba(255,223,0,0.3)] hover:shadow-[0_0_15px_rgba(255,223,0,0.5)]">
									Contact Me
								</button>
							</div>
						</div> */}

						{/* Right Column - Starfighter */}
						<div className="hidden lg:flex items-center justify-center relative">
							{/* <Starfighter x={400} y={400} scale={1.2} rotation={0} /> */}
						</div>
					</div>

					{/* Control Panel */}
					<ControlPanel
						dustSpeed={dustSpeed}
						onDustSpeedChange={setDustSpeed}
						starfighterSpeed={starfighterSpeed}
						onStarfighterSpeedChange={setStarfighterSpeed}
						planetSize={planetSize}
						onPlanetSizeChange={setPlanetSize}
						onHyperspeedJump={handleHyperjump}
						onCockpitView={handleCockpitView}
						onReset={handleReset}
						galaxyName={GALAXY_VARIANTS[galaxyIndex].name}
						onNextGalaxy={handleNextGalaxy}
					/>

					{/* Render StarFighter at center of the screen for test */}
					{/* <StarFighter
						x={
							typeof window !== "undefined"
								? window.innerWidth / 2
								: 0
						}
						y={
							typeof window !== "undefined"
								? window.innerHeight / 2
								: 0
						}
						rotation={0}
						visible={true}
					/> */}

					{/* Bullet/laser fired towards alien ship */}
					{/* {bullet && (
						<div
							ref={bulletRef}
							style={{
								position: "fixed",
								left: starfighterPos.x,
								top: starfighterPos.y,
								width: 8,
								height: 8,
								zIndex: 29,
								pointerEvents: "none",
								transform: "translate(-50%, -50%)",
							}}
						>
							<svg width="8" height="8">
								<circle cx="4" cy="4" r="4" fill="#ff2d55" />
							</svg>
						</div>
					)} */}
				</>
			)}

			{/* Animations */}
			<style jsx global>{`
				@font-face {
					font-family: "Star Wars";
					src: url("/fonts/Starjedi.ttf") format("truetype");
				}
				.font-star-wars {
					font-family: "Star Wars", sans-serif;
				}
				@keyframes twinkle {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.3;
					}
				}
				.animate-twinkle {
					animation: twinkle 2s ease-in-out infinite;
				}
				@keyframes falling-star {
					0% {
						transform: translateZ(-3000px) scale(0.1)
							translateY(100%);
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					90% {
						opacity: 1;
					}
					100% {
						transform: translateZ(1000px) scale(4) translateY(-100%);
						opacity: 0;
					}
				}
				.animate-falling-star {
					animation: falling-star linear infinite;
					animation-duration: ${3 / dustSpeed}s;
				}
				@keyframes glow {
					0% {
						transform: scale(1);
						opacity: 0.3;
						box-shadow: 0 0 2px 1px rgba(255, 255, 255, 0.3);
					}
					50% {
						transform: scale(3);
						opacity: 0.8;
						box-shadow: 0 0 10px 4px rgba(255, 255, 255, 0.6);
					}
					100% {
						transform: scale(1);
						opacity: 0.3;
						box-shadow: 0 0 2px 1px rgba(255, 255, 255, 0.3);
					}
				}
				.animate-glow {
					animation: glow 3s ease-in-out infinite;
				}
				@keyframes shooting-star {
					0% {
						transform: translateX(0) translateY(0) rotate(-45deg);
						opacity: 1;
					}
					100% {
						transform: translateX(-200px) translateY(200px)
							rotate(-45deg);
						opacity: 0;
					}
				}
				.animate-shooting-star {
					animation: shooting-star 4s linear infinite;
				}
				@keyframes float-ship {
					0% {
						transform: translate(0, 0);
					}
					25% {
						transform: translate(100px, -30px);
					}
					50% {
						transform: translate(50px, -80px);
					}
					75% {
						transform: translate(-50px, -50px);
					}
					100% {
						transform: translate(0, 0);
					}
				}
				.animate-float-ship {
					animation: float-ship 12s ease-in-out infinite;
				}
				@keyframes float-around {
					0% {
						transform: translate(10%, 10%) rotate(0deg);
					}
					25% {
						transform: translate(80%, 20%) rotate(90deg);
					}
					50% {
						transform: translate(60%, 70%) rotate(180deg);
					}
					75% {
						transform: translate(20%, 50%) rotate(270deg);
					}
					100% {
						transform: translate(10%, 10%) rotate(360deg);
					}
				}
				.animate-float-around {
					animation: float-around 20s ease-in-out infinite;
				}
				@keyframes float-asteroid {
					0% {
						transform: translate(0, 0) rotate(0deg);
					}
					25% {
						transform: translate(100px, 30px) rotate(45deg);
					}
					50% {
						transform: translate(50px, 80px) rotate(90deg);
					}
					75% {
						transform: translate(-50px, 50px) rotate(135deg);
					}
					100% {
						transform: translate(0, 0) rotate(180deg);
					}
				}
				.animate-float-asteroid {
					animation: float-asteroid 25s ease-in-out infinite;
				}
				@keyframes float-asteroid-1 {
					0% {
						transform: translate(0, 0) rotate(0deg);
					}
					50% {
						transform: translate(40px, 20px) rotate(45deg);
					}
					100% {
						transform: translate(0, 0) rotate(90deg);
					}
				}
				@keyframes float-asteroid-2 {
					0% {
						transform: translate(0, 0) rotate(0deg);
					}
					50% {
						transform: translate(-30px, 30px) rotate(-45deg);
					}
					100% {
						transform: translate(0, 0) rotate(-90deg);
					}
				}
				@keyframes float-asteroid-3 {
					0% {
						transform: translate(0, 0) rotate(0deg);
					}
					50% {
						transform: translate(20px, -20px) rotate(30deg);
					}
					100% {
						transform: translate(0, 0) rotate(60deg);
					}
				}
				@keyframes float-asteroid-4 {
					0% {
						transform: translate(0, 0) rotate(0deg);
					}
					50% {
						transform: translate(-40px, -20px) rotate(-30deg);
					}
					100% {
						transform: translate(0, 0) rotate(-60deg);
					}
				}
				@keyframes float-asteroid-5 {
					0% {
						transform: translate(0, 0) rotate(0deg);
					}
					50% {
						transform: translate(30px, -30px) rotate(45deg);
					}
					100% {
						transform: translate(0, 0) rotate(90deg);
					}
				}
				@keyframes float-asteroid-6 {
					0% {
						transform: translate(0, 0) rotate(0deg);
					}
					50% {
						transform: translate(-20px, 20px) rotate(-30deg);
					}
					100% {
						transform: translate(0, 0) rotate(-60deg);
					}
				}
				@keyframes float-asteroid-7 {
					0% {
						transform: translate(0, 0) rotate(0deg);
					}
					50% {
						transform: translate(30px, 30px) rotate(45deg);
					}
					100% {
						transform: translate(0, 0) rotate(90deg);
					}
				}
				@keyframes float-asteroid-8 {
					0% {
						transform: translate(0, 0) rotate(0deg);
					}
					50% {
						transform: translate(-30px, -30px) rotate(-45deg);
					}
					100% {
						transform: translate(0, 0) rotate(-90deg);
					}
				}
				.animate-float-asteroid-1 {
					animation: float-asteroid-1 15s ease-in-out infinite;
				}
				.animate-float-asteroid-2 {
					animation: float-asteroid-2 18s ease-in-out infinite;
				}
				.animate-float-asteroid-3 {
					animation: float-asteroid-3 20s ease-in-out infinite;
				}
				.animate-float-asteroid-4 {
					animation: float-asteroid-4 16s ease-in-out infinite;
				}
				.animate-float-asteroid-5 {
					animation: float-asteroid-5 19s ease-in-out infinite;
				}
				.animate-float-asteroid-6 {
					animation: float-asteroid-6 17s ease-in-out infinite;
				}
				.animate-float-asteroid-7 {
					animation: float-asteroid-7 21s ease-in-out infinite;
				}
				.animate-float-asteroid-8 {
					animation: float-asteroid-8 14s ease-in-out infinite;
				}
				@keyframes comet-1 {
					0% {
						transform: translate(calc(100vw + 100px), 0)
							rotate(60deg);
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					30% {
						transform: translate(calc(100vw + 100px), 50px)
							rotate(45deg);
					}
					50% {
						transform: translate(calc(100vw + 100px), 25px)
							rotate(30deg);
					}
					70% {
						transform: translate(0, 250px) rotate(30deg);
					}
					90% {
						opacity: 1;
					}
					100% {
						transform: translate(0, 0) rotate(45deg);
						opacity: 0;
					}
				}
				@keyframes comet-2 {
					0% {
						transform: translate(calc(100vw + 100px), 0)
							rotate(45deg);
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					90% {
						opacity: 1;
					}
					100% {
						transform: translate(-100px, 100px) rotate(45deg);
						opacity: 0;
					}
				}
				@keyframes comet-trail-1 {
					0% {
						opacity: 0;
						transform: scale(0.5);
					}
					10% {
						opacity: 1;
						transform: scale(1);
					}
					90% {
						opacity: 1;
						transform: scale(1);
					}
					100% {
						opacity: 0;
						transform: scale(0.5);
					}
				}
				@keyframes comet-trail-2 {
					0% {
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					90% {
						opacity: 1;
					}
					100% {
						opacity: 0;
					}
				}
				.animate-comet-1 {
					animation: comet-1 8s linear infinite;
				}
				.animate-comet-2 {
					animation: comet-2 3s linear infinite;
				}
				.animate-comet-trail-1 {
					animation: comet-trail-1 3s linear infinite;
				}
				.animate-comet-trail-2 {
					animation: comet-trail-2 3s linear infinite;
				}
				@keyframes planet-glow {
					0% {
						opacity: 0.8;
						transform: scale(1);
					}
					50% {
						opacity: 1;
						transform: scale(1.05);
					}
					100% {
						opacity: 0.8;
						transform: scale(1);
					}
				}
				.animate-planet-glow {
					animation: planet-glow 4s ease-in-out infinite;
				}
				.transform-style-3d {
					transform-style: preserve-3d;
				}
				.perspective-1000 {
					perspective: 1000px;
				}
			`}</style>
		</section>
	);
}
