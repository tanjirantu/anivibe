import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";

// Define the SandParticle type
interface SandParticle {
	x: number;
	y: number;
	z: number;
	speed: number;
	size: number;
	drift: number;
	color: string;
}

function randomSandParticle(width: number, height: number) {
	// Start near the horizon (bottom or far side)
	const angle = Math.random() * Math.PI * 2;
	const radius = width * 0.4 + Math.random() * width * 0.2;
	return {
		x: width / 2 + Math.cos(angle) * radius,
		y: height * 0.95 + Math.sin(angle) * 30,
		z: Math.random() * 1, // 0 = far, 1 = near
		speed: 0.003 + Math.random() * 0.004,
		size: 8 + Math.random() * 16,
		drift: (Math.random() - 0.5) * 0.5,
		color: `rgba(237, 201, 175, ${0.15 + Math.random() * 0.15})`,
	};
}

const SAND_PARTICLE_COUNT = 120;

function SandstormCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const particlesRef = useRef<SandParticle[]>([]);
	const sizeRef = useRef({ width: 0, height: 0 });

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
			// Re-init particles
			particlesRef.current = Array.from(
				{ length: SAND_PARTICLE_COUNT },
				() => randomSandParticle(width, height)
			);
		}
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		function draw() {
			const { width, height } = sizeRef.current;
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);
			// Draw fog overlay
			const fogGradient = ctx.createLinearGradient(0, height, 0, 0);
			fogGradient.addColorStop(0, "rgba(237, 201, 175, 0.7)");
			fogGradient.addColorStop(1, "rgba(237, 201, 175, 0.05)");
			ctx.fillStyle = fogGradient;
			ctx.fillRect(0, 0, width, height);
			// Animate and draw particles
			for (const p of particlesRef.current) {
				// Move particle toward viewer (upward and slightly forward)
				p.y -= (1.5 + p.z * 2) * p.speed * height;
				p.x +=
					Math.sin(Date.now() * 0.0005 + p.drift) * 0.5 * (1 + p.z);
				p.z += p.speed * 0.5;
				// Respawn if out of view
				if (p.y < -p.size || p.z > 1.2) {
					Object.assign(p, randomSandParticle(width, height));
				}
				// Draw
				if (!ctx) continue;
				ctx.save();
				ctx.beginPath();
				ctx.ellipse(
					p.x,
					p.y,
					p.size * (0.5 + p.z),
					p.size * (0.2 + p.z * 0.7),
					0,
					0,
					Math.PI * 2
				);
				ctx.fillStyle = p.color;
				ctx.globalAlpha = 0.5 + 0.5 * p.z;
				ctx.filter = `blur(${1 + 2 * p.z}px)`;
				ctx.fill();
				ctx.globalAlpha = 1;
				ctx.filter = "none";
				ctx.restore();
			}
			requestAnimationFrame(draw);
		}
		requestAnimationFrame(draw);
		return () => {};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: "absolute",
				inset: 0,
				width: "100%",
				height: "100%",
				zIndex: 1,
				pointerEvents: "none",
				display: "block",
			}}
			aria-hidden="true"
		/>
	);
}

// function TatooineHomeModel() {
// 	// const { scene } = useGLTF("/assets/tatooine_home.glb");
// 	// return <primitive object={null} scale={0.15} position={[-3, -0.5, 0.5]} />;
// }

// Draw a wavy desert surface (dunes) at the bottom using canvas
function DesertSurfaceCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sizeRef = useRef({ width: 0, height: 0 });

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
		}
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		function draw() {
			const { width, height } = sizeRef.current;
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);
			// Draw 3-4 wavy dunes
			for (let i = 0; i < 4; i++) {
				if (!ctx) continue;
				const duneHeight = 80 + i * 30;
				ctx.beginPath();
				ctx.moveTo(0, height - duneHeight);
				for (let x = 0; x <= width; x += 10) {
					if (!ctx) continue;
					const wave =
						Math.sin((x / width) * Math.PI * 2 + i) * (18 - i * 3);
					ctx.lineTo(x, height - duneHeight - wave);
				}
				ctx.lineTo(width, height);
				ctx.lineTo(0, height);
				ctx.closePath();
				const duneColor = `rgba(${237 - i * 10}, ${201 - i * 8}, ${
					175 - i * 12
				}, ${0.7 - i * 0.1})`;
				ctx.fillStyle = duneColor;
				ctx.filter = `blur(${i}px)`;
				ctx.fill();
				ctx.filter = "none";
			}
			requestAnimationFrame(draw);
		}
		requestAnimationFrame(draw);
		return () => {};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 0,
				width: "100%",
				height: "100%",
				zIndex: 2,
				pointerEvents: "none",
				display: "block",
			}}
			aria-hidden="true"
		/>
	);
}

