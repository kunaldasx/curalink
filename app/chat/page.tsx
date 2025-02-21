"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
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
	Sparkles,
	Trash2,
} from "lucide-react";
import { chat } from "@/utils/ai";

interface Message {
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

export default function AIChat() {
	const { data: session } = useSession();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const userRole = (session?.user as any)?.role || "patient";

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height =
				textareaRef.current.scrollHeight + "px";
		}
	}, [input]);

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
			// Convert messages to conversation history format
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
					"I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
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

	const clearChat = () => {
		setMessages([]);
	};

	const suggestedPrompts =
		userRole === "patient"
			? [
					"What should I ask my doctor about clinical trials?",
					"How do I know if a trial is right for me?",
					"What are the benefits and risks of joining a trial?",
					"Can you explain what a placebo is?",
			  ]
			: [
					"How can I make my trial more patient-friendly?",
					"What are best practices for informed consent?",
					"How do I improve patient retention in trials?",
					"What should I consider for remote trial visits?",
			  ];

	return (
		<div className="max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col">
			{/* Header */}
			<div className="mb-4 p-6 rounded-3xl bg-gradient-to-br from-medical-teal-50 via-medical-indigo-50 to-medical-lavender-50 border border-medical-teal-100 shadow-lg">
				<div className="flex items-center justify-between">
					<div>
						<h1
							className="text-3xl font-bold mb-2"
							style={{
								background:
									"linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #a855f7 100%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							AI Chat Assistant
						</h1>
						<p className="text-gray-700">
							{userRole === "patient"
								? "💬 Ask me anything about clinical trials and treatments"
								: "💬 Get help with patient-centered research practices"}
						</p>
					</div>
					<Badge
						className={`px-4 py-2 ${
							userRole === "patient"
								? "bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500"
								: "bg-gradient-to-r from-blue-500 to-purple-500"
						} text-white`}
					>
						{userRole === "patient" ? "Patient Mode" : "Researcher Mode"}
					</Badge>
				</div>
			</div>

			{/* Chat Messages */}
			<Card className="flex-1 mb-4 rounded-2xl shadow-lg border-0 flex flex-col overflow-hidden">
				<CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
					{messages.length === 0 && (
						<div className="text-center py-12">
							<div className="inline-block p-4 rounded-full bg-gradient-to-br from-medical-teal-50 to-medical-indigo-50 mb-4">
								<Sparkles className="h-12 w-12 text-medical-teal-500" />
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-800">
								Start a Conversation
							</h3>
							<p className="text-gray-600 mb-6">
								{userRole === "patient"
									? "I'm here to help you understand clinical trials, medical information, and your healthcare journey."
									: "I can help you with trial design, patient engagement, and research best practices."}
							</p>
							<div className="space-y-2">
								<p className="text-sm text-gray-500 mb-3">Try asking:</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-3xl mx-auto">
									{suggestedPrompts.map((prompt, i) => (
										<Button
											key={i}
											variant="outline"
											size="sm"
											onClick={() => setInput(prompt)}
											className="text-left justify-start h-auto py-3 px-4 rounded-xl hover:bg-medical-teal-50 hover:border-medical-teal-300 transition-all"
										>
											<MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
											<span className="text-sm">{prompt}</span>
										</Button>
									))}
								</div>
							</div>
						</div>
					)}

					{messages.map((msg, i) => (
						<div
							key={i}
							className={`flex gap-3 ${
								msg.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							{msg.role === "assistant" && (
								<div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-medical-teal-500 to-medical-indigo-500 flex items-center justify-center shadow-md">
									<Bot className="h-5 w-5 text-white" />
								</div>
							)}
							<div
								className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
									msg.role === "user"
										? "bg-gradient-to-br from-medical-teal-500 to-medical-indigo-500 text-white"
										: "bg-white border border-gray-200"
								}`}
							>
								<p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
									{msg.content}
								</p>
								<p
									className={`text-xs mt-2 ${
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
								<div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-medical-lavender-500 to-medical-indigo-500 flex items-center justify-center shadow-md">
									<User className="h-5 w-5 text-white" />
								</div>
							)}
						</div>
					))}

					{loading && (
						<div className="flex gap-3 justify-start">
							<div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-medical-teal-500 to-medical-indigo-500 flex items-center justify-center shadow-md">
								<Bot className="h-5 w-5 text-white" />
							</div>
							<div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
								<Loader2 className="h-5 w-5 animate-spin text-medical-teal-500" />
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</CardContent>
			</Card>

			{/* Input Area */}
			<Card className="rounded-2xl shadow-lg border-0">
				<CardContent className="p-4">
					<div className="flex gap-2">
						<Textarea
							ref={textareaRef}
							placeholder={
								userRole === "patient"
									? "Ask me anything about clinical trials..."
									: "Ask about trial design, recruitment, or patient engagement..."
							}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							className="min-h-[60px] max-h-[200px] rounded-xl resize-none"
							rows={1}
						/>
						<div className="flex flex-col gap-2">
							<Button
								onClick={handleSend}
								disabled={loading || !input.trim()}
								className="h-[60px] px-6 rounded-xl bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50"
							>
								{loading ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<Send className="h-5 w-5" />
								)}
							</Button>
							{messages.length > 0 && (
								<Button
									variant="outline"
									size="icon"
									onClick={clearChat}
									className="rounded-xl"
									title="Clear chat"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
					<p className="text-xs text-gray-500 mt-2">
						💡 Press Enter to send, Shift+Enter for new line
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
