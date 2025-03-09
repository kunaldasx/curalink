"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
	Flag,
	EyeOff,
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
	isHidden: boolean;
	isFlagged: boolean;
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

export default function ResearcherTopicDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const [topic, setTopic] = useState<Topic | null>(null);
	const [replies, setReplies] = useState<Reply[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentUserId, setCurrentUserId] = useState("");

	// Reply form
	const [replyContent, setReplyContent] = useState("");
	const [submittingReply, setSubmittingReply] = useState(false);

	// Moderation
	const [moderating, setModerating] = useState(false);

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

	const handleSubmitReply = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!replyContent.trim() || replyContent.trim().length < 10) {
			alert("Reply must be at least 10 characters");
			return;
		}

		setSubmittingReply(true);

		try {
			const res = await fetch("/api/forum/replies", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					topicId: params.id,
					content: replyContent.trim(),
				}),
			});

			if (res.ok) {
				setReplyContent("");
				fetchTopic(); // Refresh to show new reply
			} else {
				const error = await res.json();
				alert(error.error || "Failed to post reply");
			}
		} catch (error) {
			console.error("Submit reply error:", error);
			alert("Failed to post reply");
		} finally {
			setSubmittingReply(false);
		}
	};

	const handleModerate = async (action: string, value: boolean) => {
		setModerating(true);
		try {
			const body: any = { action: "moderate" };

			if (action === "resolve") body.isResolved = value;
			if (action === "pin") body.isPinned = value;
			if (action === "hide") body.isHidden = value;

			const res = await fetch(`/api/forum/topics/${params.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (res.ok) {
				fetchTopic(); // Refresh
			} else {
				alert("Failed to moderate");
			}
		} catch (error) {
			console.error("Moderate error:", error);
			alert("Failed to moderate");
		} finally {
			setModerating(false);
		}
	};

	const handleDeleteTopic = async () => {
		if (
			!confirm(
				"Are you sure you want to delete this topic? This action cannot be undone."
			)
		) {
			return;
		}

		try {
			const res = await fetch(`/api/forum/topics/${params.id}`, {
				method: "DELETE",
			});

			if (res.ok) {
				router.push("/researcher/forums");
			} else {
				alert("Failed to delete topic");
			}
		} catch (error) {
			console.error("Delete error:", error);
			alert("Failed to delete topic");
		}
	};

	const handleDeleteReply = async (replyId: string) => {
		if (!confirm("Are you sure you want to delete this reply?")) {
			return;
		}

		try {
			const res = await fetch(`/api/forum/replies/${replyId}`, {
				method: "DELETE",
			});

			if (res.ok) {
				fetchTopic(); // Refresh
			} else {
				alert("Failed to delete reply");
			}
		} catch (error) {
			console.error("Delete reply error:", error);
			alert("Failed to delete reply");
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
							Loading topic...
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
						<p className="text-muted-foreground">Topic not found</p>
						<Button
							className="mt-4"
							onClick={() => router.push("/researcher/forums")}
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
					onClick={() => router.push("/researcher/forums")}
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
									<Pin className="h-5 w-5 text-green-600" />
								)}
								{topic.isResolved && (
									<Badge className="bg-green-600">
										<CheckCircle2 className="h-3 w-3 mr-1" />
										Answered
									</Badge>
								)}
								{topic.isHidden && (
									<Badge variant="secondary">
										<EyeOff className="h-3 w-3 mr-1" />
										Hidden
									</Badge>
								)}
								{topic.isFlagged && (
									<Badge variant="destructive">
										<Flag className="h-3 w-3 mr-1" />
										Flagged
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

					{/* Moderation Actions */}
					<div className="flex flex-wrap gap-2 pt-4 border-t">
						<Button
							variant={topic.isResolved ? "default" : "outline"}
							size="sm"
							onClick={() =>
								handleModerate("resolve", !topic.isResolved)
							}
							disabled={moderating}
						>
							<CheckCircle2 className="mr-2 h-4 w-4" />
							{topic.isResolved
								? "Mark Unresolved"
								: "Mark as Resolved"}
						</Button>
						<Button
							variant={topic.isPinned ? "default" : "outline"}
							size="sm"
							onClick={() =>
								handleModerate("pin", !topic.isPinned)
							}
							disabled={moderating}
						>
							<Pin className="mr-2 h-4 w-4" />
							{topic.isPinned ? "Unpin" : "Pin Topic"}
						</Button>
						<Button
							variant={topic.isHidden ? "secondary" : "outline"}
							size="sm"
							onClick={() =>
								handleModerate("hide", !topic.isHidden)
							}
							disabled={moderating}
						>
							<EyeOff className="mr-2 h-4 w-4" />
							{topic.isHidden ? "Unhide" : "Hide Topic"}
						</Button>
						{isAuthor && (
							<Button
								variant="destructive"
								size="sm"
								onClick={handleDeleteTopic}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Answer Form */}
			<Card className="mb-6 border-green-200">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Shield className="h-5 w-5 text-green-600" />
						Answer this Question
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmitReply}>
						<div className="space-y-4">
							<div>
								<Label htmlFor="reply">Your Answer *</Label>
								<Textarea
									id="reply"
									placeholder="Provide a detailed, professional answer to help this patient..."
									value={replyContent}
									onChange={(e) =>
										setReplyContent(e.target.value)
									}
									rows={6}
									className="mt-1"
									minLength={10}
									maxLength={10000}
									required
								/>
								<p className="text-xs text-muted-foreground mt-1">
									{replyContent.length}/10,000 characters
									(minimum 10 required)
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Button
									type="submit"
									disabled={
										submittingReply ||
										replyContent.length < 10
									}
									className="bg-green-600 hover:bg-green-700"
								>
									{submittingReply
										? "Posting..."
										: "Post Answer"}
								</Button>
								<p className="text-xs text-muted-foreground">
									Your answer will be marked as verified ✓
								</p>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* Answers Section */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold flex items-center gap-2">
						<Shield className="h-5 w-5 text-green-600" />
						{replies.length}{" "}
						{replies.length === 1 ? "Answer" : "Answers"}
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
								Be the first to answer this question
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-4">
						{replies.map((reply) => {
							const isReplyAuthor =
								reply.authorId?._id === currentUserId;

							return (
								<Card
									key={reply._id}
									className="border-l-4 border-l-green-600"
								>
									<CardHeader>
										<div className="flex items-start justify-between gap-4">
											<div className="flex items-center gap-2">
												<div className="flex items-center gap-2">
													<Shield className="h-5 w-5 text-green-600" />
													<div>
														<div className="flex items-center gap-2">
															<span className="font-semibold">
																{reply.authorId
																	?.name ||
																	"Researcher"}
															</span>
															{reply.isVerified && (
																<Badge className="bg-green-600 text-xs">
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
											<div className="text-right">
												<p className="text-xs text-muted-foreground">
													{formatDate(
														reply.createdAt
													)}
												</p>
												{reply.editedAt && (
													<p className="text-xs text-gray-500">
														(edited)
													</p>
												)}
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="prose max-w-none mb-3">
											<p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
												{reply.content}
											</p>
										</div>

										{isReplyAuthor && (
											<div className="flex gap-2 pt-2 border-t">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														handleDeleteReply(
															reply._id
														)
													}
												>
													<Trash2 className="mr-2 h-3 w-3" />
													Delete
												</Button>
											</div>
										)}
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
