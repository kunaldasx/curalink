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
	Search,
	Heart,
	ExternalLink,
	RefreshCw,
	BookOpen,
	FileText,
	Calendar,
	Users,
	Link as LinkIcon,
	TrendingUp,
	Loader2,
} from "lucide-react";

export default function PatientPublications() {
	const [query, setQuery] = useState("");
	const [publications, setPublications] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [userConditions, setUserConditions] = useState<string[]>([]);
	const [isPersonalized, setIsPersonalized] = useState(true);
	const [favoritedPubs, setFavoritedPubs] = useState<Set<string>>(new Set());

	useEffect(() => {
		loadPersonalizedPublications();
		loadFavorites();
	}, []);

	const loadPersonalizedPublications = async () => {
		setLoading(true);
		setIsPersonalized(true);
		try {
			const res = await fetch("/api/recommendations");
			const data = await res.json();
			setPublications(data.publications || []);
			setUserConditions(data.userConditions || []);
		} catch (error) {
			console.error("Load error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = async () => {
		if (!query) return;

		setLoading(true);
		setIsPersonalized(false);
		try {
			const res = await fetch(
				`/api/publications/search?query=${encodeURIComponent(query)}`
			);
			const data = await res.json();
			setPublications(data.publications || []);
		} catch (error) {
			console.error("Search error:", error);
		} finally {
			setLoading(false);
		}
	};

	const resetToPersonalized = () => {
		setQuery("");
		loadPersonalizedPublications();
	};

	const loadFavorites = async () => {
		try {
			const res = await fetch("/api/favorites?type=publication");
			const data = await res.json();
			const pubIds = new Set(data.favorites.map((f: any) => f.refId));
			setFavoritedPubs(pubIds);
		} catch (error) {
			console.error("Load favorites error:", error);
		}
	};

	const handleToggleFavorite = async (pubId: string, pubTitle: string) => {
		try {
			const response = await fetch("/api/favorites", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					refType: "publication",
					refId: pubId,
					metadata: { title: pubTitle },
				}),
			});

			const data = await response.json();

			if (response.ok) {
				if (data.isFavorite) {
					setFavoritedPubs((prev) => new Set(prev).add(pubId));
				} else {
					setFavoritedPubs((prev) => {
						const newSet = new Set(prev);
						newSet.delete(pubId);
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
					Publications
				</h1>
				<p className="text-lg text-gray-700">
					{isPersonalized
						? "📚 Research articles relevant to your conditions"
						: "🔍 Search results for publications"}
				</p>
			</div>

			{/* User Conditions */}
			{isPersonalized && userConditions.length > 0 && (
				<Card className="mb-8 rounded-2xl shadow-lg border-0 overflow-hidden animate-fade-in">
					<CardContent className="pt-6 pb-6">
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-teal-100 to-medical-indigo-100 flex items-center justify-center flex-shrink-0">
								<TrendingUp className="h-6 w-6 text-medical-teal-600" />
							</div>
							<div className="flex-1">
								<p className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
									<span className="text-xl">📚</span>{" "}
									Personalized for Your Conditions
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
								<p className="text-sm text-gray-600 mt-3">
									✨ Showing research articles relevant to
									your medical profile
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Search Card */}
			<Card className="mb-8 rounded-2xl shadow-lg border-0 animate-fade-in">
				<CardContent className="pt-6 pb-6">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<Label
								htmlFor="query"
								className="text-base font-semibold text-gray-800 mb-2 block"
							>
								Search publications
							</Label>
							<Input
								id="query"
								placeholder="e.g., diabetes treatment, cancer immunotherapy"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && handleSearch()
								}
								className="text-base rounded-xl border-2 border-gray-200 focus:border-medical-teal-400 focus:ring-4 focus:ring-medical-teal-100 transition-all duration-200 p-4"
							/>
						</div>
						<div className="flex items-end gap-2">
							<Button
								onClick={handleSearch}
								disabled={loading || !query}
								className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50"
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
									className="px-6 py-4 rounded-xl font-semibold border-2 border-gray-300 hover:border-medical-teal-400 hover:bg-medical-teal-50 transition-all duration-200"
								>
									<RefreshCw className="mr-2 h-5 w-5" />
									Reset
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Results Header */}
			{publications.length > 0 && (
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FileText className="h-4 w-4 text-gray-500" />
						<p className="text-sm font-medium text-gray-700">
							{isPersonalized
								? "Recommended Publications"
								: "Search Results"}
							<span className="text-muted-foreground ml-1">
								({publications.length})
							</span>
						</p>
					</div>
					{isPersonalized && (
						<Badge variant="outline" className="text-xs">
							Personalized for you
						</Badge>
					)}
				</div>
			)}

			<div className="space-y-4">
				{publications.length === 0 && !loading && (
					<Card>
						<CardContent className="pt-6 text-center py-8">
							<BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
							<p className="text-muted-foreground mb-2">
								{isPersonalized
									? "No publications found for your conditions"
									: "Enter a search term to find relevant publications"}
							</p>
						</CardContent>
					</Card>
				)}

				{publications.map((pub, i) => {
					const pubId = pub._id || pub.externalId || pub.pmid;
					const isFavorited = favoritedPubs.has(pubId);

					return (
						<Card
							key={i}
							className="hover:shadow-lg transition-shadow"
						>
							<CardHeader>
								<div className="flex justify-between items-start gap-4">
									<div className="flex-1">
										<CardTitle className="text-lg leading-tight hover:text-blue-600 transition-colors">
											{pub.title}
										</CardTitle>
										<div className="mt-2 space-y-1">
											{/* Journal & Date */}
											<CardDescription className="flex items-center gap-2 text-sm">
												<BookOpen className="h-3 w-3" />
												<span className="font-medium">
													{pub.journal || "Journal"}
												</span>
												{pub.year && (
													<>
														<span>•</span>
														<Calendar className="h-3 w-3" />
														<span>{pub.year}</span>
													</>
												)}
											</CardDescription>
											{/* Authors */}
											{pub.authors &&
												pub.authors.length > 0 && (
													<CardDescription className="flex items-start gap-2 text-xs">
														<Users className="h-3 w-3 mt-0.5 flex-shrink-0" />
														<span>
															{pub.authors
																.slice(0, 5)
																.join(", ")}
															{pub.authors
																.length > 5 &&
																` et al. (${pub.authors.length} authors)`}
														</span>
													</CardDescription>
												)}
										</div>
									</div>
									<Button
										variant={
											isFavorited ? "default" : "ghost"
										}
										size="icon"
										onClick={() =>
											handleToggleFavorite(
												pubId,
												pub.title
											)
										}
										className={`flex-shrink-0 ${
											isFavorited
												? "bg-red-600 hover:bg-red-700"
												: ""
										}`}
										title={
											isFavorited
												? "Remove from favorites"
												: "Add to favorites"
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
							<CardContent>
								{/* AI Summary */}
								{pub.summary && (
									<div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
										<p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
											<FileText className="h-3 w-3" />
											AI Summary:
										</p>
										<p className="text-sm text-gray-700 leading-relaxed">
											{pub.summary}
										</p>
									</div>
								)}

								{/* Abstract Preview */}
								{pub.abstract && !pub.summary && (
									<div className="mb-4">
										<p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
											{pub.abstract}
										</p>
									</div>
								)}

								{/* Actions */}
								<div className="flex flex-wrap gap-3 items-center">
									{pub.doiURL && (
										<a
											href={pub.doiURL}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
										>
											<ExternalLink className="h-4 w-4" />
											Read Full Paper
										</a>
									)}
									{pub.pmid && (
										<a
											href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/`}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
										>
											<LinkIcon className="h-3 w-3" />
											PubMed
										</a>
									)}
									{pub.externalId && !pub.pmid && (
										<a
											href={`https://pubmed.ncbi.nlm.nih.gov/${pub.externalId}/`}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
										>
											<LinkIcon className="h-3 w-3" />
											PubMed
										</a>
									)}
								</div>

								{/* Additional Info */}
								{(pub.externalId || pub.pmid) && (
									<div className="mt-3 pt-3 border-t border-gray-100">
										<p className="text-xs text-gray-500">
											PMID: {pub.externalId || pub.pmid}
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
