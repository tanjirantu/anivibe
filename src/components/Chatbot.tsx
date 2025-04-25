"use client";

import { useState } from "react";

interface Message {
	id: number;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
}

export function Chatbot() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const handleSendMessage = () => {
		if (input.trim() === "") return;

		// Add user message
		const userMessage: Message = {
			id: 1,
			text: input,
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");

		// Simulate bot response (to be replaced with actual API call)
		setTimeout(() => {
			const botMessage: Message = {
				id: Date.now() + 1,
				text: "I'm a chatbot. How can I help you?",
				sender: "bot",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, botMessage]);
		}, 1000);
	};

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{/* Chat Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 shadow-lg transition-colors duration-200"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
					/>
				</svg>
			</button>

			{/* Chat Window */}
			{isOpen && (
				<div className="absolute bottom-16 right-0 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col transition-all duration-200">
					{/* Header */}
					<div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
						<h3 className="font-semibold text-gray-900 dark:text-white">
							Chat Assistant
						</h3>
						<button
							onClick={() => setIsOpen(false)}
							className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>

					{/* Messages */}
					<div className="flex-1 overflow-y-auto p-4 space-y-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.sender === "user"
										? "justify-end"
										: "justify-start"
								}`}
							>
								<div
									className={`max-w-[80%] rounded-lg p-3 ${
										message.sender === "user"
											? "bg-purple-500 text-white"
											: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
									}`}
								>
									<p className="text-sm">{message.text}</p>
									<p className="text-xs opacity-70 mt-1">
										{message.timestamp.toLocaleTimeString()}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Input */}
					<div className="p-4 border-t border-gray-200 dark:border-gray-700">
						<div className="flex gap-2">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && handleSendMessage()
								}
								placeholder="Type your message..."
								className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
							/>
							<button
								onClick={handleSendMessage}
								className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 transition-colors duration-200"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
