'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { Logo } from '@/components/common/Logo';
import { authClient } from '@/lib/auth-client';

// Icons
import {
  Grid,
  PlusCircle,
  Target,
  Book,
  Cpu,
  LogOut,
  User,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: Grid, href: '/dashboard' },
  { name: 'Daily Log', icon: PlusCircle, href: '/daily-log' },
  { name: 'Goals', icon: Target, href: '/goals' },
  { name: 'Journal', icon: Book, href: '/journal' },
  { name: 'AI Insights', icon: Cpu, href: '/ai-insights' },
];

interface UserData {
  name: string;
  image: string | null;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: session, error } = await authClient.getSession();
      if (session?.user?.name) {
        setUserData({
          name: session.user.name,
          image: session.user.image || null
        });
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/');
          },
        },
      });
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-md border-r border-teddy-muted/20 flex flex-col h-screen fixed">
      {/* Logo and User Section */}
      <div className="p-4 pt-8">
        <div className="flex items-center justify-center gap-1 mb-14 w-[180px] mx-auto">
          <Logo className="w-8 h-8" />
          <span className="text-2xl font-bold text-teddy-brown font-quicksand">Teddy</span>
        </div>
        <div className="flex flex-col items-center gap-2 mb-14 max-w-[180px] mx-auto">
          <div className="w-20 h-20 rounded-lg bg-teddy-beige/30 flex items-center justify-center overflow-hidden">
            {userData?.image ? (
              <Image
                src={userData.image}
                alt={userData.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-10 h-10 text-teddy-muted" />
            )}
          </div>
          <span className="text-base font-medium text-teddy-brown">
            {userData?.name || 'Loading...'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-2 w-[180px] mx-auto">
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

      {/* Sign Out */}
      <div className="p-4 border-t border-teddy-muted/20">
        <Button
          variant="secondary"
          className="w-full justify-center"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
} 