// Draw stylized desert mountains behind the buildings using canvas
function MountainsCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sizeRef = useRef({ width: 0, height: 0 });

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
		}
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		function drawMountains() {
			const { width, height } = sizeRef.current;
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);
			// Draw 2 layers of far mountains with smooth ridges
			const mountainColors = ["#b08d57", "#a77c4f"];
			for (let layer = 0; layer < 2; layer++) {
				if (!ctx) continue;
				ctx.save();
				ctx.beginPath();
				// Lower base for far look
				const baseY = height * (0.62 + layer * 0.06);
				ctx.moveTo(0, baseY);
				// Use smooth control points for the ridge
				const points = [];
				const numPeaks = 5 + layer * 2;
				for (let i = 0; i <= numPeaks; i++) {
					const x = (i / numPeaks) * width;
					// Lower, wider, and smoother peaks
					const y =
						baseY -
						(Math.sin(i + layer) * 18 +
							Math.cos(i * 0.7 + layer) * 22 +
							40 +
							layer * 18 +
							Math.random() * 10);
					points.push([x, y]);
				}
				// Draw smooth curve through points
				for (let i = 0; i < points.length - 1; i++) {
					const [x1, y1] = points[i];
					const [x2, y2] = points[i + 1];
					const cx = (x1 + x2) / 2;
					const cy = (y1 + y2) / 2;
					ctx.quadraticCurveTo(x1, y1, cx, cy);
				}
				ctx.lineTo(width, height);
				ctx.lineTo(0, height);
				ctx.closePath();
				ctx.fillStyle = mountainColors[layer];
				ctx.globalAlpha = 0.35 - layer * 0.1;
				ctx.filter = `blur(${1 + layer}px)`;
				ctx.fill();
				ctx.globalAlpha = 1;
				ctx.filter = "none";
				ctx.restore();
			}
			// Add atmospheric gradient for distance
			const grad = ctx.createLinearGradient(
				0,
				height * 0.6,
				0,
				height * 0.8
			);
			grad.addColorStop(0, "rgba(255, 236, 200, 0.18)");
			grad.addColorStop(1, "rgba(237, 201, 175, 0.0)");
			ctx.fillStyle = grad;
			ctx.fillRect(0, height * 0.5, width, height * 0.5);
		}
		drawMountains();
		// Only need to draw once unless resizing
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 0,
				width: "100%",
				height: "100%",
				zIndex: 0.5,
				pointerEvents: "none",
				display: "block",
			}}
			aria-hidden="true"
		/>
	);
}

export function DesertView() {
	return (
		<div
			className="absolute inset-0 w-full h-full flex items-center justify-center"
			style={{
				background:
					"linear-gradient(to top, #f7e9b0 60%, #e2c275 100%)",
			}}
		>
			{/* Mountains behind the buildings */}
			<MountainsCanvas />
			{/* 3D Tatooine Home Model */}
			<Canvas
				style={{ position: "absolute", inset: 0, zIndex: 0 }}
				camera={{ position: [2, 1.2, 3], fov: 50 }}
			>
				<ambientLight intensity={1.2} />
				<directionalLight
					position={[2, 5, 5]}
					intensity={1.2}
					color="#fffbe0"
				/>
				{/* Optionally allow orbit controls for debug: <OrbitControls enablePan={false} /> */}
			</Canvas>
			{/* Desert surface (dunes) */}
			<DesertSurfaceCanvas />
			{/* Sandstorm overlay */}
			<SandstormCanvas />
			{/* Placeholder text */}
			<h1 className="text-4xl font-bold text-yellow-900 drop-shadow-lg z-10">
				Desert View (Coming Soon)
			</h1>
		</div>
	);
}
