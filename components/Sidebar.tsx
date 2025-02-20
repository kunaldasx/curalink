'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';

interface SidebarProps {
  role: 'patient' | 'researcher';
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save collapsed state to localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const patientLinks = [
    { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patient/experts', label: 'Health Experts', icon: Users },
    { href: '/patient/clinical-trials', label: 'Clinical Trials', icon: FlaskConical },
    { href: '/patient/meetings', label: 'My Meetings', icon: CalendarCheck },
    { href: '/patient/messages', label: 'Messages', icon: MessageSquare },
    { href: '/patient/publications', label: 'Publications', icon: BookOpen },
    { href: '/patient/forums', label: 'Forums', icon: Mail },
    { href: '/patient/favorites', label: 'Favorites', icon: Heart },
    { href: '/patient/profile', label: 'My Profile', icon: UserCog },
  ];

  const researcherLinks = [
    { href: '/researcher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/researcher/collaborators', label: 'Collaborators', icon: Users },
    { href: '/researcher/clinical-trials', label: 'Clinical Trials', icon: FlaskConical },
    { href: '/researcher/publications', label: 'Publications', icon: BookOpen },
    { href: '/researcher/meeting-requests', label: 'Meeting Requests', icon: CalendarCheck },
    { href: '/researcher/messages', label: 'Messages', icon: MessageSquare },
    { href: '/researcher/forums', label: 'Forums', icon: Mail },
    { href: '/researcher/favorites', label: 'Favorites', icon: Heart },
    { href: '/researcher/profile', label: 'My Profile', icon: UserCog },
  ];

  const links = role === 'patient' ? patientLinks : researcherLinks;

  return (
    <aside 
      className={cn(
        'relative border-r bg-white transition-all duration-300 ease-smooth',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <div className="absolute -right-3 top-6 z-10">
        <Button
          onClick={toggleSidebar}
          size="icon"
          variant="outline"
          className="h-6 w-6 rounded-full bg-white shadow-soft hover:shadow-soft-lg transition-all duration-200 hover:scale-110"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Logo/Brand Area */}
      <div className={cn(
        'flex items-center gap-3 p-4 border-b transition-all duration-300',
        isCollapsed ? 'justify-center px-2' : 'justify-start'
      )}>
        <div className="h-8 w-8 rounded-xl bg-gradient-teal-purple flex items-center justify-center flex-shrink-0">
          <Heart className="h-5 w-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="animate-fade-in-right">
            <h2 className="font-semibold text-lg text-gradient-teal-purple">CuraLink</h2>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
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
              className={cn(
                'nav-item flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 group relative',
                'hover:bg-gradient-to-r hover:from-medical-teal-50 hover:to-medical-purple-50',
                isActive && 'bg-gradient-to-r from-medical-teal-100 to-medical-purple-100 font-semibold text-medical-teal-700 shadow-soft',
                isCollapsed ? 'justify-center' : 'justify-start',
                !isActive && 'text-gray-600 hover:text-medical-teal-600'
              )}
              title={isCollapsed ? link.label : undefined}
            >
              <Icon className={cn(
                'h-5 w-5 flex-shrink-0 transition-transform duration-200',
                'group-hover:scale-110',
                isActive && 'text-medical-teal-600'
              )} />
              
              {!isCollapsed && (
                <span className="animate-fade-in-right truncate">
                  {link.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
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
          <div className={cn(
            'mt-auto pt-2 border-t text-center',
            isCollapsed ? 'px-2' : 'px-3'
          )}>
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="sm"
              className={cn(
                'w-full text-xs text-muted-foreground hover:text-medical-teal-600 transition-all',
                isCollapsed && 'px-0'
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
  );
}
