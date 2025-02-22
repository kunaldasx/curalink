"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	X,
	Plus,
	ArrowRight,
	ArrowLeft,
	Check,
	Sparkles,
	Loader2,
	Beaker,
	GraduationCap,
	Link2,
	Users,
	FileText,
} from "lucide-react";

export default function ResearcherOnboarding() {
	const [currentStep, setCurrentStep] = useState(1);
	const [specialties, setSpecialties] = useState<string[]>([]);
	const [specialtyInput, setSpecialtyInput] = useState("");
	const [researchInterests, setResearchInterests] = useState<string[]>([]);
	const [interestInput, setInterestInput] = useState("");
	const [orcidId, setOrcidId] = useState("");
	const [researchGateUrl, setResearchGateUrl] = useState("");
	const [acceptsMeetings, setAcceptsMeetings] = useState(true);
	const [fetchingPublications, setFetchingPublications] = useState(false);
	const [publications, setPublications] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [direction, setDirection] = useState<"forward" | "backward">("forward");
	const router = useRouter();

	// Suggested specialties
	const suggestedSpecialties = [
		"Oncology",
		"Neurology",
		"Immunology",
		"Cardiology",
		"Endocrinology",
		"Gastroenterology",
		"Pulmonology",
		"Nephrology",
	];

	// Suggested research interests
	const suggestedInterests = [
		"Immunotherapy",
		"Clinical AI",
		"Gene Therapy",
		"Precision Medicine",
		"Drug Development",
		"Biomarker Research",
		"Patient Recruitment",
		"Clinical Trials",
	];

	const addSpecialty = (specialty: string) => {
		const trimmed = specialty.trim();
		if (trimmed && !specialties.includes(trimmed)) {
			setSpecialties([...specialties, trimmed]);
			setSpecialtyInput("");
		}
	};

	const removeSpecialty = (specialty: string) => {
		setSpecialties(specialties.filter((s) => s !== specialty));
	};

	const addInterest = (interest: string) => {
		const trimmed = interest.trim();
		if (trimmed && !researchInterests.includes(trimmed)) {
			setResearchInterests([...researchInterests, trimmed]);
			setInterestInput("");
		}
	};

	const removeInterest = (interest: string) => {
		setResearchInterests(researchInterests.filter((i) => i !== interest));
	};

	const toggleInterest = (interest: string) => {
		if (researchInterests.includes(interest)) {
			removeInterest(interest);
		} else {
			addInterest(interest);
		}
	};

	const fetchPublications = async () => {
		if (!orcidId && !researchGateUrl) return;

		setFetchingPublications(true);
		try {
			const response = await fetch("/api/researcher/import-publications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orcidId, researchGateUrl }),
			});

			if (response.ok) {
				const data = await response.json();
				setPublications(data.publications || []);
			} else {
				console.error("Failed to fetch publications:", await response.text());
			}
		} catch (error) {
			console.error("Error fetching publications:", error);
		} finally {
			setFetchingPublications(false);
		}
	};

	const nextStep = () => {
		if (currentStep < 5) {
			setDirection("forward");
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setDirection("backward");
			setCurrentStep(currentStep - 1);
		}
	};

	const canProgress = () => {
		switch (currentStep) {
			case 1:
				return specialties.length > 0;
			case 2:
				return researchInterests.length > 0;
			case 3:
				return true; // Optional
			case 4:
				return true;
			case 5:
				return true;
			default:
				return false;
		}
	};

	const handleSubmit = async () => {
		setLoading(true);

		try {
			const response = await fetch("/api/user/onboarding", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					specialties,
					researchInterests,
					orcidId,
					researchGateUrl,
					publications,
					acceptsMeetings,
				}),
			});

			if (response.ok) {
				router.push("/researcher/dashboard");
			}
		} catch (error) {
			console.error("Onboarding error:", error);
			setLoading(false);
		}
	};

	const stepTitles = [
		"Your Expertise",
		"Research Interests",
		"Academic Profiles",
		"Meeting Availability",
		"Let's Get Started!",
	];

	const stepMessages = [
		"Tell us about your specialties 🔬",
		"What research areas interest you?",
		"Connect your academic profiles",
		"Set your collaboration preferences",
		"Almost there!",
	];

	return (
		<div className="min-h-screen gradient-research flex items-center justify-center px-4 md:px-8 py-6 md:py-8">
			<div className="w-full max-w-2xl">
				{/* Progress Indicator */}
				<div className="mb-6 md:mb-8 animate-fade-in-down">
					{/* Progress Bar */}
					<div className="relative h-4 md:h-5 bg-white/20 rounded-full overflow-visible shadow-sm mt-8 mx-4 mb-8 md:mb-10">
						<div
							className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out shadow-lg"
							style={{
								width: `${(currentStep / 5) * 100}%`,
								background:
									"linear-gradient(90deg, #3b82f6 0%, #8b5cf6 25%, #a855f7 50%, #ec4899 75%, #f43f5e 100%)",
							}}
						>
							<div
								className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
								style={{ backgroundSize: "200% 100%" }}
							/>
						</div>

						{/* Progress Dots */}
						<div className="absolute -top-2 md:-top-3 left-0 w-full flex justify-between px-0">
							{[1, 2, 3, 4, 5].map((step) => (
								<div
									key={step}
									className="relative flex flex-col items-center"
									style={{
										left: `${((step - 1) / 4) * 100}%`,
										transform: "translateX(-50%)",
										position: "absolute",
									}}
								>
									{step === currentStep && (
										<div className="absolute h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/30 animate-ping" />
									)}

									<div
										className={`relative h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
											step < currentStep
												? "bg-white text-blue-500 shadow-xl scale-100"
												: step === currentStep
												? "bg-white text-purple-600 shadow-2xl scale-125 ring-4 ring-white/50"
												: "bg-white/40 text-white/60 shadow-md scale-90"
										}`}
									>
										{step < currentStep ? (
											<Check className="h-4 w-4 md:h-5 md:w-5 stroke-[3]" />
										) : (
											<span className="text-sm md:text-base">{step}</span>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Step Info */}
					<div className="text-center px-4">
						<p className="text-xl md:text-2xl font-bold text-white mb-2">
							{stepTitles[currentStep - 1]}
						</p>
						<p className="text-sm md:text-base text-white/90">
							{stepMessages[currentStep - 1]}
						</p>
					</div>
				</div>

				{/* Card Container */}
				<Card
					className={`shadow-2xl transition-all duration-500 border-0 ${
						direction === "forward" ? "animate-fade-slide" : "animate-fade-in-up"
					}`}
				>
					<div className="p-6 md:p-10 lg:p-12">
					{/* Step 1: Specialties */}
					{currentStep === 1 && (
						<div className="space-y-8 animate-fade-in-up">
							<div className="text-center mb-8">
								<div
									className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-bounce relative"
									style={{
										background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
									}}
								>
									<Beaker className="h-10 w-10 text-white" />
									<div
										className="absolute inset-0 rounded-full animate-ping opacity-20"
										style={{
											background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
										}}
									/>
								</div>
								<h2
									className="text-3xl md:text-4xl font-bold mb-3"
									style={{
										background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										backgroundClip: "text",
									}}
								>
									Welcome to CuraLink!
								</h2>
								<p className="text-lg text-gray-600">
									Let's set up your research profile
								</p>
							</div>

							<div className="space-y-4">
								<Label className="text-lg font-semibold text-gray-800 block">
									Your Specialties
								</Label>
								<Input
									placeholder="Type a specialty and press Enter (e.g., Oncology)"
									value={specialtyInput}
									onChange={(e) => setSpecialtyInput(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addSpecialty(specialtyInput);
										}
									}}
									className="text-base rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
								/>

								<div className="flex flex-wrap gap-2">
									{suggestedSpecialties.map((specialty) => (
										<button
											key={specialty}
											onClick={() => addSpecialty(specialty)}
											className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 flex items-center gap-2"
										>
											<Plus className="h-3 w-3" />
											{specialty}
										</button>
									))}
								</div>

								{specialties.length > 0 && (
									<div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
										<Label className="text-sm font-semibold text-gray-700 mb-3 block">
											Selected Specialties ({specialties.length})
										</Label>
										<div className="flex flex-wrap gap-2">
											{specialties.map((specialty) => (
												<Badge
													key={specialty}
													className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center gap-2 cursor-pointer hover:from-blue-600 hover:to-purple-600"
													onClick={() => removeSpecialty(specialty)}
												>
													{specialty}
													<X className="h-3 w-3" />
												</Badge>
											))}
										</div>
									</div>
								)}

								<div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
									<Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
									<p className="text-sm text-gray-700">
										Your specialties help categorize your profile and connect you with relevant opportunities
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Step 2: Research Interests */}
					{currentStep === 2 && (
						<div className="space-y-8 animate-fade-in-up">
							<div className="text-center mb-8">
								<div
									className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float relative"
									style={{
										background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
									}}
								>
									<GraduationCap className="h-10 w-10 text-white" />
								</div>
								<h2
									className="text-3xl md:text-4xl font-bold mb-3"
									style={{
										background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										backgroundClip: "text",
									}}
								>
									Research Interests
								</h2>
								<p className="text-lg text-gray-600">
									What areas of research interest you most?
								</p>
							</div>

							<div className="space-y-4">
								<Label className="text-lg font-semibold text-gray-800 block">
									Select Your Research Interests
								</Label>

								<div className="grid grid-cols-2 gap-3">
									{suggestedInterests.map((interest) => {
										const isSelected = researchInterests.includes(interest);
										return (
											<button
												key={interest}
												onClick={() => toggleInterest(interest)}
												className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between ${
													isSelected
														? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
														: "bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:shadow-md"
												}`}
											>
												<span>{interest}</span>
												{isSelected && <Check className="h-4 w-4" />}
											</button>
										);
									})}
								</div>

								<Input
									placeholder="Add custom interest..."
									value={interestInput}
									onChange={(e) => setInterestInput(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addInterest(interestInput);
										}
									}}
									className="text-base rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all"
								/>

								{researchInterests.length > 0 && (
									<div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
										<Sparkles className="h-5 w-5 text-purple-500 mb-2" />
										<p className="text-sm text-gray-700">
											We'll recommend relevant trials, papers, and collaboration opportunities based on these interests
										</p>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Step 3: Academic Profiles */}
					{currentStep === 3 && (
						<div className="space-y-8 animate-fade-in-up">
							<div className="text-center mb-8">
								<div
									className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-bounce relative"
									style={{
										background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)",
									}}
								>
									<Link2 className="h-10 w-10 text-white" />
								</div>
								<h2
									className="text-3xl md:text-4xl font-bold mb-3"
									style={{
										background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										backgroundClip: "text",
									}}
								>
									Connect Academic Profiles
								</h2>
								<p className="text-lg text-gray-600">
									Link your profiles to auto-import publications
								</p>
								<p className="text-sm text-gray-500 mt-2">(Optional)</p>
							</div>

							<div className="space-y-6">
								<div className="space-y-3">
									<Label htmlFor="orcid" className="text-base font-semibold text-gray-800 flex items-center gap-2">
										<FileText className="h-5 w-5 text-blue-500" />
										ORCID ID
									</Label>
									<Input
										id="orcid"
										placeholder="e.g., 0000-0002-1234-5678"
										value={orcidId}
										onChange={(e) => setOrcidId(e.target.value)}
										className="text-base rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all"
									/>
									<p className="text-xs text-gray-500">
										Auto-import your credentials and publications from ORCID
									</p>
								</div>

								<div className="space-y-3">
									<Label htmlFor="researchgate" className="text-base font-semibold text-gray-800 flex items-center gap-2">
										<FileText className="h-5 w-5 text-purple-500" />
										ResearchGate Profile
									</Label>
									<Input
										id="researchgate"
										placeholder="e.g., https://researchgate.net/profile/..."
										value={researchGateUrl}
										onChange={(e) => setResearchGateUrl(e.target.value)}
										className="text-base rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all"
									/>
									<p className="text-xs text-gray-500">
										Pull your academic contributions and connect with researchers
									</p>
								</div>

								{(orcidId || researchGateUrl) && (
									<Button
										onClick={fetchPublications}
										disabled={fetchingPublications}
										className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
									>
										{fetchingPublications ? (
											<>
												<Loader2 className="mr-2 h-5 w-5 animate-spin" />
												Fetching Publications...
											</>
										) : (
											<>
												<Sparkles className="mr-2 h-5 w-5" />
												Import Publications
											</>
										)}
									</Button>
								)}

								{publications.length > 0 && (
								<div className="space-y-3">
									<div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
										<Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
											<Check className="h-5 w-5 text-green-500" />
											Successfully imported {publications.length} publication{publications.length !== 1 ? 's' : ''}!
										</Label>
										<p className="text-xs text-gray-600">
											AI-generated summaries will be created for your publications to help patients understand your work
										</p>
									</div>

									<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
										{publications.map((pub: any, index: number) => (
											<div
												key={index}
												className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
											>
												<div className="flex items-start gap-3">
													<div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
														{index + 1}
													</div>
													<div className="flex-1 min-w-0">
														<h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
															{pub.title || 'Untitled Publication'}
														</h4>
														
														{pub.authors && (
															<p className="text-xs text-gray-600 mb-1">
																<span className="font-medium">Authors:</span> {Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}
															</p>
														)}
														
														<div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
															{pub.year && (
																<Badge className="bg-blue-100 text-blue-700 text-xs">
																	{pub.year}
																</Badge>
															)}
															{pub.journal && (
																<span className="truncate">{pub.journal}</span>
															)}
															{pub.doi && (
																<a
																	href={`https://doi.org/${pub.doi}`}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-blue-500 hover:text-blue-700 underline flex items-center gap-1"
																>
																	DOI
																	<ArrowRight className="h-3 w-3" />
																</a>
															)}
														</div>

														{pub.summary && (
															<div className="mt-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
																<div className="flex items-start gap-2">
																	<Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
																	<div>
																		<p className="text-xs font-semibold text-purple-700 mb-1">AI Summary for Patients:</p>
																		<p className="text-xs text-gray-700 leading-relaxed">
																			{pub.summary}
																		</p>
																	</div>
																</div>
															</div>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

								<div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
									<Sparkles className="h-5 w-5 text-blue-500 mb-2" />
									<p className="text-sm text-gray-700">
										Your publications will be displayed with AI-generated summaries that are simple and clear for patients to understand
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Step 4: Meeting Availability */}
					{currentStep === 4 && (
						<div className="space-y-8 animate-fade-in-up">
							<div className="text-center mb-8">
								<div
									className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float relative"
									style={{
										background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
									}}
								>
									<Users className="h-10 w-10 text-white" />
								</div>
								<h2
									className="text-3xl md:text-4xl font-bold mb-3"
									style={{
										background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										backgroundClip: "text",
									}}
								>
									Meeting Availability
								</h2>
								<p className="text-lg text-gray-600">
									Set your collaboration preferences
								</p>
							</div>

							<div className="space-y-6">
								<div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
									<div className="flex items-start gap-4">
										<input
											type="checkbox"
											id="acceptsMeetings"
											checked={acceptsMeetings}
											onChange={(e) => setAcceptsMeetings(e.target.checked)}
											className="mt-1 h-5 w-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
										/>
										<div className="flex-1">
											<Label htmlFor="acceptsMeetings" className="text-base font-semibold text-gray-800 cursor-pointer">
												I'm available for meeting requests from patients
											</Label>
											<p className="text-sm text-gray-600 mt-2">
												Patients seeking expert guidance can request consultations with you. You'll be notified and can choose to accept or decline.
											</p>
										</div>
									</div>
								</div>

								<div className="p-4 bg-white rounded-xl border border-gray-200">
									<h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
										<Sparkles className="h-5 w-5 text-purple-500" />
										Benefits of Enabling Meetings
									</h3>
									<ul className="space-y-2 text-sm text-gray-700">
										<li className="flex items-start gap-2">
											<Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
											<span>Build meaningful connections with patients</span>
										</li>
										<li className="flex items-start gap-2">
											<Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
											<span>Help patients better understand their conditions</span>
										</li>
										<li className="flex items-start gap-2">
											<Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
											<span>Identify potential participants for your trials</span>
										</li>
										<li className="flex items-start gap-2">
											<Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
											<span>You always have full control over your schedule</span>
										</li>
									</ul>
								</div>

								<div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
									<p className="text-sm text-gray-600 flex items-center justify-center gap-2">
										<Check className="h-4 w-4 text-blue-500" />
										You can change this setting anytime in your profile
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Step 5: Confirmation */}
					{currentStep === 5 && !loading && (
						<div className="space-y-6 animate-fade-in-up">
							<div className="text-center mb-6">
								<div
									className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-success-pop"
									style={{
										background: "linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)",
									}}
								>
									<Check className="h-8 w-8 text-white" />
								</div>
								<h2
									className="text-3xl md:text-4xl font-bold mb-3"
									style={{
										background: "linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										backgroundClip: "text",
									}}
								>
									Perfect! You're all set 🎉
								</h2>
								<p className="text-lg text-gray-600">
									Your researcher profile is ready
								</p>
							</div>

							<div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
								<h3 className="font-semibold text-gray-800 mb-4">Your Profile Summary</h3>
								<div className="space-y-3 text-sm">
									<div>
										<span className="font-semibold text-gray-700">Specialties:</span>
										<div className="flex flex-wrap gap-2 mt-1">
											{specialties.map((s) => (
												<Badge key={s} className="bg-blue-100 text-blue-700">
													{s}
												</Badge>
											))}
										</div>
									</div>
									<div>
										<span className="font-semibold text-gray-700">Research Interests:</span>
										<div className="flex flex-wrap gap-2 mt-1">
											{researchInterests.map((i) => (
												<Badge key={i} className="bg-purple-100 text-purple-700">
													{i}
												</Badge>
											))}
										</div>
									</div>
									{(orcidId || researchGateUrl) && (
										<div>
											<span className="font-semibold text-gray-700">Academic Profiles:</span>
											<p className="text-gray-600 mt-1">
												{orcidId && `ORCID: ${orcidId}`}
												{orcidId && researchGateUrl && " • "}
												{researchGateUrl && "ResearchGate connected"}
											</p>
										</div>
									)}
									<div>
										<span className="font-semibold text-gray-700">Meeting Availability:</span>
										<p className="text-gray-600 mt-1">
											{acceptsMeetings ? "✓ Available for meetings" : "Not accepting meetings"}
										</p>
									</div>
								</div>
							</div>

							<div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
								<div className="flex items-start gap-3 mb-4">
									<Sparkles className="h-6 w-6 text-purple-500 flex-shrink-0" />
									<div>
										<h3 className="font-semibold text-gray-800 mb-1">What happens next?</h3>
										<p className="text-sm text-gray-600">
											Your research profile is now live on CuraLink
										</p>
									</div>
								</div>
								<ul className="space-y-2 text-sm text-gray-700">
									<li className="flex items-start gap-2">
										<Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
										<span>Your profile becomes visible to patients seeking experts</span>
									</li>
									<li className="flex items-start gap-2">
										<Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
										<span>Receive collaboration and trial recruitment opportunities</span>
									</li>
									<li className="flex items-start gap-2">
										<Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
										<span>Access AI-powered trial management tools</span>
									</li>
									<li className="flex items-start gap-2">
										<Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
										<span>Connect with potential trial participants</span>
									</li>
								</ul>
							</div>
						</div>
					)}

					{loading && (
						<div className="text-center py-12">
							<Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
							<p className="text-lg text-gray-600">Setting up your profile...</p>
						</div>
					)}
					</div>
				</Card>

				{/* Navigation Buttons */}
				<div className="flex gap-4 mt-6">
					{currentStep > 1 && !loading && (
						<Button
							onClick={prevStep}
							variant="outline"
							className="flex-1 bg-white/90 hover:bg-white text-gray-700 border-0 h-14 text-lg rounded-xl shadow-lg"
						>
							<ArrowLeft className="mr-2 h-5 w-5" />
							Back
						</Button>
					)}

					{currentStep < 5 && (
						<Button
							onClick={nextStep}
							disabled={!canProgress()}
							className="flex-1 h-14 text-lg rounded-xl shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Continue
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					)}

					{currentStep === 5 && !loading && (
						<Button
							onClick={handleSubmit}
							className="flex-1 h-14 text-lg rounded-xl shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
						>
							Complete Setup
							<Sparkles className="ml-2 h-5 w-5" />
						</Button>
					)}

					{loading && (
						<div className="flex-1 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
							<Loader2 className="h-6 w-6 animate-spin text-white" />
						</div>
					)}
				</div>

				{/* Affirmation Messages */}
				{currentStep > 1 && currentStep < 5 && !loading && (
					<p className="text-center mt-4 text-sm text-white/80 animate-fade-in">
						{currentStep === 2 && "Great! Your expertise shines ✨"}
						{currentStep === 3 && "Perfect. Thanks for sharing 🙏"}
						{currentStep === 4 && "You're doing amazing! 💪"}
					</p>
				)}
			</div>
		</div>
	);
}
