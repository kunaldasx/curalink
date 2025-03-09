"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
	Search,
	MapPin,
	Heart,
	Globe,
	RefreshCw,
	Mail,
	Sparkles,
	Loader2,
	Filter,
	X,
} from "lucide-react";

export default function PatientClinicalTrials() {
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("");
	const [phase, setPhase] = useState("");
	const [location, setLocation] = useState("");
	const [trials, setTrials] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [userConditions, setUserConditions] = useState<string[]>([]);
	const [nearbyOnly, setNearbyOnly] = useState(true);
	const [isPersonalized, setIsPersonalized] = useState(true);
	const [userLocation, setUserLocation] = useState<any>(null);
	const [showFilters, setShowFilters] = useState(false);
	const [favoritedTrials, setFavoritedTrials] = useState<Set<string>>(
		new Set()
	);

	// Email dialog state
	const [emailDialogOpen, setEmailDialogOpen] = useState(false);
	const [selectedTrial, setSelectedTrial] = useState<any>(null);
	const [emailSubject, setEmailSubject] = useState("");
	const [emailBody, setEmailBody] = useState("");
	const [sendingEmail, setSendingEmail] = useState(false);

	useEffect(() => {
		loadPersonalizedTrials();
		loadFavorites();
	}, []);

	const loadPersonalizedTrials = async () => {
		setLoading(true);
		setIsPersonalized(true);
		try {
			const res = await fetch(
				`/api/recommendations?nearbyOnly=${nearbyOnly}`
			);
			const data = await res.json();
			setTrials(data.trials || []);
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
				setTrials(data.trials || []);
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
			const params = new URLSearchParams();
			if (query) params.append("query", query);
			if (status) params.append("status", status);
			if (phase) params.append("phase", phase);
			if (location) params.append("location", location);

			const res = await fetch(`/api/clinical-trials/search?${params}`);
			const data = await res.json();
			setTrials(data.trials || []);
		} catch (error) {
			console.error("Search error:", error);
		} finally {
			setLoading(false);
		}
	};

	const resetToPersonalized = () => {
		setQuery("");
		setStatus("");
		setPhase("");
		setLocation("");
		setShowFilters(false);
		loadPersonalizedTrials();
	};

	const openEmailDialog = (trial: any) => {
		setSelectedTrial(trial);
		setEmailSubject(`Inquiry about ${trial.title}`);
		setEmailBody(
			`Dear Trial Administrator,\n\n` +
				`I am interested in learning more about the clinical trial "${trial.title}".\n\n` +
				`I would like to know more about:\n` +
				`- Eligibility requirements\n` +
				`- Trial timeline and duration\n` +
				`- How to participate\n\n` +
				`Thank you for your time.\n\n` +
				`Best regards`
		);
		setEmailDialogOpen(true);
	};

	const sendEmail = async () => {
		if (!selectedTrial?.contactEmail) return;

		setSendingEmail(true);
		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					to: selectedTrial.contactEmail,
					subject: emailSubject,
					body: emailBody,
					trialTitle: selectedTrial.title,
				}),
			});

			if (response.ok) {
				alert("Email sent successfully!");
				setEmailDialogOpen(false);
			} else {
				// Fallback to mailto if API fails
				window.location.href = `mailto:${
					selectedTrial.contactEmail
				}?subject=${encodeURIComponent(
					emailSubject
				)}&body=${encodeURIComponent(emailBody)}`;
				setEmailDialogOpen(false);
			}
		} catch (error) {
			console.error("Send email error:", error);
			// Fallback to mailto
			window.location.href = `mailto:${
				selectedTrial.contactEmail
			}?subject=${encodeURIComponent(
				emailSubject
			)}&body=${encodeURIComponent(emailBody)}`;
			setEmailDialogOpen(false);
		} finally {
			setSendingEmail(false);
		}
	};

	const clearFilters = () => {
		setStatus("");
		setPhase("");
		setLocation("");
	};

	const activeFiltersCount = [status, phase, location].filter(Boolean).length;

	const loadFavorites = async () => {
		try {
			const res = await fetch("/api/favorites?type=trial");
			const data = await res.json();
			const trialIds = new Set(data.favorites.map((f: any) => f.refId));
			setFavoritedTrials(trialIds);
		} catch (error) {
			console.error("Load favorites error:", error);
		}
	};

	const handleToggleFavorite = async (
		trialId: string,
		trialTitle: string
	) => {
		try {
			const response = await fetch("/api/favorites", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					refType: "trial",
					refId: trialId,
					metadata: { title: trialTitle },
				}),
			});

			const data = await response.json();

			if (response.ok) {
				if (data.isFavorite) {
					setFavoritedTrials((prev) => new Set(prev).add(trialId));
				} else {
					setFavoritedTrials((prev) => {
						const newSet = new Set(prev);
						newSet.delete(trialId);
						return newSet;
					});
				}
			}
		} catch (error) {
			console.error("Toggle favorite error:", error);
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
					Clinical Trials
				</h1>
				<p className="text-lg text-gray-700">
					{isPersonalized
						? "🧬 Personalized trials based on your conditions and location"
						: "🔍 Search results for clinical trials"}
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
					<div className="space-y-6">
						{/* Main Search */}
						<div>
							<Label
								htmlFor="query"
								className="text-base font-semibold text-gray-800 mb-2 block"
							>
								Search Clinical Trials
							</Label>
							<div className="flex flex-col md:flex-row gap-3">
								<Input
									id="query"
									placeholder="e.g., Lung Cancer Immunotherapy Trials, Diabetes Treatment"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									onKeyDown={(e) =>
										e.key === "Enter" && handleSearch()
									}
									className="flex-1 text-base rounded-xl border-2 border-gray-200 focus:border-medical-teal-400 focus:ring-4 focus:ring-medical-teal-100 transition-all duration-200 p-4"
								/>
								<Button
									onClick={handleSearch}
									disabled={loading}
									className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 group"
								>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-5 w-5 animate-spin" />
											Searching Trials...
										</>
									) : (
										<>
											<Search className="mr-2 h-4 w-4" />
											Search Trials
										</>
									)}
								</Button>
							</div>
							<p className="text-sm text-gray-600 mt-2">
								💡 Search by condition, treatment type, or
								keywords
							</p>
						</div>

						{/* Filter Toggle */}
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowFilters(!showFilters)}
							>
								<Filter className="mr-2 h-4 w-4" />
								Filters
								{activeFiltersCount > 0 && (
									<Badge variant="secondary" className="ml-2">
										{activeFiltersCount}
									</Badge>
								)}
							</Button>
							{activeFiltersCount > 0 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={clearFilters}
								>
									<X className="mr-2 h-4 w-4" />
									Clear Filters
								</Button>
							)}
						</div>

						{/* Expandable Filters */}
						{showFilters && (
							<div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
								<div>
									<Label htmlFor="status">
										Recruitment Status
									</Label>
									<select
										id="status"
										value={status}
										onChange={(e) =>
											setStatus(e.target.value)
										}
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
									>
										<option value="">All Statuses</option>
										<option value="Recruiting">
											Recruiting
										</option>
										<option value="Not yet recruiting">
											Not Yet Recruiting
										</option>
										<option value="Active, not recruiting">
											Active, Not Recruiting
										</option>
										<option value="Completed">
											Completed
										</option>
										<option value="Enrolling by invitation">
											Enrolling by Invitation
										</option>
									</select>
								</div>

								<div>
									<Label htmlFor="phase">Trial Phase</Label>
									<select
										id="phase"
										value={phase}
										onChange={(e) =>
											setPhase(e.target.value)
										}
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
									>
										<option value="">All Phases</option>
										<option value="Early Phase 1">
											Early Phase 1
										</option>
										<option value="Phase 1">Phase 1</option>
										<option value="Phase 2">Phase 2</option>
										<option value="Phase 3">Phase 3</option>
										<option value="Phase 4">Phase 4</option>
										<option value="Not Applicable">
											Not Applicable
										</option>
									</select>
								</div>

								<div>
									<Label htmlFor="location">Location</Label>
									<Input
										id="location"
										placeholder="e.g., Boston, California"
										value={location}
										onChange={(e) =>
											setLocation(e.target.value)
										}
										onKeyDown={(e) =>
											e.key === "Enter" && handleSearch()
										}
									/>
								</div>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex flex-wrap gap-2">
							{!isPersonalized && (
								<Button
									variant="outline"
									onClick={resetToPersonalized}
									disabled={loading}
								>
									<RefreshCw className="mr-2 h-4 w-4" />
									My Recommendations
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Results Header */}
			{trials.length > 0 && (
				<div className="mb-4 flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {trials.length} trial
						{trials.length !== 1 ? "s" : ""}
						{isPersonalized && nearbyOnly && " nearby"}
						{isPersonalized && !nearbyOnly && " worldwide"}
					</p>
				</div>
			)}

			<div className="space-y-4">
				{trials.length === 0 && !loading && (
					<Card>
						<CardContent className="pt-6 text-center py-8">
							<Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
							<p className="text-muted-foreground mb-2">
								{isPersonalized
									? "No trials found for your conditions"
									: "No trials found. Try different search terms."}
							</p>
							{isPersonalized && nearbyOnly && userLocation && (
								<Button
									variant="link"
									className="flex justify-center items-center w-full"
									onClick={handleSearch}
								>
									<Search className="mr-2 h-5 w-5" />
									Try viewing all results
								</Button>
							)}
						</CardContent>
					</Card>
				)}

				{trials.map((trial, i) => {
					const trialId = trial._id || trial.nctId;
					const isFavorited = favoritedTrials.has(trialId);

					return (
						<Card key={i}>
							<CardHeader>
								<div className="flex justify-between items-start gap-4">
									<div className="flex-1">
										<CardTitle className="text-lg">
											{trial.title}
										</CardTitle>
										<CardDescription className="mt-1 flex flex-wrap gap-2 items-center">
											<span>{trial.condition}</span>
											<span>•</span>
											<Badge variant="outline">
												{trial.phase}
											</Badge>
											<span>•</span>
											<Badge
												variant={
													trial.status ===
													"Recruiting"
														? "default"
														: "secondary"
												}
											>
												{trial.status}
											</Badge>
										</CardDescription>
									</div>
									<Button
										variant={
											isFavorited ? "default" : "ghost"
										}
										size="icon"
										onClick={() =>
											handleToggleFavorite(
												trialId,
												trial.title
											)
										}
										title={
											isFavorited
												? "Remove from favorites"
												: "Add to favorites"
										}
										className={
											isFavorited
												? "bg-red-600 hover:bg-red-700"
												: ""
										}
									>
										<Heart
											className={`h-5 w-5 ${
												isFavorited ? "fill-white" : ""
											}`}
										/>
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* AI-Generated Summary */}
								{trial.summary && (
									<div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-l-4 border-medical-indigo-400 shadow-sm">
										<div className="flex items-center gap-2 mb-2">
											<Sparkles className="h-4 w-4 text-medical-indigo-500" />
											<span className="text-xs font-semibold text-medical-indigo-600 dark:text-medical-indigo-400">
												AI-Generated Summary
											</span>
										</div>
										<p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
											{trial.summary}
										</p>
									</div>
								)}

								{/* Eligibility */}
								{trial.eligibility && (
									<div>
										<h4 className="text-sm font-semibold mb-1">
											Eligibility Criteria:
										</h4>
										<p className="text-sm text-muted-foreground">
											{trial.eligibility}
										</p>
									</div>
								)}

								{/* Participant Info */}
								{trial.targetParticipants &&
									trial.targetParticipants > 0 && (
										<div className="flex items-center gap-2 text-sm">
											<span className="text-muted-foreground">
												Participants:{" "}
												{trial.currentParticipants || 0}{" "}
												/ {trial.targetParticipants}
											</span>
											{trial.currentParticipants &&
												trial.targetParticipants && (
													<div className="flex-1 max-w-xs">
														<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
															<div
																className="bg-blue-600 h-1.5 rounded-full"
																style={{
																	width: `${Math.min(
																		(trial.currentParticipants /
																			trial.targetParticipants) *
																			100,
																		100
																	)}%`,
																}}
															/>
														</div>
													</div>
												)}
										</div>
									)}

								{/* Location and Contact */}
								<div className="flex flex-wrap items-center gap-4 pt-2 border-t">
									<span className="flex items-center gap-1 text-sm text-muted-foreground">
										<MapPin className="h-4 w-4" />
										{trial.location}
									</span>
									{trial.contactEmail && (
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												openEmailDialog(trial)
											}
										>
											<Mail className="mr-2 h-4 w-4" />
											Contact Trial Team
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					);
				})}

				{/* Email Dialog */}
				<Dialog
					open={emailDialogOpen}
					onOpenChange={setEmailDialogOpen}
				>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>
								Contact Trial Administrator
							</DialogTitle>
							<DialogDescription>
								{selectedTrial?.title}
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label htmlFor="emailTo">To</Label>
								<Input
									id="emailTo"
									value={selectedTrial?.contactEmail || ""}
									disabled
									className="bg-gray-50"
								/>
							</div>
							<div>
								<Label htmlFor="emailSubject">Subject</Label>
								<Input
									id="emailSubject"
									value={emailSubject}
									onChange={(e) =>
										setEmailSubject(e.target.value)
									}
								/>
							</div>
							<div>
								<Label htmlFor="emailBody">Message</Label>
								<Textarea
									id="emailBody"
									value={emailBody}
									onChange={(e) =>
										setEmailBody(e.target.value)
									}
									rows={12}
									className="font-mono text-sm"
								/>
								<p className="text-xs text-muted-foreground mt-1">
									Feel free to customize this message with
									your questions
								</p>
							</div>
							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => setEmailDialogOpen(false)}
									disabled={sendingEmail}
								>
									Cancel
								</Button>
								<Button
									onClick={sendEmail}
									disabled={
										sendingEmail ||
										!emailSubject ||
										!emailBody
									}
								>
									{sendingEmail ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Sending...
										</>
									) : (
										<>
											<Mail className="mr-2 h-4 w-4" />
											Send Email
										</>
									)}
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
