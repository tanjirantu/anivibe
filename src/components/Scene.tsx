"use client";

import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Articles } from "./Articles";
import { ThemeProvider } from "../context/ThemeContext";
import { Chatbot } from "./Chatbot";

export function Scene() {
	return (
		<ThemeProvider>
			<div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
				<Navbar />
				<Hero />
				<Articles />
				{/* <Chatbot /> */}
			</div>
		</ThemeProvider>
	);
}
