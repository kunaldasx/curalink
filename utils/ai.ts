import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCIIofbiRFs56Js4URzRE7Cuz9RZxQpWLY");

// Types for AI Assistant responses
export interface EligibilityEstimate {
	score: number; // 0-100
	level: "high" | "medium" | "low";
	factors: {
		positive: string[];
		negative: string[];
		neutral: string[];
	};
	explanation: string;
}

export interface TravelBurden {
	score: number; // 0-100, higher = more burden
	level: "low" | "medium" | "high";
	factors: string[];
	recommendations: string[];
}

export interface SimplifiedTrial {
	summary: string;
	purpose: string;
	whatHappens: string;
	timeCommitment: string;
	risks: string;
	benefits: string;
}

export interface NextSteps {
	immediate: string[];
	shortTerm: string[];
	longTerm: string[];
	resources: string[];
}

// Researcher-specific types
export interface RecruitmentStrategy {
	targetAudience: string[];
	channels: string[];
	messaging: string[];
	timeline: string;
	considerations: string[];
}

export interface PatientEligibilityAnalysis {
	likelyEligible: number; // percentage
	requiredCriteria: string[];
	optionalCriteria: string[];
	exclusions: string[];
	recommendations: string[];
}

export interface TrialDesignSuggestions {
	strengths: string[];
	improvements: string[];
	patientBurden: string;
	recruitmentTips: string[];
	ethicalConsiderations: string[];
}

/**
 * Extract disease/condition keywords from natural language text
 */
export async function extractDiseaseKeywords(text: string): Promise<string[]> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `You are a medical assistant. Extract disease names and medical conditions from user input. Return ONLY a JSON array of strings, nothing else. No markdown, no explanations.

User input: "${text}"

Return format example: ["diabetes", "heart disease"]`;

		const result = await model.generateContent(prompt);
		const simplified = result.response.text()?.trim();

		// Remove markdown code blocks if present
		const cleanContent = simplified
			.replace(/```json\n?|\n?```/g, "")
			.trim();

		const keywords = JSON.parse(cleanContent);
		return Array.isArray(keywords) ? keywords : [];
	} catch (error) {
		console.error("Error extracting disease keywords:", error);
		return [];
	}
}

/**
 * Generate AI summary for clinical trial or publication
 */
export async function generateSummary(
	title: string,
	content: string,
	type: "trial" | "publication"
): Promise<string> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt =
			type === "trial"
				? `Summarize this clinical trial in 2-3 sentences for patients in simple, patient-friendly language:\n\nTitle: ${title}\n\nDescription: ${content}\n\nProvide only the summary, no additional text.`
				: `Summarize this research publication in 2-3 sentences for patients in simple, patient-friendly language:\n\nTitle: ${title}\n\nAbstract: ${content}\n\nProvide only the summary, no additional text.`;

		const result = await model.generateContent(prompt);
		const simplified = result.response.text()?.trim();

		return simplified || "Summary unavailable.";
	} catch (error) {
		console.error("Error generating summary:", error);
		return "Summary unavailable.";
	}
}

/**
 * Simplify clinical trial into easy-to-understand sections
 */
export async function simplifyTrial(trialData: {
	title: string;
	description: string;
	phase?: string;
	eligibility?: string;
}): Promise<SimplifiedTrial> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `You are a compassionate medical translator helping patients understand clinical trials. Use 8th-grade reading level, be warm and empathetic.

Trial Information:
Title: ${trialData.title}
Description: ${trialData.description}
Phase: ${trialData.phase || "Not specified"}
Eligibility: ${trialData.eligibility || "Not specified"}

Create a JSON response with these sections (be empathetic, use simple words, avoid medical jargon):
{
  "summary": "One friendly sentence explaining what this trial is about",
  "purpose": "Why researchers are doing this study (like explaining to a friend)",
  "whatHappens": "What you would actually do if you join (simple steps)",
  "timeCommitment": "How much time this might take",
  "risks": "Things to be aware of (honest but not scary)",
  "benefits": "How this might help you or others"
}

Return ONLY the JSON, no markdown, no explanations.`;

		const result = await model.generateContent(prompt);
		const simplified = result.response.text()?.trim();
		const cleanContent = simplified
			.replace(/```json\n?|\n?```/g, "")
			.trim();

		return JSON.parse(cleanContent);
	} catch (error) {
		console.error("Error simplifying trial:", error);
		return {
			summary:
				"We're having trouble understanding this trial right now. Please try again.",
			purpose: "Information unavailable",
			whatHappens: "Information unavailable",
			timeCommitment: "Information unavailable",
			risks: "Information unavailable",
			benefits: "Information unavailable",
		};
	}
}

