"use client";

import { Hero } from "./Hero";
import { ThemeProvider } from "../context/ThemeContext";

export function Scene() {
	return (
		<ThemeProvider>
			<div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
				{/* <Navbar /> */}
				<Hero />
				{/* <Articles /> */}
			</div>
		</ThemeProvider>
	);
}
