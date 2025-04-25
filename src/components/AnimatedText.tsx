"use client";

import { useEffect, useState } from "react";

interface AnimatedTextProps {
	text: string;
	typingSpeed?: number;
	erasingSpeed?: number;
	delay?: number;
}

export function AnimatedText({
	text,
	typingSpeed = 100,
	erasingSpeed = 50,
	delay = 1000,
}: AnimatedTextProps) {
	const [displayedText, setDisplayedText] = useState("");
	const [isTyping, setIsTyping] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (isTyping) {
			if (displayedText.length < text.length) {
				timeout = setTimeout(() => {
					setDisplayedText(text.slice(0, displayedText.length + 1));
				}, typingSpeed);
			} else {
				timeout = setTimeout(() => {
					setIsTyping(false);
					setIsDeleting(true);
				}, delay);
			}
		} else if (isDeleting) {
			if (displayedText.length > 0) {
				timeout = setTimeout(() => {
					setDisplayedText(text.slice(0, displayedText.length - 1));
				}, erasingSpeed);
			} else {
				timeout = setTimeout(() => {
					setIsDeleting(false);
					setIsTyping(true);
				}, delay);
			}
		}

		return () => clearTimeout(timeout);
	}, [
		displayedText,
		isTyping,
		isDeleting,
		text,
		typingSpeed,
		erasingSpeed,
		delay,
	]);

	return (
		<span className="relative">
			{displayedText}
			<span className="animate-pulse">|</span>
		</span>
	);
}
