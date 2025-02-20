import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="patient" />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