/**
 * Estimate eligibility for a trial based on patient info
 */
export async function estimateEligibility(
	trialCriteria: string,
	patientInfo: string
): Promise<EligibilityEstimate> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `You are a compassionate medical assistant helping patients understand if they might qualify for a clinical trial.

Trial Eligibility Criteria:
${trialCriteria}

Patient Information:
${patientInfo}

Analyze the match and return ONLY a JSON object (no markdown):
{
  "score": <number 0-100>,
  "level": "<high|medium|low>",
  "factors": {
    "positive": ["things that make them a good match"],
    "negative": ["things that might exclude them"],
    "neutral": ["things we need more info about"]
  },
  "explanation": "A warm, empathetic 2-3 sentence explanation in simple terms"
}

Be encouraging but honest. Use 8th-grade reading level.`;

		const result = await model.generateContent(prompt);
		const simplified = result.response.text()?.trim();
		const cleanContent = simplified
			.replace(/```json\n?|\n?```/g, "")
			.trim();

		return JSON.parse(cleanContent);
	} catch (error) {
		console.error("Error estimating eligibility:", error);
		return {
			score: 50,
			level: "medium",
			factors: {
				positive: [],
				negative: [],
				neutral: ["Unable to analyze at this time"],
			},
			explanation:
				"We're having trouble checking eligibility right now. Please try again or contact the study team.",
		};
	}
}

/**
 * Calculate travel burden for a clinical trial
 */
export async function calculateTravelBurden(
	trialLocation: string,
	patientLocation: string,
	visitFrequency: string
): Promise<TravelBurden> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `You are a compassionate assistant helping patients understand the travel commitment for a clinical trial.

Trial Location: ${trialLocation}
Patient Location: ${patientLocation}
Visit Schedule: ${visitFrequency}

Assess the travel burden and return ONLY a JSON object (no markdown):
{
  "score": <number 0-100, where 100 is very high burden>,
  "level": "<low|medium|high>",
  "factors": ["list of things that affect travel burden"],
  "recommendations": ["helpful suggestions to make travel easier"]
}

Be practical and empathetic. Consider distance, frequency, and accessibility.`;

		const result = await model.generateContent(prompt);
		const simplified = result.response.text()?.trim();
		const cleanContent = simplified
			.replace(/```json\n?|\n?```/g, "")
			.trim();

		return JSON.parse(cleanContent);
	} catch (error) {
		console.error("Error calculating travel burden:", error);
		return {
			score: 50,
			level: "medium",
			factors: ["Unable to calculate at this time"],
			recommendations: [
				"Contact the study team to discuss travel options",
			],
		};
	}
}

/**
 * Generate personalized next steps for a patient
 */
