'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
        rememberMe: true
      }, {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          router.push('/dashboard');
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      });
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: string) {
    try {
      await authClient.signIn.social({
        provider: provider as "google",
        callbackURL: '/dashboard',
        errorCallbackURL: '/signin',
        newUserCallbackURL: '/dashboard'
      });
    } catch (err) {
      setError('Social sign-in failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teddy-beige to-teddy-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-teddy-brown">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-teddy-muted/20 placeholder-teddy-muted bg-white/80 text-teddy-brown focus:outline-none focus:ring-2 focus:ring-teddy-brown/20 focus:border-teddy-brown/20 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-teddy-muted/20 placeholder-teddy-muted bg-white/80 text-teddy-brown focus:outline-none focus:ring-2 focus:ring-teddy-brown/20 focus:border-teddy-brown/20 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teddy-brown hover:bg-teddy-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teddy-brown/20 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-teddy-muted/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-teddy-beige to-teddy-light text-teddy-brown">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => handleSocialSignIn('google')}
                className="w-full inline-flex justify-center py-2 px-4 border border-teddy-muted/20 rounded-lg shadow-sm bg-white/80 text-sm font-medium text-teddy-brown hover:bg-teddy-beige/50 transition-colors"
              >
                Google
              </button>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/signup" 
              className="text-sm text-teddy-brown hover:text-teddy-accent transition-colors"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
