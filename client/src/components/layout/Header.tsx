'use client';
import { Bell, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="flex items-center justify-between py-6 px-8 bg-white/50 backdrop-blur-sm border-b border-teddy-muted/10">
      <div>
        <h1 className="text-2xl font-bold text-teddy-brown">{title}</h1>
        {subtitle && (
          <p className="text-sm text-teddy-accent mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button 
          className="p-2 text-teddy-accent hover:text-teddy-brown rounded-lg hover:bg-teddy-beige/30 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button 
          className="p-2 text-teddy-accent hover:text-teddy-brown rounded-lg hover:bg-teddy-beige/30 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 