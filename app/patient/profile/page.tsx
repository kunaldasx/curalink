"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, X, Plus, RefreshCw, Loader2 } from "lucide-react";

export default function PatientProfile() {
	const [user, setUser] = useState<any>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const router = useRouter();

	// Edit state
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [city, setCity] = useState("");
	const [country, setCountry] = useState("");
	const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
	const [conditions, setConditions] = useState<string[]>([]);
	const [conditionInput, setConditionInput] = useState("");

	const suggestedConditions = [
		"Diabetes",
		"Heart Disease",
		"Cancer",
		"Alzheimer's",
		"Parkinson's",
		"Multiple Sclerosis",
		"Asthma",
		"Arthritis",
	];

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/user/me");
			const data = await res.json();
			setUser(data);
			// Populate edit fields
			setName(data.name || "");
			setEmail(data.email || "");
			setCity(data.location?.city || "");
			setCountry(data.location?.country || "");
			setConditions(data.medicalConditions || []);
		} catch (error) {
			console.error("Error fetching profile:", error);
		} finally {
			setLoading(false);
		}
	};

	const addCondition = (condition: string) => {
		const trimmed = condition.trim();
		if (trimmed && !conditions.includes(trimmed)) {
			setConditions([...conditions, trimmed]);
			setConditionInput("");
		}
	};

	const removeCondition = (condition: string) => {
		setConditions(conditions.filter((c) => c !== condition));
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			const response = await fetch("/api/user/update-profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					location: { city, country },
					conditions: naturalLanguageInput,
					additionalConditions: conditions,
				}),
			});

			if (response.ok) {
				await fetchUserProfile();
				setIsEditing(false);
				setNaturalLanguageInput("");

				// Trigger recommendations refresh
				await refreshRecommendations();
			}
		} catch (error) {
			console.error("Error saving profile:", error);
		} finally {
			setSaving(false);
		}
	};

	const refreshRecommendations = async () => {
		setRefreshing(true);
		try {
			// Call prepopulate API to refresh recommendations
			await fetch("/api/recommendations/prepopulate", {
				method: "POST",
			});
		} catch (error) {
			console.error("Error refreshing recommendations:", error);
		} finally {
			setRefreshing(false);
		}
	};

	const handleCancel = () => {
		// Reset to original values
		setName(user?.name || "");
		setEmail(user?.email || "");
		setCity(user?.location?.city || "");
		setCountry(user?.location?.country || "");
		setConditions(user?.medicalConditions || []);
		setNaturalLanguageInput("");
		setIsEditing(false);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			{/* Page Header with Gradient */}
			<div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-medical-teal-50 via-medical-indigo-50 to-medical-lavender-50 border border-medical-teal-100 shadow-lg animate-fade-in-up">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
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
							My Profile
						</h1>
						<p className="text-lg text-gray-700">
							👤 View and edit your personal information and
							preferences
						</p>
					</div>
					{!isEditing ? (
						<Button
							onClick={() => setIsEditing(true)}
							className="px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
						>
							<Edit2 className="mr-2 h-5 w-5" />
							Edit Profile
						</Button>
					) : (
						<div className="flex gap-3">
							<Button
								onClick={handleCancel}
								className="px-6 py-4 rounded-xl font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-all duration-200"
							>
								<X className="mr-2 h-5 w-5" />
								Cancel
							</Button>
							<Button
								onClick={handleSave}
								disabled={saving}
								className="px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50"
							>
								{saving ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Save className="mr-2 h-5 w-5" />
										Save Changes
									</>
								)}
							</Button>
						</div>
					)}
				</div>
			</div>

			{refreshing && (
				<Card className="mb-6 border-blue-200 bg-blue-50">
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<Loader2 className="h-5 w-5 animate-spin text-blue-600" />
							<p className="text-sm text-blue-800">
								Refreshing your personalized recommendations
								based on updated profile...
							</p>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Personal Information */}
			<Card className="mb-8 rounded-2xl shadow-lg border-0">
				<CardHeader>
					<CardTitle className="text-xl font-bold text-gray-800">
						Personal Information
					</CardTitle>
					<CardDescription className="text-base">
						Your basic account details
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							{isEditing ? (
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							) : (
								<p className="text-sm py-2">{user?.name}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<p className="text-sm py-2 text-muted-foreground">
								{user?.email} (cannot be changed)
							</p>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="city">City</Label>
							{isEditing ? (
								<Input
									id="city"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									placeholder="e.g., Boston"
								/>
							) : (
								<p className="text-sm py-2">
									{user?.location?.city || "Not set"}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="country">Country</Label>
							{isEditing ? (
								<Input
									id="country"
									value={country}
									onChange={(e) => setCountry(e.target.value)}
									placeholder="e.g., USA"
								/>
							) : (
								<p className="text-sm py-2">
									{user?.location?.country || "Not set"}
								</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Medical Conditions */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Medical Conditions & Preferences</CardTitle>
					<CardDescription>
						{isEditing
							? "Update your conditions to get better recommendations"
							: "Your tracked medical conditions"}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{isEditing && (
						<>
							{/* Natural Language Input */}
							<div className="space-y-2">
								<Label htmlFor="naturalLanguage">
									Describe your situation (optional)
								</Label>
								<Textarea
									id="naturalLanguage"
									placeholder="e.g., I have brain cancer and experience frequent headaches..."
									value={naturalLanguageInput}
									onChange={(e) =>
										setNaturalLanguageInput(e.target.value)
									}
									rows={3}
									className="resize-none"
								/>
								<p className="text-xs text-muted-foreground">
									AI will extract relevant conditions from
									your description
								</p>
							</div>

							{/* Add Specific Conditions */}
							<div className="space-y-2">
								<Label>Add Specific Conditions</Label>
								<div className="flex gap-2">
									<Input
										placeholder="Type a condition and press Enter"
										value={conditionInput}
										onChange={(e) =>
											setConditionInput(e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addCondition(conditionInput);
											}
										}}
									/>
									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={() =>
											addCondition(conditionInput)
										}
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div>

								{/* Suggested Conditions */}
								<div className="space-y-2">
									<p className="text-xs text-muted-foreground">
										Quick add:
									</p>
									<div className="flex flex-wrap gap-2">
										{suggestedConditions.map(
											(condition) => (
												<Badge
													key={condition}
													variant="outline"
													className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
													onClick={() =>
														addCondition(condition)
													}
												>
													+ {condition}
												</Badge>
											)
										)}
									</div>
								</div>
							</div>
						</>
					)}

					{/* Display Current Conditions */}
					<div className="space-y-2">
						<Label>Current Conditions</Label>
						{conditions.length > 0 ? (
							<div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-md">
								{conditions.map((condition) => (
									<Badge
										key={condition}
										className="flex items-center gap-1"
									>
										{condition}
										{isEditing && (
											<X
												className="h-3 w-3 cursor-pointer"
												onClick={() =>
													removeCondition(condition)
												}
											/>
										)}
									</Badge>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground py-2">
								No conditions added yet
							</p>
						)}
					</div>

					{isEditing && (
						<div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
							<p className="text-sm font-medium mb-2">
								💡 Why update your profile?
							</p>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>
									✓ Get more relevant clinical trial
									recommendations
								</li>
								<li>
									✓ Connect with experts specialized in your
									conditions
								</li>
								<li>
									✓ Discover the latest research publications
								</li>
								<li>
									✓ Receive personalized nearby and global
									results
								</li>
							</ul>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Account Statistics */}
			<Card>
				<CardHeader>
					<CardTitle>Account Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">
							Account Type:
						</span>
						<span className="font-medium capitalize">
							{user?.role}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">
							Member Since:
						</span>
						<span className="font-medium">
							{new Date(user?.createdAt).toLocaleDateString()}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">
							Tracked Conditions:
						</span>
						<span className="font-medium">{conditions.length}</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
