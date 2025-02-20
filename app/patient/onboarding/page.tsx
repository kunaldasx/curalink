'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ArrowRight, ArrowLeft, MapPin, Heart, Check, Sparkles, Loader2 } from 'lucide-react';

export default function PatientOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [conditions, setConditions] = useState('');
  const [additionalConditions, setAdditionalConditions] = useState<string[]>([]);
  const [conditionInput, setConditionInput] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const router = useRouter();

  // Suggested conditions for quick selection
  const suggestedConditions = [
    'Glioma',
    'Lung Cancer',
    'Breast Cancer',
    'Diabetes',
    'Heart Disease',
    'Alzheimer\'s',
    'Parkinson\'s',
    'Multiple Sclerosis',
  ];

  const addCondition = (condition: string) => {
    const trimmed = condition.trim();
    if (trimmed && !additionalConditions.includes(trimmed)) {
      setAdditionalConditions([...additionalConditions, trimmed]);
      setConditionInput('');
    }
  };

  const removeCondition = (condition: string) => {
    setAdditionalConditions(additionalConditions.filter((c) => c !== condition));
  };

  // Suggested interests
  const suggestedInterests = [
    'Clinical Trials',
    'Research Papers',
    'Expert Opinions',
    'Treatment Options',
    'Support Groups',
    'Latest Treatments',
  ];

  const nextStep = () => {
    if (currentStep < 5) {
      setDirection('forward');
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection('backward');
      setCurrentStep(currentStep - 1);
    }
  };

  const canProgress = () => {
    switch (currentStep) {
      case 1:
        return conditions.trim().length > 0;
      case 2:
        return true; // Optional step
      case 3:
        return city.trim() && country.trim();
      case 4:
        return true; // Optional step
      case 5:
        return true;
      default:
        return false;
    }
  };

  const addInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conditions,
          additionalConditions,
          location: { city, country },
          interests,
        }),
      });

      if (response.ok) {
        // Trigger prepopulation of recommendations
        await fetch('/api/recommendations/prepopulate', {
          method: 'POST',
        });
        
        // Show loading animation then redirect
        setTimeout(() => {
          router.push('/patient/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      setLoading(false);
    }
  };

  const stepTitles = [
    "About You",
    "Health Conditions",
    "Your Location",
    "Your Interests",
    "Let's Get Started!"
  ];

  const stepMessages = [
    "We're getting to know you 🙌",
    "Tell us what matters most to you",
    "This helps personalize your journey",
    "We'll find the best matches for you",
    "Almost there!"
  ];

  return (
    <div className="min-h-screen gradient-hopeful flex items-center justify-center px-4 md:px-8 py-6 md:py-8 safe-area-inset">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator - Duolingo Style */}
        <div className="mb-6 md:mb-8 animate-fade-in-down">
          {/* Progress Bar Container */}
          <div className="relative h-4 md:h-5 bg-white/20 rounded-full overflow-visible shadow-sm mb-8 md:mb-10">
            {/* Filled Progress */}
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ 
                width: `${(currentStep / 5) * 100}%`,
                background: 'linear-gradient(90deg, #14b8a6 0%, #06b6d4 25%, #6366f1 50%, #8b5cf6 75%, #a855f7 100%)'
              }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
                style={{ backgroundSize: '200% 100%' }}
              />
            </div>
            
            {/* Progress Dots - Positioned above bar */}
            <div className="absolute -top-2 left-0 right-0 flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`relative flex items-center justify-center transition-all duration-500 ${
                    step === currentStep ? 'z-20' : 'z-10'
                  }`}
                  style={{ marginLeft: step === 1 ? '0' : 'auto', marginRight: step === 5 ? '0' : 'auto' }}
                >
                  {/* Outer ring for current step */}
                  {step === currentStep && (
                    <div className="absolute h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/30 animate-ping" />
                  )}
                  
                  {/* Dot */}
                  <div
                    className={`relative h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                      step < currentStep
                        ? 'bg-white text-medical-teal-500 shadow-xl scale-100'
                        : step === currentStep
                        ? 'bg-white text-medical-indigo-600 shadow-2xl scale-125 ring-4 ring-white/50'
                        : 'bg-white/40 text-white/60 shadow-md scale-90'
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

        {/* Card Container with Animation */}
        <Card className={`shadow-2xl transition-all duration-500 border-0 ${
          direction === 'forward' ? 'animate-fade-slide' : 'animate-fade-in-up'
        }`}>
          <div className="p-6 md:p-10 lg:p-12">
            {/* Step 1: About You */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-bounce relative"
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)'
                    }}
                  >
                    <Heart className="h-10 w-10 text-white" />
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{
                        background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)'
                      }}
                    />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #a855f7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Welcome to CuraLink!
                  </h2>
                  <p className="text-lg text-gray-600">
                    Let's personalize your health journey together
                  </p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="conditions" className="text-lg font-semibold text-gray-800 block">
                    Tell us about yourself
                  </Label>
                  <Textarea
                    id="conditions"
                    placeholder="Example: 'I have brain cancer and experience frequent headaches' or 'My mother was diagnosed with glioma and I want to learn more about treatment options'"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    rows={7}
                    className="w-full text-base resize-none rounded-2xl border-2 border-gray-200 focus:border-medical-teal-400 focus:ring-4 focus:ring-medical-teal-100 transition-all duration-200 p-4"
                  />
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-medical-teal-50 to-medical-indigo-50 rounded-xl border border-medical-teal-200">
                    <Sparkles className="h-5 w-5 text-medical-indigo-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Our AI will understand your needs from your description
                    </p>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-medical-teal-500" />
                    Your information is secure and confidential
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Health Conditions */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float relative"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                    }}
                  >
                    <Plus className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Add Specific Conditions
                  </h2>
                  <p className="text-lg text-gray-600">
                    This helps us find the most relevant matches
                  </p>
                  <p className="text-sm text-gray-500 mt-2">(Optional - you can skip this)</p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Type a condition and press Enter"
                      value={conditionInput}
                      onChange={(e) => setConditionInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCondition(conditionInput);
                        }
                      }}
                      className="flex-1 text-base rounded-2xl border-2 border-gray-200 focus:border-medical-indigo-400 focus:ring-4 focus:ring-medical-indigo-100 transition-all duration-200 p-4"
                    />
                    <Button
                      type="button"
                      onClick={() => addCondition(conditionInput)}
                      className="px-6 py-4 rounded-2xl bg-medical-indigo-500 hover:bg-medical-indigo-600 text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Suggested conditions */}
                  <div className="space-y-4">
                    <p className="text-base font-semibold text-gray-700">Quick add popular conditions:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {suggestedConditions.map((condition) => (
                        <button
                          key={condition}
                          type="button"
                          onClick={() => addCondition(condition)}
                          className="px-4 py-3 rounded-xl bg-white border-2 border-gray-200 hover:border-medical-indigo-400 hover:bg-medical-indigo-50 text-gray-700 font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
                        >
                          + {condition}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected conditions */}
                  {additionalConditions.length > 0 && (
                    <div className="p-6 bg-gradient-to-r from-medical-teal-50 to-medical-indigo-50 rounded-2xl border-2 border-medical-teal-200 animate-fade-in">
                      <p className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Check className="h-5 w-5 text-medical-teal-600" />
                        Your selected conditions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {additionalConditions.map((condition) => (
                          <button
                            key={condition}
                            onClick={() => removeCondition(condition)}
                            className="px-4 py-2 rounded-xl bg-white text-medical-teal-700 font-medium border-2 border-medical-teal-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 flex items-center gap-2 group"
                          >
                            {condition}
                            <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-bounce relative"
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)'
                    }}
                  >
                    <MapPin className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Where are you located?
                  </h2>
                  <p className="text-lg text-gray-600">
                    We'll show you nearby experts and clinical trials
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="city" className="text-lg font-semibold text-gray-800">
                        City
                      </Label>
                      <Input
                        id="city"
                        placeholder="e.g., Boston, London, Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="text-base rounded-2xl border-2 border-gray-200 focus:border-medical-teal-400 focus:ring-4 focus:ring-medical-teal-100 transition-all duration-200 p-4"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="country" className="text-lg font-semibold text-gray-800">
                        Country
                      </Label>
                      <Input
                        id="country"
                        placeholder="e.g., USA, UK, India"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="text-base rounded-2xl border-2 border-gray-200 focus:border-medical-teal-400 focus:ring-4 focus:ring-medical-teal-100 transition-all duration-200 p-4"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-medical-teal-50 to-medical-indigo-50 rounded-xl border border-medical-teal-200">
                    <MapPin className="h-5 w-5 text-medical-teal-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      You can always view global results anytime
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Interests */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float relative"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
                    }}
                  >
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    What interests you most?
                  </h2>
                  <p className="text-lg text-gray-600">
                    We'll prioritize these in your recommendations
                  </p>
                  <p className="text-sm text-gray-500 mt-2">(Optional - select multiple)</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestedInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() =>
                          interests.includes(interest)
                            ? removeInterest(interest)
                            : addInterest(interest)
                        }
                        className={`px-6 py-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
                          interests.includes(interest)
                            ? 'bg-gradient-to-r from-medical-teal-400 to-medical-indigo-400 text-white border-2 border-medical-teal-400 shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-medical-indigo-300 hover:bg-medical-indigo-50'
                        }`}
                      >
                        {interests.includes(interest) && (
                          <Check className="h-5 w-5" />
                        )}
                        {interest}
                      </button>
                    ))}
                  </div>

                  {interests.length > 0 && (
                    <div className="p-5 bg-gradient-to-r from-medical-teal-50 to-medical-indigo-50 rounded-xl border border-medical-indigo-200 animate-fade-in">
                      <p className="text-base text-gray-800 font-semibold flex items-center gap-2">
                        <Check className="h-5 w-5 text-medical-teal-600" />
                        Perfect! We'll focus on {interests.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && !loading && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-hopeful rounded-full flex items-center justify-center mx-auto mb-4 animate-success-pop">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gradient-hopeful mb-2">
                    Perfect! You're all set 🎉
                  </h2>
                  <p className="text-medical-soft-500">
                    Let's personalize your experience
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-soft rounded-2xl border border-medical-teal-200 space-y-3">
                    {conditions && (
                      <div>
                        <p className="text-xs font-medium text-medical-indigo-600 uppercase tracking-wide mb-1">
                          About You
                        </p>
                        <p className="text-sm text-gray-700">
                          {conditions.substring(0, 100)}
                          {conditions.length > 100 && '...'}
                        </p>
                      </div>
                    )}
                    {additionalConditions.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-medical-indigo-600 uppercase tracking-wide mb-1">
                          Conditions
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {additionalConditions.map((c) => (
                            <Badge key={c} className="badge-stat text-xs">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {city && country && (
                      <div>
                        <p className="text-xs font-medium text-medical-indigo-600 uppercase tracking-wide mb-1">
                          Location
                        </p>
                        <p className="text-sm text-gray-700 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {city}, {country}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 gradient-mesh rounded-2xl border border-medical-indigo-200">
                    <p className="text-sm font-medium text-medical-indigo-700 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      What happens next?
                    </p>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-medical-teal-500 mt-0.5 flex-shrink-0" />
                        <span>AI analyzes your profile</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-medical-teal-500 mt-0.5 flex-shrink-0" />
                        <span>Find relevant clinical trials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-medical-teal-500 mt-0.5 flex-shrink-0" />
                        <span>Match with health experts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-medical-teal-500 mt-0.5 flex-shrink-0" />
                        <span>Discover latest research</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && currentStep === 5 && (
              <div className="space-y-6 text-center animate-fade-in-up py-12">
                <div className="loading-state">
                  <div className="relative">
                    <div className="loading-spinner mx-auto" />
                    <Sparkles className="h-6 w-6 text-medical-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-soft" />
                  </div>
                  <p className="loading-message text-medical-indigo-600">
                    Personalizing your experience...
                  </p>
                  <p className="text-sm text-medical-soft-500 mt-2">
                    This will only take a moment
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {!loading && (
              <div className="flex gap-2 md:gap-3 mt-6 md:mt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="px-4 md:px-6 py-4 md:py-6 rounded-xl md:rounded-2xl font-bold text-sm md:text-base border-2 border-medical-teal-300 text-medical-teal-600 bg-white hover:bg-medical-teal-50 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    <ArrowLeft className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                )}
                {currentStep < 5 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProgress()}
                    className="flex-1 px-6 md:px-8 py-4 md:py-6 rounded-xl md:rounded-2xl font-bold text-sm md:text-base text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #a855f7 100%)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center">
                      Continue
                      <ArrowRight className="ml-1 md:ml-2 h-4 md:h-5 w-4 md:w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-6 md:px-8 py-4 md:py-6 rounded-xl md:rounded-2xl font-bold text-sm md:text-base text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #a855f7 100%)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center">
                      <Sparkles className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5 group-hover:rotate-12 transition-transform duration-200" />
                      <span className="hidden sm:inline">Complete Setup</span>
                      <span className="sm:hidden">Complete</span>
                    </span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Affirmation Message */}
        {currentStep > 1 && currentStep < 5 && !loading && (
          <p className="text-center mt-4 text-sm text-white/80 animate-fade-in">
            {currentStep === 2 && "Great! Almost there 💪"}
            {currentStep === 3 && "Perfect. Thanks for sharing 🙏"}
            {currentStep === 4 && "You're doing amazing! ✨"}
          </p>
        )}
      </div>
    </div>
  );
}
