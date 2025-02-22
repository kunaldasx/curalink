import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function ResearcherLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="flex relative">
				<Sidebar role="researcher" />
				<main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
					{children}
				</main>
			</div>
		</div>
	);
}
