import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function ResearcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="researcher" />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
