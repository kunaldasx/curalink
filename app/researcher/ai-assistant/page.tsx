"use client";

import { useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Brain,
	Users,
	FileText,
	Lightbulb,
	Loader2,
	CheckCircle2,
	AlertCircle,
	TrendingUp,
	Target,
	MessageSquare,
} from "lucide-react";
import {
	generateRecruitmentStrategy,
	analyzeEligibilityCriteria,
	suggestTrialImprovements,
	generatePatientFriendlyDescription,
	type RecruitmentStrategy,
	type PatientEligibilityAnalysis,
	type TrialDesignSuggestions,
} from "@/utils/ai";

type Mode =
	| "recruitment"
	| "eligibility"
	| "design"
	| "translate";

export default function ResearcherAIAssistant() {
	const [mode, setMode] = useState<Mode>("recruitment");
	const [input, setInput] = useState("");
	const [secondaryInput, setSecondaryInput] = useState("");
	const [loading, setLoading] = useState(false);

	// Results state
	const [recruitmentResult, setRecruitmentResult] =
		useState<RecruitmentStrategy | null>(null);
	const [eligibilityResult, setEligibilityResult] =
		useState<PatientEligibilityAnalysis | null>(null);
	const [designResult, setDesignResult] =
		useState<TrialDesignSuggestions | null>(null);
	const [translatedResult, setTranslatedResult] = useState("");

	const modes = [
		{
			id: "recruitment" as Mode,
			title: "Recruitment Strategy",
			icon: Users,
			description: "Get patient recruitment recommendations",
			gradient: "from-blue-500 to-cyan-500",
		},
		{
			id: "eligibility" as Mode,
			title: "Eligibility Analysis",
			icon: CheckCircle2,
			description: "Analyze criteria for patient-friendliness",
			gradient: "from-emerald-500 to-teal-500",
		},
		{
			id: "design" as Mode,
			title: "Trial Design Review",
			icon: Lightbulb,
			description: "Get patient-centered design suggestions",
			gradient: "from-purple-500 to-pink-500",
		},
		{
			id: "translate" as Mode,
			title: "Patient-Friendly Translation",
			icon: FileText,
			description: "Convert technical text to patient language",
			gradient: "from-amber-500 to-orange-500",
		},
	];

	const handleRecruitment = async () => {
		if (!input || !secondaryInput) return;
		setLoading(true);
		setRecruitmentResult(null);
		try {
			const result = await generateRecruitmentStrategy(input, secondaryInput);
			setRecruitmentResult(result);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleEligibility = async () => {
		if (!input) return;
		setLoading(true);
		setEligibilityResult(null);
		try {
			const result = await analyzeEligibilityCriteria(input);
			setEligibilityResult(result);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleDesign = async () => {
		if (!input) return;
		setLoading(true);
		setDesignResult(null);
		try {
			const result = await suggestTrialImprovements(input);
			setDesignResult(result);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleTranslate = async () => {
		if (!input) return;
		setLoading(true);
		setTranslatedResult("");
		try {
			const result = await generatePatientFriendlyDescription(input);
			setTranslatedResult(result);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			{/* Header */}
			<div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 shadow-lg">
				<h1
					className="text-4xl font-bold mb-3"
					style={{
						background:
							"linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
					}}
				>
					Researcher AI Assistant
				</h1>
				<p className="text-lg text-gray-700">
					🔬 Patient-centered tools for clinical trial success
				</p>
			</div>

			{/* Mode Selection */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{modes.map((m) => (
					<Card
						key={m.id}
						className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl ${
							mode === m.id
								? "ring-4 ring-blue-400 shadow-xl"
								: "hover:ring-2 hover:ring-blue-200"
						}`}
						onClick={() => {
							setMode(m.id);
							setInput("");
							setSecondaryInput("");
							setRecruitmentResult(null);
							setEligibilityResult(null);
							setDesignResult(null);
							setTranslatedResult("");
						}}
					>
						<CardContent className="p-6">
							<div
								className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center mb-4 shadow-md`}
							>
								<m.icon className="h-7 w-7 text-white" />
							</div>
							<h3 className="font-bold text-lg mb-2">{m.title}</h3>
							<p className="text-sm text-gray-600">{m.description}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Input Card */}
			<Card className="rounded-2xl shadow-lg border-0">
				<CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl">
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-6 w-6" />
						{modes.find((m) => m.id === mode)?.title}
					</CardTitle>
					<CardDescription className="text-white/90">
						{modes.find((m) => m.id === mode)?.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="p-6 space-y-4">
					{mode === "recruitment" && (
						<>
							<div>
								<Label htmlFor="trialInfo" className="text-base font-semibold">
									Trial Information *
								</Label>
								<Textarea
									id="trialInfo"
									placeholder="Describe your clinical trial (purpose, phase, intervention, etc.)"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									rows={4}
									className="mt-2 rounded-xl"
								/>
							</div>
							<div>
								<Label
									htmlFor="targetPop"
									className="text-base font-semibold"
								>
									Target Population *
								</Label>
								<Textarea
									id="targetPop"
									placeholder="Describe your ideal participants (demographics, conditions, characteristics)"
									value={secondaryInput}
									onChange={(e) => setSecondaryInput(e.target.value)}
									rows={3}
									className="mt-2 rounded-xl"
								/>
							</div>
							<Button
								onClick={handleRecruitment}
								disabled={loading || !input || !secondaryInput}
								className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Generating Strategy...
									</>
								) : (
									<>
										<Users className="mr-2 h-5 w-5" />
										Generate Recruitment Strategy
									</>
								)}
							</Button>
						</>
					)}

					{mode === "eligibility" && (
						<>
							<div>
								<Label htmlFor="criteria" className="text-base font-semibold">
									Eligibility Criteria *
								</Label>
								<Textarea
									id="criteria"
									placeholder="Paste your inclusion/exclusion criteria"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									rows={6}
									className="mt-2 rounded-xl"
								/>
							</div>
							<Button
								onClick={handleEligibility}
								disabled={loading || !input}
								className="w-full py-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Analyzing...
									</>
								) : (
									<>
										<CheckCircle2 className="mr-2 h-5 w-5" />
										Analyze Eligibility Criteria
									</>
								)}
							</Button>
						</>
					)}

					{mode === "design" && (
						<>
							<div>
								<Label htmlFor="design" className="text-base font-semibold">
									Trial Design Details *
								</Label>
								<Textarea
									id="design"
									placeholder="Describe your trial design (protocol, procedures, visit schedule, patient burden, etc.)"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									rows={6}
									className="mt-2 rounded-xl"
								/>
							</div>
							<Button
								onClick={handleDesign}
								disabled={loading || !input}
								className="w-full py-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Reviewing...
									</>
								) : (
									<>
										<Lightbulb className="mr-2 h-5 w-5" />
										Get Design Suggestions
									</>
								)}
							</Button>
						</>
					)}

					{mode === "translate" && (
						<>
							<div>
								<Label htmlFor="technical" className="text-base font-semibold">
									Technical Description *
								</Label>
								<Textarea
									id="technical"
									placeholder="Paste technical trial description or scientific text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									rows={6}
									className="mt-2 rounded-xl"
								/>
							</div>
							<Button
								onClick={handleTranslate}
								disabled={loading || !input}
								className="w-full py-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Translating...
									</>
								) : (
									<>
										<FileText className="mr-2 h-5 w-5" />
										Generate Patient-Friendly Version
									</>
								)}
							</Button>
						</>
					)}
				</CardContent>
			</Card>

			{/* Results Display */}
			{recruitmentResult && mode === "recruitment" && (
				<Card className="rounded-3xl border-0 shadow-xl animate-fade-in-up">
					<CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-3xl">
						<CardTitle className="flex items-center gap-2">
							<Target className="h-6 w-6" />
							Recruitment Strategy
						</CardTitle>
						<CardDescription className="text-white/90">
							Tailored approach for reaching the right patients
						</CardDescription>
					</CardHeader>
					<CardContent className="p-6 space-y-6">
						<div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
							<h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
								<Users className="h-5 w-5" />
								Target Audience
							</h3>
							<div className="flex flex-wrap gap-2">
								{recruitmentResult.targetAudience.map((audience, i) => (
									<Badge
										key={i}
										className="px-4 py-2 bg-blue-500 text-white"
									>
										{audience}
									</Badge>
								))}
							</div>
						</div>

						<div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
							<h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
								<TrendingUp className="h-5 w-5" />
								Recommended Channels
							</h3>
							<ul className="space-y-2">
								{recruitmentResult.channels.map((channel, i) => (
									<li key={i} className="flex items-start gap-2">
										<CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
										<span className="text-gray-700">{channel}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
							<h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
								<MessageSquare className="h-5 w-5" />
								Key Messages
							</h3>
							<ul className="space-y-2">
								{recruitmentResult.messaging.map((msg, i) => (
									<li key={i} className="flex items-start gap-2">
										<span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-semibold">
											{i + 1}
										</span>
										<span className="text-gray-700">{msg}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
								<h3 className="font-semibold text-amber-800 mb-2">
									Timeline
								</h3>
								<p className="text-gray-700">{recruitmentResult.timeline}</p>
							</div>
							<div className="p-4 bg-red-50 rounded-2xl border border-red-200">
								<h3 className="font-semibold text-red-800 mb-2">
									Important Considerations
								</h3>
								<ul className="space-y-1">
									{recruitmentResult.considerations.map((consideration, i) => (
										<li key={i} className="text-sm text-gray-700">
											• {consideration}
										</li>
									))}
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{eligibilityResult && mode === "eligibility" && (
				<Card className="rounded-3xl border-0 shadow-xl animate-fade-in-up">
					<CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-3xl">
						<CardTitle className="flex items-center gap-2">
							<CheckCircle2 className="h-6 w-6" />
							Eligibility Analysis
						</CardTitle>
						<CardDescription className="text-white/90">
							Patient-friendliness assessment
						</CardDescription>
					</CardHeader>
					<CardContent className="p-6 space-y-6">
						<div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
							<p className="text-sm text-gray-600 mb-2">
								Estimated Eligible Population
							</p>
							<p className="text-5xl font-bold text-emerald-600">
								{eligibilityResult.likelyEligible}%
							</p>
						</div>

						{eligibilityResult.requiredCriteria.length > 0 && (
							<div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
								<h3 className="font-semibold text-blue-800 mb-3">
									Required Criteria (Simplified)
								</h3>
								<ul className="space-y-2">
									{eligibilityResult.requiredCriteria.map((criteria, i) => (
										<li key={i} className="flex items-start gap-2">
											<CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
											<span className="text-gray-700">{criteria}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{eligibilityResult.optionalCriteria.length > 0 && (
							<div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
								<h3 className="font-semibold text-purple-800 mb-3">
									Optional Criteria
								</h3>
								<ul className="space-y-2">
									{eligibilityResult.optionalCriteria.map((criteria, i) => (
										<li key={i} className="flex items-start gap-2">
											<AlertCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
											<span className="text-gray-700">{criteria}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{eligibilityResult.exclusions.length > 0 && (
							<div className="p-4 bg-red-50 rounded-2xl border border-red-200">
								<h3 className="font-semibold text-red-800 mb-3">Exclusions</h3>
								<ul className="space-y-2">
									{eligibilityResult.exclusions.map((exclusion, i) => (
										<li key={i} className="flex items-start gap-2">
											<AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
											<span className="text-gray-700">{exclusion}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						<div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
							<h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
								<Lightbulb className="h-5 w-5" />
								Recommendations for Improvement
							</h3>
							<ul className="space-y-2">
								{eligibilityResult.recommendations.map((rec, i) => (
									<li key={i} className="flex items-start gap-2">
										<TrendingUp className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
										<span className="text-gray-700">{rec}</span>
									</li>
								))}
							</ul>
						</div>
					</CardContent>
				</Card>
			)}

			{designResult && mode === "design" && (
				<Card className="rounded-3xl border-0 shadow-xl animate-fade-in-up">
					<CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-3xl">
						<CardTitle className="flex items-center gap-2">
							<Lightbulb className="h-6 w-6" />
							Trial Design Review
						</CardTitle>
						<CardDescription className="text-white/90">
							Patient-centered feedback and suggestions
						</CardDescription>
					</CardHeader>
					<CardContent className="p-6 space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
								<h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5" />
									Strengths
								</h3>
								<ul className="space-y-2">
									{designResult.strengths.map((strength, i) => (
										<li key={i} className="flex items-start gap-2">
											<CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
											<span className="text-gray-700">{strength}</span>
										</li>
									))}
								</ul>
							</div>

							<div className="p-5 bg-blue-50 rounded-2xl border border-blue-200">
								<h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
									<TrendingUp className="h-5 w-5" />
									Suggested Improvements
								</h3>
								<ul className="space-y-2">
									{designResult.improvements.map((improvement, i) => (
										<li key={i} className="flex items-start gap-2">
											<Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
											<span className="text-gray-700">{improvement}</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="p-5 bg-amber-50 rounded-2xl border border-amber-200">
							<h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
								<AlertCircle className="h-5 w-5" />
								Patient Burden Assessment
							</h3>
							<p className="text-gray-700">{designResult.patientBurden}</p>
						</div>

						<div className="p-5 bg-purple-50 rounded-2xl border border-purple-200">
							<h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
								<Users className="h-5 w-5" />
								Recruitment Tips
							</h3>
							<ul className="space-y-2">
								{designResult.recruitmentTips.map((tip, i) => (
									<li key={i} className="flex items-start gap-2">
										<CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
										<span className="text-gray-700">{tip}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="p-5 bg-red-50 rounded-2xl border border-red-200">
							<h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
								<AlertCircle className="h-5 w-5" />
								Ethical Considerations
							</h3>
							<ul className="space-y-2">
								{designResult.ethicalConsiderations.map((consideration, i) => (
									<li key={i} className="flex items-start gap-2">
										<AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
										<span className="text-gray-700">{consideration}</span>
									</li>
								))}
							</ul>
						</div>
					</CardContent>
				</Card>
			)}

			{translatedResult && mode === "translate" && (
				<Card className="rounded-3xl border-0 shadow-xl animate-fade-in-up">
					<CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-3xl">
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-6 w-6" />
							Patient-Friendly Version
						</CardTitle>
						<CardDescription className="text-white/90">
							8th-grade reading level, empathetic language
						</CardDescription>
					</CardHeader>
					<CardContent className="p-6">
						<div className="p-6 bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl border-2 border-amber-200">
							<p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
								{translatedResult}
							</p>
						</div>
						<div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
							<p className="text-sm text-emerald-800 flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4" />
								This version uses simple language patients can understand and
								focuses on their experience
							</p>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
