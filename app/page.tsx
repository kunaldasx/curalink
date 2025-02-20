import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity, Users, FlaskConical, BookOpen, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center">
          <Activity className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Welcome to CuraLink
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Connecting patients and researchers to discover clinical trials, publications, 
            experts, and collaboration opportunities
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/signup?role=patient">
              <Button size="lg" className="w-full sm:w-auto">
                <Users className="mr-2 h-5 w-5" />
                Continue as Patient/Caregiver
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signup?role=researcher">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <FlaskConical className="mr-2 h-5 w-5" />
                Continue as Researcher
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FlaskConical className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Clinical Trials</h3>
              <p className="text-gray-600">
                Search and discover relevant clinical trials matched to your needs
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Publications</h3>
              <p className="text-gray-600">
                Access cutting-edge research and medical publications
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Network</h3>
              <p className="text-gray-600">
                Connect with health experts and researchers worldwide
              </p>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-12">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
