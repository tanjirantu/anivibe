"use client";

import React, { useState, useEffect } from "react";

interface HyperJumpProps {
	children: React.ReactNode;
	duration?: number;
}

interface StarData {
	left: number;
	top: number;
	z: number;
	delay: number;
}

interface StreakData {
	left: number;
	z: number;
	delay: number;
}

export function HyperJump({ children, duration = 2000 }: HyperJumpProps) {
	const [isJumping, setIsJumping] = useState(false);

	// Store random star and streak data in state to avoid hydration errors
	const [starData, setStarData] = useState<StarData[]>([]);
	const [streakData, setStreakData] = useState<StreakData[]>([]);

	useEffect(() => {
		setStarData(
			Array.from({ length: 200 }).map(() => ({
				left: Math.random() * 100,
				top: Math.random() * 100,
				z: Math.random() * 2000,
				delay: Math.random() * 100,
			}))
		);
		setStreakData(
			Array.from({ length: 30 }).map(() => ({
				left: Math.random() * 100,
				z: Math.random() * 2000,
				delay: Math.random() * 100,
			}))
		);
	}, [isJumping]);

	const startJump = () => {
		setIsJumping(true);
		setTimeout(() => setIsJumping(false), duration);
	};

	return (
		<div className="relative">
			{isJumping && (
				<div className="fixed inset-0 z-50 pointer-events-none perspective-1000">
					{/* Stars */}
					<div className="absolute inset-0 bg-black overflow-hidden">
						{starData.map((star, i) => (
							<div
								key={i}
								className="absolute w-1 h-1 bg-white rounded-full"
								style={{
									left: `${star.left}%`,
									top: `${star.top}%`,
									transform: `translateZ(${star.z}px)`,
									animation: `hyperspace ${duration}ms linear forwards`,
									animationDelay: `${star.delay}ms`,
								}}
							/>
						))}
					</div>
					{/* Light streaks */}
					<div className="absolute inset-0 overflow-hidden">
						{streakData.map((streak, i) => (
							<div
								key={i}
								className="absolute h-full w-1 bg-blue-400/50"
								style={{
									left: `${streak.left}%`,
									transform: `translateZ(${streak.z}px)`,
									animation: `hyperspaceStreak ${duration}ms linear forwards`,
									animationDelay: `${streak.delay}ms`,
								}}
							/>
						))}
					</div>
				</div>
			)}
			<div onClick={startJump} className="cursor-pointer">
				{children}
			</div>

			<style jsx global>{`
				.perspective-1000 {
					perspective: 1000px;
				}

				@keyframes hyperspace {
					0% {
						transform: translateZ(2000px) scale(0.1);
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					90% {
						opacity: 1;
					}
					100% {
						transform: translateZ(0) scale(2);
						opacity: 0;
					}
				}

				@keyframes hyperspaceStreak {
					0% {
						transform: translateZ(2000px) scaleX(0.1);
						opacity: 0;
					}
					10% {
						opacity: 0.8;
					}
					90% {
						opacity: 0.8;
					}
					100% {
						transform: translateZ(0) scaleX(20);
						opacity: 0;
					}
				}
			`}</style>
		</div>
	);
}
