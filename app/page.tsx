"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Activity,
	Users,
	FlaskConical,
	BookOpen,
	ArrowRight,
	Heart,
	Sparkles,
	MessageSquare,
	ChevronDown,
	Shield,
	Zap,
	Globe,
	CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [scrollY, setScrollY] = useState(0);
	const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		const handleScroll = () => {
			setScrollY(window.scrollY);

			// Reveal sections on scroll
			sectionsRef.current.forEach((section) => {
				if (section) {
					const rect = section.getBoundingClientRect();
					if (rect.top < window.innerHeight * 0.75) {
						section.classList.add("animate-reveal");
					}
				}
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const gradientStyle = {
		background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(20, 184, 166, 0.25), rgba(99, 102, 241, 0.15) 40%, transparent 70%)`,
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-medical-teal-50/20 to-medical-indigo-50/30 overflow-hidden relative">
			{/* Animated Background Gradient */}
			<div
				className="fixed inset-0 pointer-events-none transition-all duration-[1500ms] ease-out opacity-80"
				style={gradientStyle}
			/>

			{/* Floating Particles */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				{[...Array(15)].map((_, i) => (
					<div
						key={i}
						className="absolute animate-float opacity-20"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`,
							animationDuration: `${15 + Math.random() * 10}s`,
						}}
					>
						{i % 3 === 0 ? (
							<Heart className="h-6 w-6 text-medical-teal-400" />
						) : i % 3 === 1 ? (
							<Sparkles className="h-5 w-5 text-medical-indigo-400" />
						) : (
							<Activity className="h-5 w-5 text-medical-lavender-400" />
						)}
					</div>
				))}
			</div>

			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center px-4 py-20">
				<div
					className="container mx-auto text-center relative z-10"
					style={{ transform: `translateY(${scrollY * 0.3}px)` }}
				>
					{/* Animated Logo */}
					<div className="mb-8 animate-pulse-slow">
						<div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-medical-teal-400 via-medical-indigo-500 to-medical-lavender-500 flex items-center justify-center shadow-2xl animate-breathing">
							<Activity className="h-10 w-10 text-white" />
						</div>
					</div>

					{/* Hero Headline */}
					<h1
						className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up"
						style={{
							background:
								"linear-gradient(135deg, #14b8a6 0%, #6366f1 50%, #a855f7 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
							lineHeight: "1.2",
						}}
					>
						Connecting Patients
						<br />
						to Breakthroughs
					</h1>

					{/* Subcopy */}
					<p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
						Your journey deserves guidance. Every breakthrough starts with
						connection.
						<br />
						<span className="text-lg text-gray-500 mt-2 block">
							Find clinical trials, discover experts, and explore cutting-edge
							research.
						</span>
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up animation-delay-400">
						<Link href="/login?role=patient">
							<Button
								size="lg"
								className="group px-12 py-8 text-lg rounded-2xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white shadow-2xl hover:shadow-medical-teal-500/50 transition-all duration-300 hover:scale-105 animate-breathing w-full sm:w-auto"
							>
								<Users className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
								I'm a Patient
								<ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
							</Button>
						</Link>
						<Link href="/login?role=researcher">
							<Button
								size="lg"
								className="group px-12 py-8 text-lg rounded-2xl font-semibold bg-white text-gray-800 border-2 border-medical-indigo-300 hover:border-medical-indigo-500 hover:bg-gradient-to-r hover:from-medical-indigo-50 hover:to-medical-lavender-50 shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
							>
								<FlaskConical className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
								I'm a Researcher
								<ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
							</Button>
						</Link>
					</div>

					{/* Login Link */}
					{/* <p className="text-gray-600 animate-fade-in-up animation-delay-600">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-medical-teal-600 font-semibold hover:text-medical-teal-700 hover:underline transition-colors"
						>
							Log in
						</Link>
					</p> */}

					{/* Scroll Indicator */}
					<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
						<ChevronDown className="h-8 w-8 text-medical-teal-500" />
					</div>
				</div>
			</section>

			{/* Trust Metrics */}
			<section className="py-20 px-4 relative z-10">
				<div className="container mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<div
							ref={(el) => {
								sectionsRef.current[0] = el;
							}}
							className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-medical-teal-100 opacity-0 translate-y-8 transition-all duration-700"
						>
							<div className="text-5xl font-bold mb-2 bg-gradient-to-r from-medical-teal-600 to-medical-indigo-600 bg-clip-text text-transparent">
								20,000+
							</div>
							<p className="text-gray-600 font-medium">
								Clinical Trials Indexed
							</p>
						</div>
						<div
							ref={(el) => {
								sectionsRef.current[1] = el;
							}}
							className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-medical-indigo-100 opacity-0 translate-y-8 transition-all duration-700 animation-delay-200"
						>
							<div className="text-5xl font-bold mb-2 bg-gradient-to-r from-medical-indigo-600 to-medical-lavender-600 bg-clip-text text-transparent">
								Global
							</div>
							<p className="text-gray-600 font-medium">
								Network of Leading Experts
							</p>
						</div>
						<div
							ref={(el) => {
								sectionsRef.current[2] = el;
							}}
							className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-medical-lavender-100 opacity-0 translate-y-8 transition-all duration-700 animation-delay-400"
						>
							<div className="text-5xl font-bold mb-2 bg-gradient-to-r from-medical-lavender-600 to-medical-teal-600 bg-clip-text text-transparent">
								AI-Powered
							</div>
							<p className="text-gray-600 font-medium">
								Personalized Recommendations
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Story Section 1: Find Clinical Trials */}
			<section className="py-32 px-4 relative z-10">
				<div className="container mx-auto max-w-6xl">
					<div
						ref={(el) => {
							sectionsRef.current[3] = el;
						}}
						className="flex flex-col md:flex-row items-center gap-12 opacity-0 translate-y-12 transition-all duration-1000"
					>
						<div className="flex-1">
							<div className="inline-block px-4 py-2 bg-gradient-to-r from-medical-teal-100 to-medical-indigo-100 rounded-full mb-6">
								<span className="text-medical-teal-700 font-semibold text-sm">
									Clinical Trials
								</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
								Find Hope in
								<span className="block mt-2 bg-gradient-to-r from-medical-teal-600 to-medical-indigo-600 bg-clip-text text-transparent">
									Every Trial
								</span>
							</h2>
							<p className="text-xl text-gray-600 mb-8 leading-relaxed">
								Discover clinical trials tailored to your condition. We match
								you with opportunities that could change everything.
							</p>
							<div className="space-y-4">
								{[
									"Phase I–IV Trials",
									"Location-Based Matching",
									"Real-time Updates",
								].map((item, i) => (
									<div key={i} className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-medical-teal-400 to-medical-indigo-400 flex items-center justify-center">
											<CheckCircle2 className="h-5 w-5 text-white" />
										</div>
										<span className="text-gray-700 font-medium">{item}</span>
									</div>
								))}
							</div>
						</div>
						<div className="flex-1">
							<div className="relative">
								<div className="w-full h-80 rounded-3xl bg-gradient-to-br from-medical-teal-400 via-medical-indigo-400 to-medical-lavender-400 shadow-2xl flex items-center justify-center animate-breathing">
									<FlaskConical className="h-32 w-32 text-white opacity-90" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Story Section 2: Discover Health Experts */}
			<section className="py-32 px-4 relative z-10 bg-gradient-to-b from-transparent to-medical-indigo-50/30">
				<div className="container mx-auto max-w-6xl">
					<div
						ref={(el) => {
							sectionsRef.current[4] = el;
						}}
						className="flex flex-col md:flex-row-reverse items-center gap-12 opacity-0 translate-y-12 transition-all duration-1000"
					>
						<div className="flex-1">
							<div className="inline-block px-4 py-2 bg-gradient-to-r from-medical-indigo-100 to-medical-lavender-100 rounded-full mb-6">
								<span className="text-medical-indigo-700 font-semibold text-sm">
									Health Experts
								</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
								Connect with
								<span className="block mt-2 bg-gradient-to-r from-medical-indigo-600 to-medical-lavender-600 bg-clip-text text-transparent">
									Verified Specialists
								</span>
							</h2>
							<p className="text-xl text-gray-600 mb-8 leading-relaxed">
								Access a global network of medical experts ready to guide your
								journey with compassion and expertise.
							</p>
							<div className="grid grid-cols-2 gap-4">
								{[
									{
										icon: Shield,
										label: "Verified Profiles",
									},
									{ icon: Globe, label: "Global Network" },
									{ icon: Zap, label: "Quick Responses" },
									{ icon: Heart, label: "Patient-First" },
								].map((item, i) => (
									<div
										key={i}
										className="p-4 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow"
									>
										<item.icon className="h-8 w-8 text-medical-indigo-500 mb-2" />
										<p className="font-medium text-gray-700">{item.label}</p>
									</div>
								))}
							</div>
						</div>
						<div className="flex-1">
							<div className="relative">
								<div className="w-full h-80 rounded-3xl bg-gradient-to-br from-medical-indigo-400 via-medical-lavender-400 to-medical-teal-400 shadow-2xl flex items-center justify-center animate-breathing animation-delay-200">
									<Users className="h-32 w-32 text-white opacity-90" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Story Section 3: Explore Research */}
			<section className="py-32 px-4 relative z-10">
				<div className="container mx-auto max-w-6xl">
					<div
						ref={(el) => {
							sectionsRef.current[5] = el;
						}}
						className="flex flex-col md:flex-row items-center gap-12 opacity-0 translate-y-12 transition-all duration-1000"
					>
						<div className="flex-1">
							<div className="inline-block px-4 py-2 bg-gradient-to-r from-medical-lavender-100 to-medical-teal-100 rounded-full mb-6">
								<span className="text-medical-lavender-700 font-semibold text-sm">
									Research & Publications
								</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
								Explore Cutting-Edge
								<span className="block mt-2 bg-gradient-to-r from-medical-lavender-600 to-medical-teal-600 bg-clip-text text-transparent">
									Medical Research
								</span>
							</h2>
							<p className="text-xl text-gray-600 mb-8 leading-relaxed">
								Stay informed with the latest breakthroughs. Access thousands of
								medical publications tailored to your interests.
							</p>
							<Button className="px-8 py-6 text-lg rounded-xl font-semibold bg-gradient-to-r from-medical-lavender-500 to-medical-teal-500 hover:from-medical-lavender-600 hover:to-medical-teal-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
								<BookOpen className="mr-2 h-5 w-5" />
								Browse Publications
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</div>
						<div className="flex-1">
							<div className="relative">
								<div className="w-full h-80 rounded-3xl bg-gradient-to-br from-medical-lavender-400 via-medical-teal-400 to-medical-indigo-400 shadow-2xl flex items-center justify-center animate-breathing animation-delay-400">
									<BookOpen className="h-32 w-32 text-white opacity-90" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Story Section 4: Forums */}
			<section className="py-32 px-4 relative z-10 bg-gradient-to-b from-medical-indigo-50/30 to-transparent">
				<div className="container mx-auto max-w-6xl">
					<div
						ref={(el) => {
							sectionsRef.current[6] = el;
						}}
						className="flex flex-col md:flex-row-reverse items-center gap-12 opacity-0 translate-y-12 transition-all duration-1000"
					>
						<div className="flex-1">
							<div className="inline-block px-4 py-2 bg-gradient-to-r from-medical-teal-100 to-medical-lavender-100 rounded-full mb-6">
								<span className="text-medical-teal-700 font-semibold text-sm">
									Community Forums
								</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
								Join Meaningful
								<span className="block mt-2 bg-gradient-to-r from-medical-teal-600 to-medical-lavender-600 bg-clip-text text-transparent">
									Discussions
								</span>
							</h2>
							<p className="text-xl text-gray-600 mb-8 leading-relaxed">
								Share experiences, ask questions, and find support in our
								compassionate community of patients and experts.
							</p>
							<div className="flex flex-wrap gap-3">
								{[
									"Patient Stories",
									"Expert Answers",
									"Support Groups",
									"Q&A Sessions",
								].map((tag, i) => (
									<span
										key={i}
										className="px-4 py-2 rounded-full bg-gradient-to-r from-medical-teal-100 to-medical-lavender-100 text-medical-teal-700 font-medium text-sm"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
						<div className="flex-1">
							<div className="relative">
								<div className="w-full h-80 rounded-3xl bg-gradient-to-br from-medical-teal-400 via-medical-lavender-400 to-medical-indigo-400 shadow-2xl flex items-center justify-center animate-breathing animation-delay-600">
									<MessageSquare className="h-32 w-32 text-white opacity-90" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA Section */}
			<section className="py-32 px-4 relative z-10">
				<div
					ref={(el) => {
						sectionsRef.current[7] = el;
					}}
					className="container mx-auto max-w-4xl text-center opacity-0 translate-y-12 transition-all duration-1000"
				>
					<div className="p-12 md:p-16 rounded-3xl bg-gradient-to-br from-medical-teal-50 via-medical-indigo-50 to-medical-lavender-50 border border-medical-teal-100 shadow-2xl">
						<Sparkles className="w-16 text-medical-indigo-500 mx-auto mb-6 animate-pulse-slow" />
						<h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
							Let's take the next step
							<span className="block mt-2 bg-gradient-to-r from-medical-teal-600 via-medical-indigo-600 to-medical-lavender-600 bg-clip-text text-transparent">
								together.
							</span>
						</h2>
						<p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
							Breakthroughs start with connection. Your journey matters, and
							we're here to guide every step.
						</p>
						<div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-800">
							<Link href="/signup?role=patient">
								<Button
									size="lg"
									className="group px-12 py-8 text-lg rounded-2xl font-semibold bg-gradient-to-r from-medical-teal-500 to-medical-indigo-500 hover:from-medical-teal-600 hover:to-medical-indigo-600 text-white shadow-2xl hover:shadow-medical-teal-500/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
								>
									<Heart className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
									Get Started as Patient
								</Button>
							</Link>
							<Link href="/signup?role=researcher">
								<Button
									size="lg"
									className="group px-12 py-8 text-lg rounded-2xl font-semibold bg-gradient-to-r from-medical-indigo-500 to-medical-lavender-500 hover:from-medical-indigo-600 hover:to-medical-lavender-600 text-white shadow-2xl hover:shadow-medical-indigo-500/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
								>
									<FlaskConical className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
									Join as Researcher
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Footer Spacer */}
			<div className="h-20"></div>
		</div>
	);
}
