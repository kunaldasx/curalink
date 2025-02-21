"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	MessageSquare,
	Send,
	Loader2,
	Bot,
	User,
	X,
	Minimize2,
	Sparkles,
} from "lucide-react";
import { chat } from "@/utils/ai";

interface Message {
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

export default function FloatingAIChat() {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const userRole = (session?.user as any)?.role || "patient";

	// Scroll to bottom when messages change
	useEffect(() => {
		if (isOpen && !isMinimized) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isOpen, isMinimized]);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current && isOpen) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height =
				textareaRef.current.scrollHeight + "px";
		}
	}, [input, isOpen]);

	const handleSend = async () => {
		if (!input.trim() || loading) return;

		const userMessage: Message = {
			role: "user",
			content: input,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		try {
			const history = messages.map((msg) => ({
				role: msg.role === "user" ? "user" : "assistant",
				content: msg.content,
			}));

			const response = await chat(input, userRole, history);

			const assistantMessage: Message = {
				role: "assistant",
				content: response,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			console.error("Chat error:", error);
			const errorMessage: Message = {
				role: "assistant",
				content:
					"I'm sorry, I'm having trouble responding right now. Please try again.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const toggleOpen = () => {
		setIsOpen(!isOpen);
		setIsMinimized(false);
	};

	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);
	};

	const suggestedPrompts =
		userRole === "patient"
			? [
					"What should I know about clinical trials?",
					"How do I find the right trial?",
					"What is a placebo?",
			  ]
			: [
					"How can I improve patient recruitment?",
					"Best practices for informed consent?",
					"Patient retention strategies?",
			  ];

	if (!session) return null;

	return (
		<>
			{/* Floating Chat Button */}
			{!isOpen && (
				<button
					onClick={toggleOpen}
					className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-50 group animate-pulse hover:animate-none"
					aria-label="Open AI Chat"
				>
					<MessageSquare className="h-7 w-7 text-white" />
					<div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
						<Sparkles className="h-2.5 w-2.5 text-white" />
					</div>
				</button>
			)}

			{/* Chat Widget */}
			{isOpen && (
				<div
					className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
						isMinimized ? "w-80" : "w-96"
					}`}
					style={{ maxHeight: isMinimized ? "60px" : "600px" }}
				>
					<Card className="rounded-2xl shadow-2xl border-0 overflow-hidden flex flex-col h-full">
						{/* Header */}
						<CardHeader className="bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 text-white p-4 flex-shrink-0">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
										<Bot className="h-5 w-5" />
									</div>
									<div>
										<CardTitle className="text-base font-semibold">
											AI Assistant
										</CardTitle>
										<Badge
											variant="secondary"
											className="text-xs bg-white/20 text-white border-0 mt-1"
										>
											{userRole === "patient" ? "Patient" : "Researcher"}
										</Badge>
									</div>
								</div>
								<div className="flex items-center gap-1">
									<Button
										size="icon"
										variant="ghost"
										onClick={toggleMinimize}
										className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
									>
										<Minimize2 className="h-4 w-4" />
									</Button>
									<Button
										size="icon"
										variant="ghost"
										onClick={toggleOpen}
										className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardHeader>

						{/* Chat Content */}
						{!isMinimized && (
							<>
								{/* Messages */}
								<CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-[300px] max-h-[400px]">
									{messages.length === 0 && (
										<div className="text-center py-6">
											<div className="inline-block p-3 rounded-full bg-gradient-to-br from-medical-teal-50 to-medical-indigo-50 mb-3">
												<Sparkles className="h-8 w-8 text-medical-teal-500" />
											</div>
											<h3 className="text-sm font-semibold mb-2 text-gray-800">
												How can I help?
											</h3>
											<p className="text-xs text-gray-600 mb-3">
												{userRole === "patient"
													? "Ask about trials, treatments, or conditions"
													: "Ask about trial design or recruitment"}
											</p>
											<div className="space-y-1.5">
												{suggestedPrompts.map((prompt, i) => (
													<Button
														key={i}
														variant="outline"
														size="sm"
														onClick={() => setInput(prompt)}
														className="w-full text-left justify-start h-auto py-2 px-3 rounded-lg text-xs hover:bg-medical-teal-50 hover:border-medical-teal-300"
													>
														{prompt}
													</Button>
												))}
											</div>
										</div>
									)}

									{messages.map((msg, i) => (
										<div
											key={i}
											className={`flex gap-2 ${
												msg.role === "user" ? "justify-end" : "justify-start"
											}`}
										>
											{msg.role === "assistant" && (
												<div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-medical-teal-500 to-medical-indigo-500 flex items-center justify-center">
													<Bot className="h-4 w-4 text-white" />
												</div>
											)}
											<div
												className={`max-w-[75%] rounded-xl p-3 shadow-sm ${
													msg.role === "user"
														? "bg-gradient-to-br from-medical-teal-500 to-medical-indigo-500 text-white"
														: "bg-white border border-gray-200"
												}`}
											>
												<p className="text-xs leading-relaxed whitespace-pre-wrap">
													{msg.content}
												</p>
												<p
													className={`text-[10px] mt-1 ${
														msg.role === "user"
															? "text-white/70"
															: "text-gray-500"
													}`}
												>
													{msg.timestamp.toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
											</div>
											{msg.role === "user" && (
												<div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-medical-lavender-500 to-medical-indigo-500 flex items-center justify-center">
													<User className="h-4 w-4 text-white" />
												</div>
											)}
										</div>
									))}

									{loading && (
										<div className="flex gap-2 justify-start">
											<div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-medical-teal-500 to-medical-indigo-500 flex items-center justify-center">
												<Bot className="h-4 w-4 text-white" />
											</div>
											<div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
												<Loader2 className="h-4 w-4 animate-spin text-medical-teal-500" />
											</div>
										</div>
									)}

									<div ref={messagesEndRef} />
								</CardContent>

								{/* Input Area */}
								<div className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
									<div className="flex gap-2">
										<Textarea
											ref={textareaRef}
											placeholder="Type your message..."
											value={input}
											onChange={(e) => setInput(e.target.value)}
											onKeyPress={handleKeyPress}
											className="min-h-[40px] max-h-[100px] rounded-lg resize-none text-sm"
											rows={1}
										/>
										<Button
											onClick={handleSend}
											disabled={loading || !input.trim()}
											size="icon"
											className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white"
										>
											{loading ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<Send className="h-4 w-4" />
											)}
										</Button>
									</div>
									<p className="text-[10px] text-gray-500 mt-1.5">
										Press Enter to send
									</p>
								</div>
							</>
						)}
					</Card>
				</div>
			)}
		</>
	);
}