export async function generateNextSteps(
	context: string,
	patientGoals?: string
): Promise<NextSteps> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `You are a caring healthcare navigator helping a patient plan their next steps.

Current Situation:
${context}

Patient Goals: ${patientGoals || "Finding the right treatment options"}

Create personalized next steps in JSON format (no markdown):
{
  "immediate": ["3-4 things to do this week"],
  "shortTerm": ["3-4 things to do this month"],
  "longTerm": ["2-3 bigger picture goals"],
  "resources": ["helpful resources or people to contact"]
}

Be encouraging, specific, and actionable. Use simple, friendly language.`;

		const result = await model.generateContent(prompt);
		const simplified = result.response.text()?.trim();
		const cleanContent = simplified
			.replace(/```json\n?|\n?```/g, "")
			.trim();

		return JSON.parse(cleanContent);
	} catch (error) {
		console.error("Error generating next steps:", error);
		return {
			immediate: ["Talk to your doctor about your options"],
			shortTerm: ["Research clinical trials that might be right for you"],
			longTerm: ["Stay informed about new treatment developments"],
			resources: ["CuraLink platform", "Your healthcare team"],
		};
	}
}

/**
 * Translate medical jargon into simple language
 */
export async function translateMedicalJargon(text: string): Promise<string> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `You are a kind medical translator helping patients understand complex medical terms.

Medical text:
"${text}"

Rewrite this in simple, friendly language that an 8th grader would understand. Be warm and encouraging. Keep it brief but clear.

Provide only the translation, no additional text.`;

		const result = await model.generateContent(prompt);
		const simplified = result.response.text()?.trim();

		if (!simplified) throw new Error("Empty response");
		return simplified;
	} catch (error: any) {
		console.error(
			"Gemini Translate Error:",
			JSON.stringify(error, null, 2)
		);
		return "Unable to translate at this time. Please try again.";
	}
}

/**
 * RESEARCHER AI FUNCTIONS
 */

/**
 * Generate recruitment strategy for a clinical trial
 */
export async function generateRecruitmentStrategy(
	trialInfo: string,
	targetPopulation: string
): Promise<RecruitmentStrategy> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `You are a clinical trial recruitment expert helping researchers reach the right patients.

Trial Information:
${trialInfo}

Target Population:
${targetPopulation}

Create a recruitment strategy in JSON format (no markdown):
{
  "targetAudience": ["specific patient groups to target"],
  "channels": ["where to reach them - online forums, hospitals, support groups, etc."],
  "messaging": ["key messages that will resonate with patients"],
  "timeline": "realistic recruitment timeline estimate",
  "considerations": ["important ethical and practical considerations"]
}

Be strategic, ethical, and patient-centered. Focus on authentic engagement.`;

		const result = await model.generateContent(prompt);
		const simplified = result.response.text()?.trim();
		const cleanContent = simplified
			.replace(/```json\n?|\n?```/g, "")
			.trim();

		return JSON.parse(cleanContent);
	} catch (error) {
		console.error("Error generating recruitment strategy:", error);
		return {
			targetAudience: ["Unable to analyze at this time"],
			channels: ["Contact recruitment specialists"],
			messaging: ["Please try again"],
			timeline: "Unable to estimate",
			considerations: ["Ensure ethical recruitment practices"],
		};
	}
}

/**
 * Analyze patient eligibility criteria for clarity and accessibility
 */
export async function analyzeEligibilityCriteria(
	criteria: string
): Promise<PatientEligibilityAnalysis> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `You are a clinical trial design expert analyzing eligibility criteria for patient-friendliness.

Eligibility Criteria:
${criteria}

Analyze and return JSON (no markdown):
{
  "likelyEligible": <percentage 0-100 of general population that might qualify>,
  "requiredCriteria": ["must-have criteria in simple terms"],
  "optionalCriteria": ["nice-to-have criteria in simple terms"],
  "exclusions": ["who cannot participate, in simple terms"],
  "recommendations": ["suggestions to make criteria clearer or more inclusive while maintaining scientific rigor"]
}

Focus on patient accessibility and clarity while maintaining scientific validity.`;

		const result = await model.generateContent(prompt);
		const simplified = result.response.text()?.trim();
		const cleanContent = simplified
			.replace(/```json\n?|\n?```/g, "")
			.trim();

		return JSON.parse(cleanContent);
	} catch (error) {
		console.error("Error analyzing eligibility:", error);
		return {
			likelyEligible: 50,
			requiredCriteria: ["Unable to analyze at this time"],
			optionalCriteria: [],
			exclusions: [],
			recommendations: [
				"Please try again or consult with trial design team",
			],
		};
	}
}

