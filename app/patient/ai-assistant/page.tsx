"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Brain, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  ArrowRight,
  Loader2,
  Heart,
  Calendar,
  Navigation,
  Lightbulb,
  Languages
} from "lucide-react";
import { 
  simplifyTrial, 
  estimateEligibility, 
  calculateTravelBurden, 
  generateNextSteps, 
  translateMedicalJargon,
  SimplifiedTrial,
  EligibilityEstimate,
  TravelBurden,
  NextSteps
} from "@/utils/ai";

type AssistantMode = 'simplify' | 'eligibility' | 'travel' | 'steps' | 'translate';

export default function AIAssistant() {
  const [mode, setMode] = useState<AssistantMode>('simplify');
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [secondaryInput, setSecondaryInput] = useState("");
  const [trialInput, setTrialInput] = useState({
    title: "",
    description: "",
    phase: "",
    eligibility: ""
  });

  // Results
  const [simplifiedResult, setSimplifiedResult] = useState<SimplifiedTrial | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityEstimate | null>(null);
  const [travelResult, setTravelResult] = useState<TravelBurden | null>(null);
  const [stepsResult, setStepsResult] = useState<NextSteps | null>(null);
  const [translatedResult, setTranslatedResult] = useState<string | null>(null);

  const assistantModes = [
    { id: 'simplify' as AssistantMode, label: 'Simplify Trial', icon: Brain, color: 'from-medical-teal-500 to-medical-indigo-500' },
    { id: 'eligibility' as AssistantMode, label: 'Check Eligibility', icon: CheckCircle2, color: 'from-medical-indigo-500 to-medical-lavender-500' },
    { id: 'travel' as AssistantMode, label: 'Travel Burden', icon: MapPin, color: 'from-medical-teal-500 to-medical-lavender-500' },
    { id: 'steps' as AssistantMode, label: 'Next Steps', icon: Lightbulb, color: 'from-medical-lavender-500 to-medical-indigo-500' },
    { id: 'translate' as AssistantMode, label: 'Translate Jargon', icon: Languages, color: 'from-medical-indigo-500 to-medical-teal-500' },
  ];

  const handleSimplify = async () => {
    if (!trialInput.title || !trialInput.description) return;
    setLoading(true);
    try {
      const result = await simplifyTrial(trialInput);
      setSimplifiedResult(result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleEligibility = async () => {
    if (!input || !secondaryInput) return;
    setLoading(true);
    try {
      const result = await estimateEligibility(input, secondaryInput);
      setEligibilityResult(result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleTravel = async () => {
    if (!input || !secondaryInput) return;
    setLoading(true);
    try {
      const result = await calculateTravelBurden(input, secondaryInput, trialInput.phase || 'Monthly visits');
      setTravelResult(result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSteps = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const result = await generateNextSteps(input, secondaryInput);
      setStepsResult(result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleTranslate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const result = await translateMedicalJargon(input);
      setTranslatedResult(result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-fade-in-up">
      {/* Header */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-medical-teal-50 via-medical-indigo-50 to-medical-lavender-50 border border-medical-teal-100 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              AI Care Assistant
            </h1>
            <p className="text-lg text-gray-700">
              Your friendly guide to understanding clinical trials and medical information 🌟
            </p>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed">
          I'm here to help translate complex medical information into simple, easy-to-understand language. 
          Ask me about trial details, check if you might be eligible, understand travel requirements, or get personalized next steps!
        </p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {assistantModes.map((modeItem) => {
          const Icon = modeItem.icon;
          const isActive = mode === modeItem.id;
          return (
            <button
              key={modeItem.id}
              onClick={() => {
                setMode(modeItem.id);
                setInput("");
                setSecondaryInput("");
                setSimplifiedResult(null);
                setEligibilityResult(null);
                setTravelResult(null);
                setStepsResult(null);
                setTranslatedResult(null);
              }}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                isActive
                  ? 'border-medical-teal-400 bg-gradient-to-br from-medical-teal-50 to-medical-indigo-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-medical-teal-200 hover:shadow-md hover:scale-102'
              }`}
            >
              <div className={`p-3 rounded-xl mb-3 bg-gradient-to-r ${modeItem.color} ${isActive ? 'shadow-md' : ''}`}>
                <Icon className="h-6 w-6 text-white mx-auto" />
              </div>
              <p className={`text-sm font-semibold ${isActive ? 'text-medical-teal-700' : 'text-gray-700'}`}>
                {modeItem.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Input Section */}
      <Card className="mb-8 rounded-3xl border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-medical-teal-50 to-medical-indigo-50 rounded-t-3xl">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-medical-teal-600" />
            {mode === 'simplify' && 'Tell Me About the Trial'}
            {mode === 'eligibility' && 'Check If You Might Qualify'}
            {mode === 'travel' && 'Calculate Travel Burden'}
            {mode === 'steps' && 'Get Personalized Next Steps'}
            {mode === 'translate' && 'Translate Medical Terms'}
          </CardTitle>
          <CardDescription>
            {mode === 'simplify' && 'Enter trial information and I\'ll explain it in simple terms'}
            {mode === 'eligibility' && 'Share trial requirements and your health info for an estimate'}
            {mode === 'travel' && 'Tell me where the trial is and where you live'}
            {mode === 'steps' && 'Describe your situation and I\'ll suggest helpful next steps'}
            {mode === 'translate' && 'Paste any medical jargon and I\'ll explain it simply'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {mode === 'simplify' && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Trial Title</label>
                <Input
                  placeholder="e.g., Phase II Study of Drug XYZ for Type 2 Diabetes"
                  value={trialInput.title}
                  onChange={(e) => setTrialInput({...trialInput, title: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Trial Description</label>
                <Textarea
                  placeholder="Paste the trial description here..."
                  value={trialInput.description}
                  onChange={(e) => setTrialInput({...trialInput, description: e.target.value})}
                  className="rounded-xl min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Phase (optional)</label>
                  <Input
                    placeholder="e.g., Phase 2"
                    value={trialInput.phase}
                    onChange={(e) => setTrialInput({...trialInput, phase: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Eligibility (optional)</label>
                  <Input
                    placeholder="e.g., Adults 18-65 with Type 2 Diabetes"
                    value={trialInput.eligibility}
                    onChange={(e) => setTrialInput({...trialInput, eligibility: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Button 
                onClick={handleSimplify} 
                disabled={loading || !trialInput.title || !trialInput.description}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</> : <><Brain className="mr-2 h-5 w-5" /> Simplify This Trial</>}
              </Button>
            </>
          )}

          {mode === 'eligibility' && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Trial Eligibility Criteria</label>
                <Textarea
                  placeholder="Paste the trial's eligibility requirements here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-xl min-h-[100px]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Health Information</label>
                <Textarea
                  placeholder="Tell me about your age, condition, medications, etc..."
                  value={secondaryInput}
                  onChange={(e) => setSecondaryInput(e.target.value)}
                  className="rounded-xl min-h-[100px]"
                />
              </div>
              <Button 
                onClick={handleEligibility} 
                disabled={loading || !input || !secondaryInput}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-medical-indigo-500 to-medical-lavender-500 hover:from-medical-indigo-600 hover:to-medical-lavender-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Checking...</> : <><CheckCircle2 className="mr-2 h-5 w-5" /> Check Eligibility</>}
              </Button>
            </>
          )}

          {mode === 'travel' && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Trial Location</label>
                <Input
                  placeholder="e.g., Mayo Clinic, Rochester, MN"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Location</label>
                <Input
                  placeholder="e.g., Chicago, IL"
                  value={secondaryInput}
                  onChange={(e) => setSecondaryInput(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Visit Schedule</label>
                <Input
                  placeholder="e.g., Weekly visits for 3 months"
                  value={trialInput.phase}
                  onChange={(e) => setTrialInput({...trialInput, phase: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <Button 
                onClick={handleTravel} 
                disabled={loading || !input || !secondaryInput}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-medical-teal-500 to-medical-lavender-500 hover:from-medical-teal-600 hover:to-medical-lavender-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Calculating...</> : <><MapPin className="mr-2 h-5 w-5" /> Calculate Travel Burden</>}
              </Button>
            </>
          )}

          {mode === 'steps' && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Current Situation</label>
                <Textarea
                  placeholder="Tell me about your health journey, what you're looking for..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-xl min-h-[120px]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Goals (optional)</label>
                <Textarea
                  placeholder="What are you hoping to achieve?"
                  value={secondaryInput}
                  onChange={(e) => setSecondaryInput(e.target.value)}
                  className="rounded-xl min-h-[80px]"
                />
              </div>
              <Button 
                onClick={handleSteps} 
                disabled={loading || !input}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-medical-lavender-500 to-medical-indigo-500 hover:from-medical-lavender-600 hover:to-medical-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Thinking...</> : <><Lightbulb className="mr-2 h-5 w-5" /> Get Next Steps</>}
              </Button>
            </>
          )}

          {mode === 'translate' && (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Medical Text to Translate</label>
                <Textarea
                  placeholder="Paste any medical jargon or complex medical text here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-xl min-h-[150px]"
                />
              </div>
              <Button 
                onClick={handleTranslate} 
                disabled={loading || !input}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-medical-indigo-500 to-medical-teal-500 hover:from-medical-indigo-600 hover:to-medical-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Translating...</> : <><Languages className="mr-2 h-5 w-5" /> Translate to Simple Language</>}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Results Display */}
      {simplifiedResult && mode === 'simplify' && (
        <Card className="rounded-3xl border-0 shadow-xl animate-fade-in-up bg-gradient-to-br from-white to-medical-teal-50/30">
          <CardHeader className="bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Here's What This Trial Means
            </CardTitle>
            <CardDescription className="text-white/90">Simple, friendly explanation just for you</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="p-4 bg-gradient-to-r from-medical-teal-50 to-medical-indigo-50 rounded-2xl border-l-4 border-medical-teal-400">
              <p className="text-lg text-gray-800 leading-relaxed">{simplifiedResult.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl shadow-md border border-medical-teal-100">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-medical-indigo-600" />
                  <h3 className="font-semibold text-gray-800">Why This Study?</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{simplifiedResult.purpose}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-md border border-medical-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-medical-lavender-600" />
                  <h3 className="font-semibold text-gray-800">What Happens</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{simplifiedResult.whatHappens}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-md border border-medical-lavender-100">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-medical-teal-600" />
                  <h3 className="font-semibold text-gray-800">Time You'll Need</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{simplifiedResult.timeCommitment}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-md border border-medical-teal-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-800">Things to Know</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{simplifiedResult.risks}</p>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                <h3 className="font-semibold text-gray-800 text-lg">Potential Benefits</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">{simplifiedResult.benefits}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {eligibilityResult && mode === 'eligibility' && (
        <Card className="rounded-3xl border-0 shadow-xl animate-fade-in-up">
          <CardHeader className="bg-gradient-to-r from-medical-indigo-500 to-medical-lavender-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              Your Eligibility Estimate
            </CardTitle>
            <CardDescription className="text-white/90">Based on the information you shared</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                  <circle 
                    cx="96" 
                    cy="96" 
                    r="88" 
                    stroke="url(#eligibilityGradient)" 
                    strokeWidth="12" 
                    fill="none"
                    strokeDasharray={`${(eligibilityResult.score / 100) * 553} 553`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="eligibilityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-800">{eligibilityResult.score}</span>
                  <span className="text-sm text-gray-600">Match Score</span>
                  <Badge className={`mt-2 ${
                    eligibilityResult.level === 'high' ? 'bg-emerald-500' :
                    eligibilityResult.level === 'medium' ? 'bg-amber-500' : 'bg-gray-500'
                  }`}>
                    {eligibilityResult.level.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-l-4 border-indigo-400">
              <p className="text-lg text-gray-800 leading-relaxed">{eligibilityResult.explanation}</p>
            </div>

            {eligibilityResult.factors.positive.length > 0 && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Good Matches ✨
                </h3>
                <ul className="space-y-2">
                  {eligibilityResult.factors.positive.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {eligibilityResult.factors.negative.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Potential Concerns
                </h3>
                <ul className="space-y-2">
                  {eligibilityResult.factors.negative.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {eligibilityResult.factors.neutral.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Need More Info
                </h3>
                <ul className="space-y-2">
                  {eligibilityResult.factors.neutral.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {travelResult && mode === 'travel' && (
        <Card className="rounded-3xl border-0 shadow-xl animate-fade-in-up">
          <CardHeader className="bg-gradient-to-r from-medical-teal-500 to-medical-lavender-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-6 w-6" />
              Travel Burden Assessment
            </CardTitle>
            <CardDescription className="text-white/90">Understanding your travel commitment</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="text-center mb-6">
              <div className="inline-block p-6 rounded-full bg-gradient-to-br from-medical-teal-50 to-medical-lavender-50 mb-4">
                <MapPin className="h-16 w-16 text-medical-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {travelResult.level === 'low' && '✅ Low Travel Burden'}
                {travelResult.level === 'medium' && '⚖️ Medium Travel Burden'}
                {travelResult.level === 'high' && '⚠️ High Travel Burden'}
              </h3>
              <div className="max-w-md mx-auto">
                <Progress value={travelResult.score} className="h-4 rounded-full" />
                <p className="text-sm text-gray-600 mt-2">Burden Score: {travelResult.score}/100</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Factors Affecting Travel</h3>
              <ul className="space-y-2">
                {travelResult.factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Helpful Tips
              </h3>
              <ul className="space-y-2">
                {travelResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {stepsResult && mode === 'steps' && (
        <Card className="rounded-3xl border-0 shadow-xl animate-fade-in-up">
          <CardHeader className="bg-gradient-to-r from-medical-lavender-500 to-medical-indigo-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Your Personalized Next Steps
            </CardTitle>
            <CardDescription className="text-white/90">A clear path forward, made just for you</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-emerald-800">This Week</h3>
                </div>
                <ul className="space-y-3">
                  {stepsResult.immediate.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-semibold">{i + 1}</span>
                      <span className="text-gray-700 text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-blue-800">This Month</h3>
                </div>
                <ul className="space-y-3">
                  {stepsResult.shortTerm.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold">{i + 1}</span>
                      <span className="text-gray-700 text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-purple-800">Long Term</h3>
                </div>
                <ul className="space-y-3">
                  {stepsResult.longTerm.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-semibold">{i + 1}</span>
                      <span className="text-gray-700 text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Helpful Resources
              </h3>
              <div className="flex flex-wrap gap-2">
                {stepsResult.resources.map((resource, i) => (
                  <Badge key={i} className="px-4 py-2 bg-white border-2 border-amber-300 text-amber-800 hover:bg-amber-100">
                    {resource}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {translatedResult && mode === 'translate' && (
        <Card className="rounded-3xl border-0 shadow-xl animate-fade-in-up">
          <CardHeader className="bg-gradient-to-r from-medical-indigo-500 to-medical-teal-500 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-6 w-6" />
              Simple Translation
            </CardTitle>
            <CardDescription className="text-white/90">Medical jargon, explained clearly</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="p-6 bg-gradient-to-br from-medical-teal-50 via-white to-medical-indigo-50 rounded-2xl border-2 border-medical-teal-200">
              <p className="text-lg text-gray-800 leading-relaxed">{translatedResult}</p>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                This explanation uses simple, 8th-grade level language to help you understand
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}