'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Route,
  Calendar,
  Ticket,
  Users,
  FileText,
  Car,
  UserCircle,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  DollarSign,
  HeadphonesIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: ('admin' | 'agency')[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Routes', href: '/routes', icon: Route, roles: ['admin'] },
  { label: 'Scheduled Rides', href: '/scheduled-rides', icon: Calendar },
  { label: 'Bookings', href: '/bookings', icon: Ticket },
  { label: 'Leads', href: '/leads', icon: FileText, roles: ['agency'] },
  { label: 'Quotes', href: '/quotes', icon: FileText, roles: ['agency'] },
  { label: 'Drivers', href: '/drivers', icon: UserCircle },
  { label: 'Vehicles', href: '/vehicles', icon: Car },
  { label: 'Agencies', href: '/agencies', icon: Building2, roles: ['admin'] },
  { label: 'Pricing', href: '/pricing', icon: DollarSign, roles: ['admin'] },
  { label: 'Support', href: '/support', icon: HeadphonesIcon },
  { label: 'Payments', href: '/payments', icon: CreditCard },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  userRole: 'admin' | 'agency';
  userName: string;
  agencyName?: string;
}

export function Sidebar({ userRole, userName, agencyName }: SidebarProps) {
  const pathname = usePathname();

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-accent px-6">
          <span className="text-xl font-bold text-white">RewaCab</span>
          <span className="ml-2 rounded bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">
            {userRole === 'admin' ? 'Admin' : 'Agency'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-4">
          <ul className="space-y-1">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-accent p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">{userName}</p>
              {agencyName && (
                <p className="text-xs text-sidebar-muted">{agencyName}</p>
              )}
            </div>
            <button className="text-sidebar-muted hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
