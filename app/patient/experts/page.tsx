"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
	Search,
	Heart,
	Mail,
	MapPin,
	Globe,
	RefreshCw,
	Users,
	UserPlus,
	CheckCircle2,
	BookOpen,
	Loader2,
	ExternalLink,
	UserCheck,
} from "lucide-react";

export default function PatientExperts() {
	const [query, setQuery] = useState("");
	const [experts, setExperts] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedExpert, setSelectedExpert] = useState<any>(null);
	const [message, setMessage] = useState("");
	const [userConditions, setUserConditions] = useState<string[]>([]);
	const [nearbyOnly, setNearbyOnly] = useState(true);
	const [isPersonalized, setIsPersonalized] = useState(true);
	const [userLocation, setUserLocation] = useState<any>(null);
	const [favoritedExperts, setFavoritedExperts] = useState<Set<string>>(
		new Set()
	);

	// Meeting request dialog state
	const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
	const [patientName, setPatientName] = useState("");
	const [patientContact, setPatientContact] = useState("");
	const [meetingMessage, setMeetingMessage] = useState("");
	const [sendingRequest, setSendingRequest] = useState(false);

	// Nudge dialog state
	const [nudgeDialogOpen, setNudgeDialogOpen] = useState(false);
	const [nudgeExpert, setNudgeExpert] = useState<any>(null);

	useEffect(() => {
		loadPersonalizedExperts();
		loadFavorites();
	}, []);

	const loadPersonalizedExperts = async () => {
		setLoading(true);
		setIsPersonalized(true);
		try {
			const res = await fetch(
				`/api/recommendations?nearbyOnly=${nearbyOnly}`
			);
			const data = await res.json();
			setExperts(data.experts || []);
			setUserConditions(data.userConditions || []);
			setUserLocation(data.userLocation);
		} catch (error) {
			console.error("Load error:", error);
		} finally {
			setLoading(false);
		}
	};

	const toggleLocation = async () => {
		const newValue = !nearbyOnly;
		setNearbyOnly(newValue);
		if (isPersonalized) {
			setLoading(true);
			try {
				const res = await fetch(
					`/api/recommendations?nearbyOnly=${newValue}`
				);
				const data = await res.json();
				setExperts(data.experts || []);
			} catch (error) {
				console.error("Toggle error:", error);
			} finally {
				setLoading(false);
			}
		}
	};

	const handleSearch = async () => {
		setLoading(true);
		setIsPersonalized(false);
		try {
			const params = query ? `?query=${encodeURIComponent(query)}` : "";
			const res = await fetch(`/api/experts${params}`);
			const data = await res.json();
			setExperts(data.experts || []);
		} catch (error) {
			console.error("Search error:", error);
		} finally {
			setLoading(false);
		}
	};

	const resetToPersonalized = () => {
		setQuery("");
		loadPersonalizedExperts();
	};

	const loadFavorites = async () => {
		try {
			const res = await fetch("/api/favorites?type=expert");
			const data = await res.json();
			const expertIds = new Set(data.favorites.map((f: any) => f.refId));
			setFavoritedExperts(expertIds);
		} catch (error) {
			console.error("Load favorites error:", error);
		}
	};

	const handleToggleFavorite = async (
		expertId: string,
		expertName: string
	) => {
		try {
			const response = await fetch("/api/favorites", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					refType: "expert",
					refId: expertId,
					metadata: { name: expertName },
				}),
			});

			const data = await response.json();

			if (response.ok) {
				if (data.isFavorite) {
					setFavoritedExperts((prev) => new Set(prev).add(expertId));
					alert("Added to favorites!");
				} else {
					setFavoritedExperts((prev) => {
						const newSet = new Set(prev);
						newSet.delete(expertId);
						return newSet;
					});
					alert("Removed from favorites");
				}
			}
		} catch (error) {
			console.error("Toggle favorite error:", error);
			alert("Failed to update favorites");
		}
	};

	const openMeetingDialog = (expert: any) => {
		setSelectedExpert(expert);
		setMeetingMessage(
			`Dear Dr. ${expert.name},\n\n` +
				`I am a patient interested in your research on ${
					expert.specialties?.[0] || "your field"
				}. ` +
				`I would like to request a meeting to discuss potential participation in research or consultation.\n\n` +
				`Thank you for your consideration.`
		);
		setMeetingDialogOpen(true);
	};

	const handleMeetingRequest = async () => {
		if (
			!selectedExpert ||
			!patientName ||
			!patientContact ||
			!meetingMessage
		) {
			alert("Please fill in all required fields");
			return;
		}

		setSendingRequest(true);
		try {
			const response = await fetch("/api/experts/meeting-request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					expertId: selectedExpert._id || selectedExpert.id,
					expertName: selectedExpert.name,
					isOnPlatform: selectedExpert.isOnPlatform,
					patientName,
					patientContact,
					message: meetingMessage,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				alert(data.message || "Meeting request sent successfully!");
				setMeetingDialogOpen(false);
				setPatientName("");
				setPatientContact("");
				setMeetingMessage("");
				setSelectedExpert(null);
			} else {
				alert(data.error || "Failed to send meeting request");
			}
		} catch (error) {
			console.error("Meeting request error:", error);
			alert("Failed to send meeting request");
		} finally {
			setSendingRequest(false);
		}
	};

	const openNudgeDialog = (expert: any) => {
		setNudgeExpert(expert);
		setNudgeDialogOpen(true);
	};

	const handleNudge = async () => {
		if (!nudgeExpert) return;

		try {
			const response = await fetch("/api/experts/nudge", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					expertName: nudgeExpert.name,
					expertEmail: nudgeExpert.email,
				}),
			});

			if (response.ok) {
				alert("Invitation sent to expert!");
				setNudgeDialogOpen(false);
			} else {
				alert("Failed to send invitation");
			}
		} catch (error) {
			console.error("Nudge error:", error);
			alert("Failed to send invitation");
		}
	};

	return (
		<div className="max-w-7xl mx-auto">
			{/* Page Header with Gradient */}
			<div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-medical-teal-50 via-medical-indigo-50 to-medical-lavender-50 border border-medical-teal-100 shadow-lg animate-fade-in-up">
				<h1
					className="text-3xl md:text-4xl font-bold mb-3"
					style={{
						background:
							"linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #a855f7 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
					}}
				>
					Health Experts
				</h1>
				<p className="text-lg text-gray-700">
					{isPersonalized
						? "🩺 Experts matching your conditions and location"
						: "🔍 Search results for health experts"}
				</p>
			</div>

			{/* User Conditions & Location Toggle */}
			{userConditions.length > 0 && (
				<Card className="mb-8 rounded-2xl shadow-lg border-0 overflow-hidden animate-fade-in">
					<CardContent className="pt-6 pb-6">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
							<div className="flex-1">
								<p className="text-base font-semibold mb-3 text-gray-800 flex items-center gap-2">
									<span className="text-xl">🔍</span> Your
									conditions
								</p>
								<div className="flex flex-wrap gap-2">
									{userConditions.map((condition, i) => (
										<Badge
											key={i}
											className="px-4 py-2 rounded-xl bg-gradient-to-r from-medical-teal-100 to-medical-indigo-100 text-medical-teal-700 border border-medical-teal-300 font-medium hover:scale-105 transition-transform duration-200"
										>
											{condition}
										</Badge>
									))}
								</div>
							</div>
							{userLocation && isPersonalized && (
								<div className="flex flex-col items-start md:items-end gap-3">
									<p className="text-sm text-gray-600 flex items-center gap-2">
										<MapPin className="h-4 w-4 text-medical-teal-500" />
										{userLocation.city},{" "}
										{userLocation.country}
									</p>
									<Button
										size="sm"
										onClick={toggleLocation}
										disabled={loading}
										className={`px-6 py-5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg ${
											nearbyOnly
												? "bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 text-white hover:from-medical-teal-600 hover:to-medical-indigo-600"
												: "bg-white border-2 border-gray-300 text-gray-700 hover:border-medical-teal-400"
										}`}
									>
										{nearbyOnly ? (
											<>
												<MapPin className="mr-2 h-4 w-4" />
												Nearby Only
											</>
										) : (
											<>
												<Globe className="mr-2 h-4 w-4" />
												Global Results
											</>
										)}
									</Button>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Search Card */}
			<Card className="mb-8 rounded-2xl shadow-lg border-0 animate-fade-in">
				<CardContent className="pt-6 pb-6">
					<div className="flex flex-col md:flex-row md:items-center gap-4">
						<div className="flex-1">
							<Label
								htmlFor="query"
								className="text-base font-semibold text-gray-800 mb-2 block"
							>
								Search by condition, specialty, or research area
							</Label>
							<Input
								id="query"
								placeholder="e.g., Glioma, Breast Cancer, Immunotherapy, Cardiology"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && handleSearch()
								}
								className="text-base rounded-xl border-2 border-gray-200 focus:border-medical-teal-400 focus:ring-4 focus:ring-medical-teal-100 transition-all duration-200 p-4"
							/>
							<p className="text-sm text-gray-600 mt-2">
								💡 Search for experts by medical condition or
								research specialty
							</p>
						</div>
						<br />
						<div className="flex items-end gap-2">
							<Button
								onClick={handleSearch}
								disabled={loading}
								className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 group"
							>
								{loading ? (
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
								) : (
									<Search className="mr-2 h-5 w-5" />
								)}
								Search
							</Button>
							{!isPersonalized && (
								<Button
									variant="outline"
									onClick={resetToPersonalized}
									disabled={loading}
								>
									<RefreshCw className="mr-2 h-4 w-4" />
									Reset
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Results Header */}
			{experts.length > 0 && (
				<div className="mb-4 flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {experts.length} expert
						{experts.length !== 1 ? "s" : ""}
						{isPersonalized && nearbyOnly && " nearby"}
						{isPersonalized && !nearbyOnly && " worldwide"}
					</p>
				</div>
			)}

			<div className="grid md:grid-cols-2 gap-4">
				{experts.length === 0 && !loading && (
					<Card className="md:col-span-2">
						<CardContent className="pt-6 text-center py-8">
							<Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
							<p className="text-muted-foreground mb-2">
								{isPersonalized
									? "No experts found for your conditions"
									: "No experts found. Try different search terms."}
							</p>
							{isPersonalized && nearbyOnly && userLocation && (
								<Button variant="link" onClick={toggleLocation}>
									Try viewing global results
								</Button>
							)}
						</CardContent>
					</Card>
				)}

				{experts.map((expert, i) => (
					<Card key={i} className="relative">
						{/* Platform Status Badge */}
						<div className="absolute top-4 right-4">
							{expert.isOnPlatform ? (
								<Badge
									variant="default"
									className="bg-green-600"
								>
									<CheckCircle2 className="mr-1 h-3 w-3" />
									On Platform
								</Badge>
							) : (
								<Badge variant="secondary">
									<ExternalLink className="mr-1 h-3 w-3" />
									External
								</Badge>
							)}
						</div>

						<CardHeader className="pr-32">
							<CardTitle className="flex items-center gap-2">
								{expert.name}
								{expert.publicationCount > 0 && (
									<Badge
										variant="outline"
										className="text-xs font-normal"
									>
										<BookOpen className="mr-1 h-3 w-3" />
										{expert.publicationCount} publications
									</Badge>
								)}
							</CardTitle>
							<CardDescription>
								{expert.specialties?.join(", ") || "Researcher"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{/* Research Interests */}
							{expert.interests &&
								expert.interests.length > 0 && (
									<div>
										<p className="text-sm font-medium mb-2">
											Research Interests:
										</p>
										<div className="flex flex-wrap gap-1">
											{expert.interests
												.slice(0, 5)
												.map(
													(
														interest: string,
														j: number
													) => (
														<Badge
															key={j}
															variant="outline"
															className="text-xs"
														>
															{interest}
														</Badge>
													)
												)}
										</div>
									</div>
								)}

							{/* Location */}
							{expert.location && (
								<p className="text-sm text-muted-foreground flex items-center gap-1">
									<MapPin className="h-4 w-4" />
									{expert.location.city},{" "}
									{expert.location.country}
								</p>
							)}

							{/* Institution */}
							{expert.institution && (
								<p className="text-sm text-muted-foreground">
									{expert.institution}
								</p>
							)}

							{/* Brief Bio */}
							{expert.bio && (
								<p className="text-sm text-gray-600 line-clamp-2">
									{expert.bio}
								</p>
							)}
						</CardContent>
						<CardFooter className="flex flex-wrap gap-2">
							{/* Favorite Button */}
							<Button
								variant={
									favoritedExperts.has(expert._id)
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() =>
									handleToggleFavorite(
										expert._id,
										expert.name
									)
								}
								className={
									favoritedExperts.has(expert._id)
										? "bg-red-600 hover:bg-red-700"
										: ""
								}
							>
								<Heart
									className={`mr-2 h-4 w-4 ${
										favoritedExperts.has(expert._id)
											? "fill-white"
											: ""
									}`}
								/>
								{favoritedExperts.has(expert._id)
									? "Saved"
									: "Add to Favorites"}
							</Button>

							{/* Meeting Request Button */}
							{expert.isOnPlatform ? (
								<Button
									size="sm"
									onClick={() => openMeetingDialog(expert)}
								>
									<Mail className="mr-2 h-4 w-4" />
									Request Meeting
								</Button>
							) : (
								<>
									<Button
										size="sm"
										variant="secondary"
										onClick={() =>
											openMeetingDialog(expert)
										}
									>
										<Mail className="mr-2 h-4 w-4" />
										Request via Admin
									</Button>
									<Button
										size="sm"
										variant="ghost"
										onClick={() => openNudgeDialog(expert)}
									>
										<UserPlus className="mr-2 h-4 w-4" />
										Invite to Platform
									</Button>
								</>
							)}
						</CardFooter>
					</Card>
				))}

				{/* Meeting Request Dialog */}
				<Dialog
					open={meetingDialogOpen}
					onOpenChange={setMeetingDialogOpen}
				>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>
								Request Meeting with {selectedExpert?.name}
							</DialogTitle>
							<DialogDescription>
								{selectedExpert?.isOnPlatform
									? "Send a meeting request directly to this researcher"
									: "This request will be sent to our admin team who will contact the researcher on your behalf"}
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="patientName">
										Your Name *
									</Label>
									<Input
										id="patientName"
										value={patientName}
										onChange={(e) =>
											setPatientName(e.target.value)
										}
										placeholder="John Doe"
										required
									/>
								</div>
								<div>
									<Label htmlFor="patientContact">
										Contact (Email/Phone) *
									</Label>
									<Input
										id="patientContact"
										value={patientContact}
										onChange={(e) =>
											setPatientContact(e.target.value)
										}
										placeholder="john@email.com or +1234567890"
										required
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="meetingMessage">
									Message *
								</Label>
								<Textarea
									id="meetingMessage"
									value={meetingMessage}
									onChange={(e) =>
										setMeetingMessage(e.target.value)
									}
									rows={8}
									placeholder="Introduce yourself and explain why you'd like to meet..."
									required
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setMeetingDialogOpen(false)}
								disabled={sendingRequest}
							>
								Cancel
							</Button>
							<Button
								onClick={handleMeetingRequest}
								disabled={
									sendingRequest ||
									!patientName ||
									!patientContact ||
									!meetingMessage
								}
							>
								{sendingRequest ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Sending...
									</>
								) : (
									<>
										<Mail className="mr-2 h-4 w-4" />
										Send Request
									</>
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Nudge Dialog */}
				<Dialog
					open={nudgeDialogOpen}
					onOpenChange={setNudgeDialogOpen}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								Invite {nudgeExpert?.name} to CuraLink
							</DialogTitle>
							<DialogDescription>
								Send an invitation to this expert to join the
								platform
							</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<p className="text-sm text-muted-foreground">
								We'll send an invitation email highlighting the
								benefits of joining CuraLink and connecting with
								patients interested in their research.
							</p>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setNudgeDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button onClick={handleNudge}>
								<UserPlus className="mr-2 h-4 w-4" />
								Send Invitation
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