/**
 * Get suggestions for trial design improvements
 */
export async function suggestTrialImprovements(
	trialDesign: string
): Promise<TrialDesignSuggestions> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `You are a patient-centered clinical trial design consultant.

Trial Design:
${trialDesign}

Provide constructive feedback in JSON (no markdown):
{
  "strengths": ["what's working well from a patient perspective"],
  "improvements": ["specific suggestions to make trial more patient-friendly"],
  "patientBurden": "assessment of time/travel/commitment burden on patients",
  "recruitmentTips": ["how to attract and retain participants"],
  "ethicalConsiderations": ["important ethical aspects to consider"]
}

Be constructive, patient-focused, and scientifically sound. Prioritize patient experience while maintaining research quality.`;

		const result = await model.generateContent(prompt);
		const simplified = result.response.text()?.trim();
		const cleanContent = simplified
			.replace(/```json\n?|\n?```/g, "")
			.trim();

		return JSON.parse(cleanContent);
	} catch (error) {
		console.error("Error generating trial suggestions:", error);
		return {
			strengths: ["Unable to analyze at this time"],
			improvements: ["Please try again"],
			patientBurden: "Unable to assess",
			recruitmentTips: ["Consult with patient advocates"],
			ethicalConsiderations: [
				"Ensure proper informed consent and patient safety",
			],
		};
	}
}

/**
 * Generate patient-friendly trial description
 */
export async function generatePatientFriendlyDescription(
	technicalDescription: string
): Promise<string> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `You are helping a researcher translate a technical trial description into patient-friendly language.

Technical Description:
${technicalDescription}

Rewrite this for patients using:
- 8th-grade reading level
- Warm, encouraging tone
- No medical jargon (or explain any necessary terms)
- Focus on what patients will actually experience
- Honest about commitment and potential benefits

Provide only the patient-friendly description, no additional text.`;

		const result = await model.generateContent(prompt);
		const simplified = result.response.text()?.trim();

		if (!simplified) throw new Error("Empty response");
		return simplified;
	} catch (error) {
		console.error("Error generating patient-friendly description:", error);
		return "Unable to generate description at this time. Please try again.";
	}
}

/**
 * General AI chat function for both patients and researchers
 */
export async function chat(
	message: string,
	role: "patient" | "researcher",
	conversationHistory?: { role: string; content: string }[]
): Promise<string> {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const systemPrompt =
			role === "patient"
				? `You are a compassionate medical AI assistant helping patients understand clinical trials, medical conditions, and treatment options. Use 8th-grade reading level, be warm and empathetic, avoid medical jargon, and always encourage patients to consult with their healthcare team for medical decisions. You are knowledgeable, supportive, and patient-focused.`
				: `You are a knowledgeable AI assistant helping clinical researchers with trial design, patient recruitment, eligibility criteria, and patient-centered research practices. Be professional, evidence-based, and focused on ethical, patient-friendly research. Help researchers understand patient perspectives and improve trial accessibility.`;

		let fullPrompt = systemPrompt + "\n\n";

		if (conversationHistory && conversationHistory.length > 0) {
			fullPrompt += "Previous conversation:\n";
			conversationHistory.forEach((msg) => {
				fullPrompt += `${msg.role}: ${msg.content}\n`;
			});
			fullPrompt += "\n";
		}

		fullPrompt += `User (${role}): ${message}\n\nAssistant:`;

		const result = await model.generateContent(fullPrompt);
		const response = result.response.text()?.trim();

		if (!response) throw new Error("Empty response");
		return response;
	} catch (error) {
		console.error("Error in chat:", error);
		return "I'm having trouble responding right now. Please try again in a moment.";
	}
}
