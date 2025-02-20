'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  BookOpen,
  MessageSquare,
  Heart,
  UserCog,
} from 'lucide-react';

interface SidebarProps {
  role: 'patient' | 'researcher';
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const patientLinks = [
    { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patient/experts', label: 'Health Experts', icon: Users },
    { href: '/patient/clinical-trials', label: 'Clinical Trials', icon: FlaskConical },
    { href: '/patient/publications', label: 'Publications', icon: BookOpen },
    { href: '/patient/forums', label: 'Forums', icon: MessageSquare },
    { href: '/patient/favorites', label: 'Favorites', icon: Heart },
    { href: '/patient/profile', label: 'My Profile', icon: UserCog },
  ];

  const researcherLinks = [
    { href: '/researcher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/researcher/collaborators', label: 'Collaborators', icon: Users },
    { href: '/researcher/clinical-trials', label: 'Clinical Trials', icon: FlaskConical },
    { href: '/researcher/forums', label: 'Forums', icon: MessageSquare },
    { href: '/researcher/favorites', label: 'Favorites', icon: Heart },
    { href: '/researcher/profile', label: 'My Profile', icon: UserCog },
  ];

  const links = role === 'patient' ? patientLinks : researcherLinks;

  return (
    <aside className="w-64 border-r bg-white">
      <div className="flex h-full flex-col gap-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                isActive && 'bg-accent font-medium text-primary'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
