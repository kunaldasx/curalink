"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function SignupPage() {
	const searchParams = useSearchParams();
	const roleParam = searchParams.get("role") || "patient";

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<"patient" | "researcher">(
		roleParam as "patient" | "researcher",
	);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password, role }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Signup failed");
				setLoading(false);
				return;
			}

			// Auto sign in the user after successful signup
			const signInResult = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (signInResult?.error) {
				setError("Account created but login failed. Please log in manually.");
				setLoading(false);
				return;
			}

			// Redirect to onboarding after successful signin
			if (role === "patient") {
				router.push("/patient/onboarding");
			} else {
				router.push("/researcher/onboarding");
			}
			router.refresh(); // Force refresh to update session
		} catch (err) {
			setError("An error occurred. Please try again.");
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md">
				<div className="flex justify-center mb-8">
					<Link href="/" className="flex items-center gap-2">
						<Activity className="h-8 w-8 text-primary" />
						<span className="text-2xl font-bold">CuraLink</span>
					</Link>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Create Account</CardTitle>
						<CardDescription>Join CuraLink as a {role}</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
									{error}
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="role">I am a</Label>
								<select
									id="role"
									value={role}
									onChange={(e) =>
										setRole(e.target.value as "patient" | "researcher")
									}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
								>
									<option value="patient">Patient/Caregiver</option>
									<option value="researcher">Researcher</option>
								</select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									type="text"
									placeholder="John Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									minLength={6}
								/>
							</div>

							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? "Creating account..." : "Sign Up"}
							</Button>

							<p className="text-center text-sm text-gray-600">
								Already have an account?{" "}
								<Link
									href={`/login?role=${roleParam}`}
									className="text-primary font-medium hover:underline"
								>
									Log in
								</Link>
							</p>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
