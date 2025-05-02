import React, { useRef, useEffect } from "react";

interface StarfieldCanvasProps {
	starSpeed?: number;
	shake?: number; // 0 (no shake) to 1 (max shake)
}

interface Star {
	x: number;
	y: number;
	z: number;
	prevX: number;
	prevY: number;
}

const STAR_COUNT = 250;
const DEFAULT_STAR_SPEED = 0.0035;
const STAR_SIZE = 1.5;
const STAR_COLOR = "rgba(255,255,255,0.85)";

function randomStar(width: number, height: number): Star {
	// Place stars in a cube around the center
	return {
		x: (Math.random() - 0.5) * width,
		y: (Math.random() - 0.5) * height,
		z: Math.random() * width,
		prevX: 0,
		prevY: 0,
	};
}

export const StarfieldCanvas: React.FC<StarfieldCanvasProps> = ({
	starSpeed = DEFAULT_STAR_SPEED,
	shake = 0,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const animationRef = useRef<number | undefined>(undefined);
	const starsRef = useRef<Star[]>([]);
	const sizeRef = useRef({ width: 0, height: 0 });

	// Resize handler
	useEffect(() => {
		function handleResize() {
			const width = window.innerWidth;
			const height = window.innerHeight;
			sizeRef.current = { width, height };
			const canvas = canvasRef.current;
			if (canvas) {
				canvas.width = width;
				canvas.height = height;
			}
			// Re-initialize stars
			starsRef.current = Array.from({ length: STAR_COUNT }, () =>
				randomStar(width, height)
			);
		}
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Animation loop
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		function draw() {
			const { width, height } = sizeRef.current;
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);
			ctx.save();
			ctx.translate(width / 2, height / 2);
			// Add shake effect
			if (shake > 0) {
				const shakeX = (Math.random() - 0.5) * 20 * shake;
				const shakeY = (Math.random() - 0.5) * 20 * shake;
				ctx.translate(shakeX, shakeY);
			}
			for (const star of starsRef.current) {
				// Save previous projected position
				star.prevX = (star.x / star.z) * width * 0.5;
				star.prevY = (star.y / star.z) * width * 0.5;
				// Move star closer
				star.z -= starSpeed * width;
				if (star.z < 1) {
					// Reset star
					Object.assign(star, randomStar(width, height));
					star.z = width;
					star.prevX = (star.x / star.z) * width * 0.5;
					star.prevY = (star.y / star.z) * width * 0.5;
				}
				// Project to 2D
				const k = (width * 0.5) / star.z;
				const x = star.x * k;
				const y = star.y * k;
				// Draw star as a line (motion blur)
				ctx.beginPath();
				ctx.strokeStyle = STAR_COLOR;
				ctx.lineWidth = STAR_SIZE * (1.5 - star.z / width);
				ctx.moveTo(star.prevX, star.prevY);
				ctx.lineTo(x, y);
				ctx.stroke();
			}
			ctx.restore();
			animationRef.current = requestAnimationFrame(draw);
		}
		animationRef.current = requestAnimationFrame(draw);
		return () => {
			if (animationRef.current)
				cancelAnimationFrame(animationRef.current);
		};
	}, [starSpeed, shake]);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: "absolute",
				inset: 0,
				width: "100%",
				height: "100%",
				zIndex: 1, // Behind main content, above background
				pointerEvents: "none",
				display: "block",
			}}
			aria-hidden="true"
		/>
	);
};
