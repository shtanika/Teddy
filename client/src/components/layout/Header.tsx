'use client';
import { Heart, User } from 'lucide-react';

export default function Header() {
  return (
    <div className="flex items-center justify-between py-6 px-8 bg-white/50 backdrop-blur-sm border-b border-teddy-muted/10">
      <div className="flex items-center space-x-3">
        <Heart className="w-8 h-8 text-teddy-brown" />
        <span className="text-xl font-semibold text-teddy-brown">Teddy</span>
      </div>

      <button 
        className="w-8 h-8 rounded-full bg-teddy-brown text-white flex items-center justify-center hover:bg-teddy-accent transition-colors"
        aria-label="User Profile"
      >
        <User className="w-5 h-5" />
      </button>
    </div>
  );
} 