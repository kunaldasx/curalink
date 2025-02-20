"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	LayoutDashboard,
	Users,
	FlaskConical,
	BookOpen,
	MessageSquare,
	Heart,
	UserCog,
	CalendarCheck,
	Mail,
	ChevronLeft,
	ChevronRight,
	Menu,
	Sparkles,
} from "lucide-react";

interface SidebarProps {
	role: "patient" | "researcher";
}

export default function Sidebar({ role }: SidebarProps) {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Load collapsed state from localStorage and detect mobile
	useEffect(() => {
		// Load saved collapsed state
		const savedState = localStorage.getItem("sidebar-collapsed");
		if (savedState !== null) {
			setIsCollapsed(JSON.parse(savedState));
		}

		// Check if mobile
		const checkMobile = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);
			// On desktop, restore collapsed state
			if (!mobile) {
				const state = localStorage.getItem("sidebar-collapsed");
				if (state !== null) {
					setIsCollapsed(JSON.parse(state));
				}
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Save collapsed state to localStorage (desktop only)
	const toggleSidebar = () => {
		if (isMobile) {
			setIsMobileMenuOpen(!isMobileMenuOpen);
		} else {
			const newState = !isCollapsed;
			console.log("Toggling sidebar from", isCollapsed, "to", newState);
			setIsCollapsed(newState);
			localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
		}
	};

	const patientLinks = [
		{
			href: "/patient/dashboard",
			label: "Dashboard",
			icon: LayoutDashboard,
		},
		{
			href: "/patient/ai-assistant",
			label: "AI Assistant",
			icon: Sparkles,
		},
		{ href: "/patient/experts", label: "Health Experts", icon: Users },
		{
			href: "/patient/clinical-trials",
			label: "Clinical Trials",
			icon: FlaskConical,
		},
		{
			href: "/patient/meetings",
			label: "Meeting Requests",
			icon: CalendarCheck,
		},
		{ href: "/patient/messages", label: "Messages", icon: MessageSquare },
		{
			href: "/patient/publications",
			label: "Publications",
			icon: BookOpen,
		},
		{ href: "/patient/forums", label: "Forums", icon: Mail },
		{ href: "/patient/favorites", label: "Favorites", icon: Heart },
		{ href: "/patient/profile", label: "My Profile", icon: UserCog },
	];

	const researcherLinks = [
		{
			href: "/researcher/dashboard",
			label: "Dashboard",
			icon: LayoutDashboard,
		},
		{
			href: "/researcher/collaborators",
			label: "Collaborators",
			icon: Users,
		},
		{
			href: "/researcher/clinical-trials",
			label: "Clinical Trials",
			icon: FlaskConical,
		},
		{
			href: "/researcher/publications",
			label: "Publications",
			icon: BookOpen,
		},
		{
			href: "/researcher/meeting-requests",
			label: "Meeting Requests",
			icon: CalendarCheck,
		},
		{
			href: "/researcher/messages",
			label: "Messages",
			icon: MessageSquare,
		},
		{ href: "/researcher/forums", label: "Forums", icon: Mail },
		{ href: "/researcher/favorites", label: "Favorites", icon: Heart },
		{ href: "/researcher/profile", label: "My Profile", icon: UserCog },
	];

	const links = role === "patient" ? patientLinks : researcherLinks;

	return (
		<>
			{/* Mobile Menu Button - Fixed at top */}
			{isMobile && !isMobileMenuOpen && (
				<button
					onClick={() => setIsMobileMenuOpen(true)}
					className="fixed top-12 left-4 z-30 md:hidden p-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-200"
				>
					<Menu className="h-6 w-6 text-medical-teal-600" />
				</button>
			)}

			{/* Mobile Overlay Backdrop */}
			{isMobile && isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}

			<aside
				className={cn(
					"relative bg-white transition-all duration-300 ease-smooth",
					// Mobile: hidden by default, slide in as overlay when open
					isMobile
						? cn(
								"fixed top-0 left-0 h-full z-50 shadow-2xl",
								"w-64 border-r",
								isMobileMenuOpen
									? "translate-x-0"
									: "-translate-x-full"
						  )
						: cn(
								// Desktop: normal sidebar behavior
								"border-r",
								isCollapsed ? "w-16" : "w-64"
						  )
				)}
			>
				{/* Toggle Button - Desktop Only */}
				{!isMobile && (
					<div className="absolute -right-3 top-6 z-50">
						<Button
							onClick={toggleSidebar}
							size="icon"
							variant="outline"
							className="h-7 w-7 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 border border-gray-300"
						>
							{isCollapsed ? (
								<ChevronRight className="h-4 w-4" />
							) : (
								<ChevronLeft className="h-4 w-4" />
							)}
						</Button>
					</div>
				)}

				{/* Logo/Brand Area */}
				<div
					className={cn(
						"flex items-center gap-3 p-4 border-b transition-all duration-300",
						isMobile
							? "justify-between"
							: isCollapsed
							? "justify-center px-2"
							: "justify-start"
					)}
				>
					<div
						className={cn(
							"flex items-center gap-3",
							!isMobile && isCollapsed && "flex-col gap-2"
						)}
					>
						<div className="h-8 w-8 rounded-xl bg-gradient-teal-purple flex items-center justify-center flex-shrink-0">
							<Heart className="h-5 w-5 text-white" />
						</div>
						{(isMobile || !isCollapsed) && (
							<div className="animate-fade-in-right">
								<h2 className="font-semibold text-lg text-gradient-teal-purple">
									CuraLink
								</h2>
								<p className="text-xs text-muted-foreground capitalize">
									{role}
								</p>
							</div>
						)}
					</div>

					{/* Mobile Close Button */}
					{isMobile && (
						<Button
							onClick={() => setIsMobileMenuOpen(false)}
							size="icon"
							variant="ghost"
							className="h-8 w-8 text-gray-500 hover:text-gray-700"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
					)}
				</div>

				{/* Navigation Links */}
				<nav className="flex h-[calc(100%-73px)] flex-col gap-1 p-2 overflow-y-auto">
					{links.map((link) => {
						const Icon = link.icon;
						const isActive = pathname === link.href;

						return (
							<Link
								key={link.href}
								href={link.href}
								onClick={() =>
									isMobile && setIsMobileMenuOpen(false)
								}
								className={cn(
									"nav-item flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 group relative",
									"hover:bg-gradient-to-r hover:from-medical-teal-50 hover:to-medical-purple-50",
									isActive &&
										"bg-gradient-to-r from-medical-teal-100 to-medical-purple-100 font-semibold text-medical-teal-700 shadow-soft",
									isCollapsed && !isMobile
										? "justify-center"
										: "justify-start",
									!isActive &&
										"text-gray-600 hover:text-medical-teal-600"
								)}
								title={
									isCollapsed && !isMobile
										? link.label
										: undefined
								}
							>
								<Icon
									className={cn(
										"h-5 w-5 flex-shrink-0 transition-transform duration-200",
										"group-hover:scale-110",
										isActive && "text-medical-teal-600"
									)}
								/>

								{(isMobile || !isCollapsed) && (
									<span className="animate-fade-in-right truncate">
										{link.label}
									</span>
								)}

								{/* Tooltip for collapsed state - Desktop only */}
								{!isMobile && isCollapsed && (
									<div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-soft-lg">
										{link.label}
										<div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
									</div>
								)}
							</Link>
						);
					})}

					{/* Collapse/Expand hint at bottom */}
					{!isMobile && (
						<div
							className={cn(
								"mt-auto pt-2 border-t text-center",
								isCollapsed ? "px-2" : "px-3"
							)}
						>
							<Button
								onClick={toggleSidebar}
								variant="ghost"
								size="sm"
								className={cn(
									"w-full text-xs text-muted-foreground hover:text-medical-teal-600 transition-all",
									isCollapsed && "px-0"
								)}
							>
								{isCollapsed ? (
									<Menu className="h-4 w-4" />
								) : (
									<span className="flex items-center gap-2">
										<ChevronLeft className="h-3 w-3" />
										Collapse
									</span>
								)}
							</Button>
						</div>
					)}
				</nav>
			</aside>
		</>
	);
}
