'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/common/Button';

// Icons
import {
  Grid,
  PlusCircle,
  Target,
  Book,
  Cpu,
  LogOut,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: Grid, href: '/dashboard' },
  { name: 'Daily Log', icon: PlusCircle, href: '/daily-log' },
  { name: 'Goals', icon: Target, href: '/goals' },
  { name: 'Journal', icon: Book, href: '/journal' },
  { name: 'AI Insights', icon: Cpu, href: '/ai-insights' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-md border-r border-teddy-muted/20 flex flex-col h-screen fixed">
      <nav className="flex-1 p-4 pt-8">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:translate-x-1 ${
                  isActive 
                    ? 'text-teddy-brown bg-teddy-beige/50' 
                    : 'text-teddy-accent hover:bg-teddy-beige/30'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-teddy-muted/20">
        <Button
          variant="secondary"
          className="w-full justify-start"
          onClick={() => {/* Handle sign out */}}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
} 