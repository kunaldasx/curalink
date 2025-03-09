"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Bookmark,
	FlaskConical,
	BookOpen,
	Users,
	BookmarkX,
	ExternalLink,
	MapPin,
	Mail,
	Building,
	UserPlus,
	Loader2,
} from "lucide-react";
import Link from "next/link";

export default function ResearcherFavorites() {
	const router = useRouter();
	const [favorites, setFavorites] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all");

	useEffect(() => {
		fetchFavorites();
	}, []);

	const fetchFavorites = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/favorites");
			const data = await res.json();
			setFavorites(data.favorites || []);
		} catch (error) {
			console.error("Fetch error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveFavorite = async (refType: string, refId: string) => {
		try {
			await fetch("/api/favorites", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refType, refId }),
			});
			fetchFavorites(); // Refresh list
		} catch (error) {
			console.error("Remove favorite error:", error);
		}
	};

	const groupedFavorites = {
		trial: favorites.filter((f) => f.refType === "trial"),
		publication: favorites.filter((f) => f.refType === "publication"),
		collaborator: favorites.filter((f) => f.refType === "collaborator"),
	};

	const totalCount = favorites.length;

	return (
		<div className="max-w-7xl mx-auto">
			{/* Page Header with Gradient */}
			<div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-medical-teal-50 via-medical-indigo-50 to-medical-lavender-50 border border-medical-teal-100 shadow-lg animate-fade-in-up">
				<div className="flex items-center gap-4 mb-3">
					<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
						<Bookmark className="h-8 w-8 text-white" />
					</div>
					<h1
						className="text-3xl md:text-4xl font-bold"
						style={{
							background:
								"linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #a855f7 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}
					>
						Research Library
					</h1>
				</div>
				<p className="text-lg text-gray-700">
					📚 Your saved clinical trials, publications, and
					collaborators
				</p>
			</div>

			{loading && (
				<Card>
					<CardContent className="pt-6 text-center py-12 flex justify-center">
						<Loader2 className="mr-2 h-5 w-5 animate-spin" />
						<p className="text-muted-foreground">
							Loading your library...
						</p>
					</CardContent>
				</Card>
			)}

			{!loading && totalCount === 0 && (
				<Card className="border-dashed">
					<CardContent className="pt-6 text-center py-12">
						<Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							No Saved Items Yet
						</h3>
						<p className="text-muted-foreground mb-4">
							Build your research library by saving relevant
							clinical trials, publications, and collaborators
						</p>
						<div className="flex gap-2 justify-center">
							<Button
								onClick={() =>
									router.push("/researcher/trials")
								}
							>
								Browse Clinical Trials
							</Button>
							<Button
								variant="outline"
								onClick={() =>
									router.push("/researcher/experts")
								}
							>
								Find Collaborators
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{!loading && totalCount > 0 && (
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-6"
				>
					<TabsList>
						<TabsTrigger value="all">
							All ({totalCount})
						</TabsTrigger>
						<TabsTrigger value="trials">
							<FlaskConical className="h-4 w-4 mr-2" />
							Clinical Trials ({groupedFavorites.trial.length})
						</TabsTrigger>
						<TabsTrigger value="publications">
							<BookOpen className="h-4 w-4 mr-2" />
							Publications ({groupedFavorites.publication.length})
						</TabsTrigger>
						<TabsTrigger value="collaborators">
							<Users className="h-4 w-4 mr-2" />
							Collaborators (
							{groupedFavorites.collaborator.length})
						</TabsTrigger>
					</TabsList>

					{/* All Tab */}
					<TabsContent value="all" className="space-y-6">
						{groupedFavorites.trial.length > 0 && (
							<div>
								<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
									<FlaskConical className="h-5 w-5 text-blue-600" />
									Clinical Trials
								</h2>
								<div className="grid gap-4">
									{groupedFavorites.trial.map((fav) => (
										<TrialCard
											key={fav._id}
											favorite={fav}
											onRemove={handleRemoveFavorite}
										/>
									))}
								</div>
							</div>
						)}

						{groupedFavorites.publication.length > 0 && (
							<div>
								<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
									<BookOpen className="h-5 w-5 text-green-600" />
									Publications
								</h2>
								<div className="grid gap-4">
									{groupedFavorites.publication.map((fav) => (
										<PublicationCard
											key={fav._id}
											favorite={fav}
											onRemove={handleRemoveFavorite}
										/>
									))}
								</div>
							</div>
						)}

						{groupedFavorites.collaborator.length > 0 && (
							<div>
								<h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
									<Users className="h-5 w-5 text-purple-600" />
									Collaborators
								</h2>
								<div className="grid gap-4 md:grid-cols-2">
									{groupedFavorites.collaborator.map(
										(fav) => (
											<CollaboratorCard
												key={fav._id}
												favorite={fav}
												onRemove={handleRemoveFavorite}
											/>
										)
									)}
								</div>
							</div>
						)}
					</TabsContent>

					{/* Trials Tab */}
					<TabsContent value="trials">
						{groupedFavorites.trial.length === 0 ? (
							<Card className="border-dashed">
								<CardContent className="pt-6 text-center py-12">
									<FlaskConical className="h-12 w-12 text-gray-300 mx-auto mb-3" />
									<p className="text-muted-foreground">
										No saved clinical trials yet
									</p>
								</CardContent>
							</Card>
						) : (
							<div className="grid gap-4">
								{groupedFavorites.trial.map((fav) => (
									<TrialCard
										key={fav._id}
										favorite={fav}
										onRemove={handleRemoveFavorite}
									/>
								))}
							</div>
						)}
					</TabsContent>

					{/* Publications Tab */}
					<TabsContent value="publications">
						{groupedFavorites.publication.length === 0 ? (
							<Card className="border-dashed">
								<CardContent className="pt-6 text-center py-12">
									<BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
									<p className="text-muted-foreground">
										No saved publications yet
									</p>
								</CardContent>
							</Card>
						) : (
							<div className="grid gap-4">
								{groupedFavorites.publication.map((fav) => (
									<PublicationCard
										key={fav._id}
										favorite={fav}
										onRemove={handleRemoveFavorite}
									/>
								))}
							</div>
						)}
					</TabsContent>

					{/* Collaborators Tab */}
					<TabsContent value="collaborators">
						{groupedFavorites.collaborator.length === 0 ? (
							<Card className="border-dashed">
								<CardContent className="pt-6 text-center py-12">
									<Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
									<p className="text-muted-foreground mb-2">
										No saved collaborators yet
									</p>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											router.push("/researcher/experts")
										}
									>
										<UserPlus className="mr-2 h-4 w-4" />
										Find Collaborators
									</Button>
								</CardContent>
							</Card>
						) : (
							<div className="grid gap-4 md:grid-cols-2">
								{groupedFavorites.collaborator.map((fav) => (
									<CollaboratorCard
										key={fav._id}
										favorite={fav}
										onRemove={handleRemoveFavorite}
									/>
								))}
							</div>
						)}
					</TabsContent>
				</Tabs>
			)}
		</div>
	);
}

// Trial Card Component
function TrialCard({ favorite, onRemove }: any) {
	const trial = favorite.details;
	if (!trial) return null;

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<CardTitle className="text-lg mb-2">
							{trial.title}
						</CardTitle>
						<div className="flex flex-wrap gap-2 mb-2">
							<Badge variant="outline">{trial.phase}</Badge>
							<Badge
								variant={
									trial.status === "Recruiting"
										? "default"
										: "secondary"
								}
							>
								{trial.status}
							</Badge>
							{trial.conditions
								?.slice(0, 2)
								.map((cond: string, i: number) => (
									<Badge key={i} variant="outline">
										{cond}
									</Badge>
								))}
						</div>
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							{trial.location && (
								<span className="flex items-center gap-1">
									<MapPin className="h-3 w-3" />
									{trial.location}
								</span>
							)}
							{trial.sponsor && (
								<span className="flex items-center gap-1">
									<Building className="h-3 w-3" />
									{trial.sponsor}
								</span>
							)}
						</div>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onRemove("trial", trial._id)}
						className="text-red-600 hover:text-red-700"
					>
						<BookmarkX className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-gray-600 line-clamp-2 mb-3">
					{trial.description}
				</p>
				<Link href={`/researcher/trials/${trial._id}`}>
					<Button variant="outline" size="sm">
						View Details
						<ExternalLink className="ml-2 h-3 w-3" />
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
}

// Publication Card Component
function PublicationCard({ favorite, onRemove }: any) {
	const pub = favorite.details;
	if (!pub) return null;

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<CardTitle className="text-lg mb-2">
							{pub.title}
						</CardTitle>
						{pub.authors && (
							<p className="text-sm text-muted-foreground mb-2">
								{pub.authors.slice(0, 3).join(", ")}
								{pub.authors.length > 3 && " et al."}
							</p>
						)}
						{pub.journal && (
							<Badge variant="outline" className="mb-2">
								{pub.journal}
							</Badge>
						)}
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onRemove("publication", pub._id)}
						className="text-red-600 hover:text-red-700"
					>
						<BookmarkX className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{pub.summary && (
					<p className="text-sm text-gray-600 line-clamp-3 mb-3">
						{pub.summary}
					</p>
				)}
				<div className="flex gap-2">
					{pub.doiURL && (
						<Link href={pub.doiURL} target="_blank">
							<Button variant="outline" size="sm">
								Read Full Paper
								<ExternalLink className="ml-2 h-3 w-3" />
							</Button>
						</Link>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

// Collaborator Card Component
function CollaboratorCard({ favorite, onRemove }: any) {
	const collaborator = favorite.details;
	if (!collaborator) return null;

	return (
		<Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-600">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<CardTitle className="text-lg mb-2">
							{collaborator.name}
						</CardTitle>
						{collaborator.specialization && (
							<Badge className="mb-2 bg-purple-600">
								{collaborator.specialization}
							</Badge>
						)}
						<div className="space-y-1 text-sm text-muted-foreground">
							{collaborator.institution && (
								<p className="flex items-center gap-1">
									<Building className="h-3 w-3" />
									{collaborator.institution}
								</p>
							)}
							{collaborator.location && (
								<p className="flex items-center gap-1">
									<MapPin className="h-3 w-3" />
									{typeof collaborator.location === "string"
										? collaborator.location
										: `${
												collaborator.location.city || ""
										  }, ${
												collaborator.location.country ||
												""
										  }`
												.trim()
												.replace(/^,\s*/, "")}
								</p>
							)}
							{collaborator.email && (
								<p className="flex items-center gap-1">
									<Mail className="h-3 w-3" />
									{collaborator.email}
								</p>
							)}
						</div>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() =>
							onRemove("collaborator", collaborator._id)
						}
						className="text-red-600 hover:text-red-700"
					>
						<BookmarkX className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			{collaborator.researchFocus && (
				<CardContent>
					<p className="text-sm text-gray-600 line-clamp-2 mb-3">
						{collaborator.researchFocus}
					</p>
					<Button variant="outline" size="sm">
						<Mail className="mr-2 h-3 w-3" />
						Contact
					</Button>
				</CardContent>
			)}
		</Card>
	);
}
