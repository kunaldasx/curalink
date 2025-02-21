import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email: string;
			name: string;
			role: "patient" | "researcher";
		};
	}

	interface User {
		id: string;
		email: string;
		name: string;
		role: "patient" | "researcher";
	}
}

interface IUser {
	_id: string;
	email: string;
	name: string;
	role: "patient" | "researcher";
	passwordHash: string;
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: "patient" | "researcher";
	}
}

const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				await dbConnect();
				const user = await User.findOne<IUser>({
					email: credentials.email,
				});

				if (!user) {
					return null;
				}

				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.passwordHash
				);

				if (!isPasswordValid) {
					return null;
				}

				return {
					id: user._id.toString(),
					email: user.email,
					name: user.name,
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
				session.user.role = token.role;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
