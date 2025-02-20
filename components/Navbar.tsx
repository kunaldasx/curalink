'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Activity, LogOut, User, Mail, UserCircle } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    });
  };

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get gradient colors based on role
  const getAvatarGradient = (role: string) => {
    if (role === 'patient') {
      return 'bg-gradient-to-br from-medical-teal-400 to-medical-indigo-500';
    } else if (role === 'researcher') {
      return 'bg-gradient-to-br from-medical-indigo-400 to-medical-lavender-500';
    }
    return 'bg-gradient-to-br from-gray-400 to-gray-600';
  };

  // Get profile link based on role
  const getProfileLink = (role: string) => {
    return role === 'patient' ? '/patient/profile' : '/researcher/profile';
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">CuraLink</span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-medical-teal-400 focus:ring-offset-2">
                  <Avatar className={`h-10 w-10 cursor-pointer ring-2 ring-white shadow-md hover:scale-105 transition-transform duration-200 ${getAvatarGradient(session.user.role)}`}>
                    <AvatarFallback className="bg-transparent text-white font-bold text-sm">
                      {getInitials(session.user.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-xl shadow-lg border-0 ring-1 ring-gray-200" align="end">
                {/* User Info Header */}
                <DropdownMenuLabel className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className={`h-12 w-12 ${getAvatarGradient(session.user.role)}`}>
                      <AvatarFallback className="bg-transparent text-white font-bold">
                        {getInitials(session.user.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">
                        {session.user.name}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {session.user.role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                {/* Email */}
                {session.user.email && (
                  <div className="px-2 py-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{session.user.email}</span>
                    </div>
                  </div>
                )}

                <DropdownMenuSeparator />

                {/* My Profile Link */}
                <DropdownMenuItem asChild>
                  <Link
                    href={getProfileLink(session.user.role)}
                    className="flex items-center gap-2 cursor-pointer px-2 py-2 hover:bg-gradient-to-r hover:from-medical-teal-50 hover:to-medical-indigo-50 rounded-lg transition-colors"
                  >
                    <UserCircle className="h-4 w-4 text-medical-teal-600" />
                    <span className="font-medium">My Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Sign Out */}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer px-2 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors focus:bg-red-50 focus:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
