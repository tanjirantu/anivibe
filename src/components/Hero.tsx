"use client";

import { BB8_2D } from "./BB8_2D";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Starfighter from "./Starfighter";

export function Hero() {
	const [stars, setStars] = useState<
		Array<{
			top: string;
			left: string;
			opacity: number;
			delay: string;
			speed: number;
			isGlowing: boolean;
			glowDelay: string;
		}>
	>([]);
	const [shootingStars, setShootingStars] = useState<
		Array<{ top: string; left: string; delay: string }>
	>([]);
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [isCursorInHero, setIsCursorInHero] = useState(false);
	const [isCursorInNavbar, setIsCursorInNavbar] = useState(false);
	const heroRef = useRef<HTMLElement>(null);

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
		// Generate stars data
		const starsData = Array.from({ length: 50 }, () => ({
			top: `${Math.random() * 100}%`,
			left: `${Math.random() * 100}%`,
			opacity: Math.random() * 0.9 + 0.1,
			delay: `${Math.random() * 3}s`,
			speed: Math.random() * 2 + 1,
			isGlowing: Math.random() < 0.2,
			glowDelay: `${Math.random() * 5}s`,
		}));

		const shootingStarsData = Array.from({ length: 3 }, (_, i) => ({
			top: `${Math.random() * 50}%`,
			left: `${Math.random() * 100}%`,
			delay: `${i * 2}s`,
		}));

		setStars(starsData);
		setShootingStars(shootingStarsData);

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);

	return (
		<section
			ref={heroRef}
			className="relative h-[calc(100vh-32rem)] overflow-hidden cursor-none"
		>
			{/* Custom Cursor */}
			{isCursorInHero && !isCursorInNavbar && (
				<div
					className="fixed pointer-events-none z-50"
					style={{
						transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
						transition: "transform 0.1s ease-out",
					}}
				>
					<Starfighter x={0} y={0} scale={0.6} rotation={0} />
				</div>
			)}

			{/* Galaxy Background */}
			<div className="absolute inset-0 z-0">
				{/* Deep Space */}
				<div className="absolute inset-0 bg-gradient-to-b from-[#090921] via-[#161B33] to-[#0F1644]" />

				{/* Stars Layer */}
				<div className="absolute inset-0">
					{stars.map((star, i) => (
						<div key={`star-${i}`}>
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

				{/* Shooting Stars */}
				<div className="absolute inset-0">
					{shootingStars.map((star, i) => (
						<div
							key={i}
							className="absolute w-[100px] h-[1px] bg-white transform -rotate-45 animate-shooting-star"
							style={{
								top: star.top,
								left: star.left,
								animationDelay: star.delay,
							}}
						/>
					))}
				</div>

				{/* Cosmic Dust */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.3)_70%,_rgba(0,0,0,0.4)_100%)]" />

				{/* Floating Satellite */}
				<div className="absolute top-[15%] right-[55%] w-[48px] h-[48px] animate-float-around">
					<img
						src="/assets/space_satellite.png"
						alt="Satellite"
						className="w-full h-full object-contain"
					/>
				</div>

				{/* Floating Alien Ship */}
				<div className="absolute top-[25%] right-[35%] w-[48px] h-[48px] animate-float-ship">
					<img
						src="/assets/alien_ship.png"
						alt="Alien Ship"
						className="w-full h-full object-contain"
					/>
				</div>

				{/* Fixed Purple Star */}
				{/* <div className="absolute top-[30%] right-[15%] w-[150px] h-[150px]">
					<img
						src="/assets/purple_star.png"
						alt="Purple Star"
						className="w-full h-full object-contain"
					/>
				</div> */}

				{/* Floating Asteroid */}
				<div className="absolute top-[60%] left-[30%] w-[32px] h-[32px] animate-float-asteroid">
					<img
						src="/assets/astroid_01.png"
						alt="Asteroid"
						className="w-full h-full object-contain"
					/>
				</div>

				{/* Asteroid Group 1 */}
				<div className="absolute top-[40%] left-[15%] w-[24px] h-[24px] animate-float-asteroid-1">
					<img
						src="/assets/astroid_01.png"
						alt="Asteroid"
						className="w-full h-full object-contain"
					/>
				</div>
				<div className="absolute top-[45%] left-[18%] w-[20px] h-[20px] animate-float-asteroid-2">
					<img
						src="/assets/astroid_01.png"
						alt="Asteroid"
						className="w-full h-full object-contain"
					/>
				</div>
				<div className="absolute top-[38%] left-[20%] w-[28px] h-[28px] animate-float-asteroid-3">
					<img
						src="/assets/astroid_01.png"
						alt="Asteroid"
						className="w-full h-full object-contain"
					/>
				</div>

				{/* Asteroid Group 2 */}
				<div className="absolute top-[70%] right-[25%] w-[18px] h-[18px] animate-float-asteroid-4">
					<img
						src="/assets/astroid_01.png"
						alt="Asteroid"
						className="w-full h-full object-contain"
					/>
				</div>
				<div className="absolute top-[75%] right-[28%] w-[16px] h-[16px] animate-float-asteroid-5">
					<img
						src="/assets/astroid_01.png"
						alt="Asteroid"
						className="w-full h-full object-contain"
					/>
				</div>
				<div className="absolute top-[72%] right-[22%] w-[12px] h-[12px] animate-float-asteroid-6">
					<img
						src="/assets/astroid_01.png"
						alt="Asteroid"
						className="w-full h-full object-contain"
					/>
				</div>

				{/* Comet 1 */}
				<div className="absolute top-0 left-[-40px] w-[40px] h-[40px] animate-comet-1">
					<img
						src="/assets/comet_04.png"
						alt="Comet"
						className="w-full h-full object-contain"
					/>
					<div className="absolute inset-0 w-full h-full bg-white/30 blur-[20px] animate-comet-trail-1"></div>
				</div>

				{/* Planets */}
				<div className="absolute top-[15%] left-[10%] w-[40px] h-[40px] animate-planet-glow">
					<img
						src="/assets/planet_02.png"
						alt="Planet"
						className="w-full h-full object-contain"
					/>
					<div className="absolute inset-0 w-full h-full bg-blue-500/20 blur-[20px] rounded-full"></div>
				</div>

				<div className="absolute top-[60%] right-[15%] w-[100px] h-[100px] animate-planet-glow">
					<img
						src="/assets/planet_03.png"
						alt="Planet"
						className="w-full h-full object-contain"
					/>
					<div className="absolute inset-0 w-full h-full bg-purple-500/20 blur-[30px] rounded-full"></div>
				</div>

				<div className="absolute top-[30%] right-[30%] w-[120px] h-[120px] animate-planet-glow">
					<img
						src="/assets/planet_04.png"
						alt="Planet"
						className="w-full h-full object-contain"
					/>
					<div className="absolute inset-0 w-full h-full bg-orange-500/20 blur-[20px] rounded-full"></div>
				</div>

				<div className="absolute top-[70%] left-[25%] w-[90px] h-[90px] animate-planet-glow">
					<img
						src="/assets/planet_05.png"
						alt="Planet"
						className="w-full h-full object-contain"
					/>
					<div className="absolute inset-0 w-full h-full bg-green-500/20 blur-[20px] rounded-full"></div>
				</div>
			</div>

			{/* Content */}
			<div className="h-full relative z-10 grid lg:grid-cols-2 gap-8 container mx-auto px-4">
				{/* Left Column - Text */}
				<div className="flex flex-col justify-center space-y-6">
					<div className="relative">
						<div className="absolute -left-8 top-0 bottom-0 w-1 bg-yellow-400"></div>
						<h1 className="text-5xl font-bold text-yellow-400 drop-shadow-lg font-star-wars tracking-wider">
							"Do or do not, there is no try"
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
				</div>

				{/* Right Column - Starfighter */}
				<div className="hidden lg:flex items-center justify-center relative">
					{/* <Starfighter x={400} y={400} scale={1.2} rotation={0} /> */}
				</div>
			</div>

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
						transform: translateY(-100vh);
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					90% {
						opacity: 1;
					}
					100% {
						transform: translateY(100vh);
						opacity: 0;
					}
				}
				.animate-falling-star {
					animation: falling-star linear infinite;
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
			`}</style>
		</section>
	);
}
