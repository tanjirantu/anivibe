"use client";

import { useEffect, useState } from "react";

interface HyperJumpProps {
	children: React.ReactNode;
	duration?: number;
}

export function HyperJump({ children, duration = 2000 }: HyperJumpProps) {
	const [isJumping, setIsJumping] = useState(false);

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
						{Array.from({ length: 200 }).map((_, i) => (
							<div
								key={i}
								className="absolute w-1 h-1 bg-white rounded-full"
								style={{
									left: `${Math.random() * 100}%`,
									top: `${Math.random() * 100}%`,
									transform: `translateZ(${
										Math.random() * 2000
									}px)`,
									animation: `hyperspace ${duration}ms linear forwards`,
									animationDelay: `${Math.random() * 100}ms`,
								}}
							/>
						))}
					</div>
					{/* Light streaks */}
					<div className="absolute inset-0 overflow-hidden">
						{Array.from({ length: 30 }).map((_, i) => (
							<div
								key={i}
								className="absolute h-full w-1 bg-blue-400/50"
								style={{
									left: `${Math.random() * 100}%`,
									transform: `translateZ(${
										Math.random() * 2000
									}px)`,
									animation: `hyperspaceStreak ${duration}ms linear forwards`,
									animationDelay: `${Math.random() * 100}ms`,
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
