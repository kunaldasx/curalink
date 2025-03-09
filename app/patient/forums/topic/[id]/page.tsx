"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	ArrowLeft,
	Eye,
	MessageSquare,
	CheckCircle2,
	Pin,
	Calendar,
	User,
	Shield,
	Edit,
	Trash2,
	Loader2,
} from "lucide-react";

interface Topic {
	_id: string;
	title: string;
	content: string;
	category: any;
	authorId: any;
	authorRole: string;
	replyCount: number;
	viewCount: number;
	isResolved: boolean;
	isPinned: boolean;
	createdAt: string;
}

interface Reply {
	_id: string;
	content: string;
	authorId: any;
	isVerified: boolean;
	editedAt?: string;
	createdAt: string;
}

export default function TopicDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const [topic, setTopic] = useState<Topic | null>(null);
	const [replies, setReplies] = useState<Reply[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentUserId, setCurrentUserId] = useState("");

	useEffect(() => {
		fetchCurrentUser();
		fetchTopic();
	}, [params.id]);

	const fetchCurrentUser = async () => {
		try {
			const res = await fetch("/api/auth/me");
			const data = await res.json();
			setCurrentUserId(data.user?.id || "");
		} catch (error) {
			console.error("Get current user error:", error);
		}
	};

	const fetchTopic = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/forum/topics/${params.id}`);
			const data = await res.json();
			setTopic(data.topic);
			setReplies(data.replies || []);
		} catch (error) {
			console.error("Fetch topic error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		if (
			!confirm(
				"Are you sure you want to delete this question? This action cannot be undone."
			)
		) {
			return;
		}

		try {
			const res = await fetch(`/api/forum/topics/${params.id}`, {
				method: "DELETE",
			});

			if (res.ok) {
				router.push("/patient/forums");
			} else {
				alert("Failed to delete question");
			}
		} catch (error) {
			console.error("Delete error:", error);
			alert("Failed to delete question");
		}
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatTimeAgo = (date: string) => {
		const now = new Date();
		const then = new Date(date);
		const diffMs = now.getTime() - then.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return "just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return then.toLocaleDateString();
	};

	if (loading) {
		return (
			<div className="max-w-5xl mx-auto">
				<Card>
					<CardContent className="pt-6 text-center py-8">
						<p className="text-muted-foreground flex justify-center">
							<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							Loading question...
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!topic) {
		return (
			<div className="max-w-5xl mx-auto">
				<Card>
					<CardContent className="pt-6 text-center py-8">
						<p className="text-muted-foreground">
							Question not found
						</p>
						<Button
							className="mt-4"
							onClick={() => router.push("/patient/forums")}
						>
							Back to Forums
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const isAuthor = topic.authorId?._id === currentUserId;

	return (
		<div className="max-w-5xl mx-auto">
			{/* Breadcrumb */}
			<div className="mb-4">
				<Button
					variant="ghost"
					onClick={() => router.push("/patient/forums")}
					className="mb-2"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to {topic.category?.name || "Forums"}
				</Button>
			</div>

			{/* Question Card */}
			<Card className="mb-6">
				<CardHeader>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								{topic.isPinned && (
									<Pin className="h-5 w-5 text-blue-600" />
								)}
								{topic.isResolved && (
									<Badge className="bg-green-600">
										<CheckCircle2 className="h-3 w-3 mr-1" />
										Answered
									</Badge>
								)}
								{topic.category && (
									<Badge variant="outline">
										{topic.category.name}
									</Badge>
								)}
							</div>
							<CardTitle className="text-2xl mb-3">
								{topic.title}
							</CardTitle>
							<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
								<div className="flex items-center gap-1">
									<User className="h-4 w-4" />
									<span>
										Asked by{" "}
										<span className="font-medium">
											{topic.authorId?.name ||
												"Anonymous"}
										</span>
										{topic.authorRole === "researcher" && (
											<Badge
												variant="secondary"
												className="ml-1 text-xs"
											>
												Researcher
											</Badge>
										)}
									</span>
								</div>
								<div className="flex items-center gap-1">
									<Calendar className="h-4 w-4" />
									<span>
										{formatTimeAgo(topic.createdAt)}
									</span>
								</div>
								<div className="flex items-center gap-1">
									<Eye className="h-4 w-4" />
									<span>{topic.viewCount || 0} views</span>
								</div>
								<div className="flex items-center gap-1">
									<MessageSquare className="h-4 w-4" />
									<span>{topic.replyCount || 0} answers</span>
								</div>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="prose max-w-none mb-4">
						<p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
							{topic.content}
						</p>
					</div>

					{isAuthor && (
						<div className="flex gap-2 pt-4 border-t">
							<Button
								variant="outline"
								size="sm"
								onClick={handleDelete}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete Question
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Answers Section */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold flex items-center gap-2">
						<Shield className="h-5 w-5 text-blue-600" />
						{replies.length}{" "}
						{replies.length === 1 ? "Answer" : "Answers"} from
						Researchers
					</h2>
				</div>

				{replies.length === 0 ? (
					<Card className="border-dashed">
						<CardContent className="pt-6 text-center py-8">
							<MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
							<p className="text-muted-foreground mb-1">
								No answers yet
							</p>
							<p className="text-sm text-gray-500">
								A researcher will respond to your question soon
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-4">
						{replies.map((reply, index) => (
							<Card
								key={reply._id}
								className="border-l-4 border-l-blue-600"
							>
								<CardHeader>
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-center gap-2">
											<div className="flex items-center gap-2">
												<Shield className="h-5 w-5 text-blue-600" />
												<div>
													<div className="flex items-center gap-2">
														<span className="font-semibold">
															{reply.authorId
																?.name ||
																"Researcher"}
														</span>
														{reply.isVerified && (
															<Badge className="bg-blue-600 text-xs">
																✓ Verified
																Researcher
															</Badge>
														)}
													</div>
													<p className="text-xs text-muted-foreground">
														{reply.authorId
															?.email || ""}
													</p>
												</div>
											</div>
										</div>
										<div className="text-right text-xs text-muted-foreground">
											<p>{formatDate(reply.createdAt)}</p>
											{reply.editedAt && (
												<p className="text-xs">
													(edited)
												</p>
											)}
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="prose max-w-none">
										<p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
											{reply.content}
										</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>

			{/* Info Banner */}
			<Card className="border-blue-200 bg-blue-50">
				<CardContent className="pt-6">
					<p className="text-sm text-blue-900">
						<strong>Note:</strong> Only verified medical researchers
						can answer questions on this platform. This ensures you
						receive accurate, professional medical information.
						Patients cannot reply to each other to prevent the
						spread of unverified medical advice.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
