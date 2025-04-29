import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-teddy-brown">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-teddy-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-teddy-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xl font-semibold">Teddy</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-teddy-accent hover:text-teddy-brown transition-colors">Features</a>
              <a href="#about" className="text-teddy-accent hover:text-teddy-brown transition-colors">About</a>
              <Link href="/signup" className="px-4 py-2 bg-teddy-brown text-white rounded-lg hover:bg-teddy-accent transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your Personal Wellness Journey Starts Here
              </h1>
              <p className="text-lg text-teddy-accent mb-8">
                Track your mood, sleep, and daily habits with Teddy - your AI-powered wellness companion that helps you understand and improve your well-being.
              </p>
              <div className="flex space-x-4">
                <Link href="/signup" className="px-6 py-3 bg-teddy-brown text-white rounded-lg hover:bg-teddy-accent transition-colors">
                  Start Your Journey
                </Link>
                <button className="px-6 py-3 border border-teddy-brown text-teddy-brown rounded-lg hover:bg-teddy-beige/50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="card p-6">
                <Image
                  src="/wellness-tracking.jpg"
                  alt="Wellness tracking"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Teddy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card card p-6">
              <div className="w-12 h-12 bg-teddy-beige/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teddy-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Tracking</h3>
              <p className="text-teddy-accent">Track your mood, sleep, and daily habits with intuitive interfaces and personalized insights.</p>
            </div>

            <div className="feature-card card p-6">
              <div className="w-12 h-12 bg-teddy-beige/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teddy-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-teddy-accent">Get personalized recommendations and understand patterns in your wellness journey.</p>
            </div>

            <div className="feature-card card p-6">
              <div className="w-12 h-12 bg-teddy-beige/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teddy-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Journaling</h3>
              <p className="text-teddy-accent">Express yourself with our beautiful journaling interface and track your emotional well-being.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="card p-6">
                <Image
                  src="/wellness-meditation.jpg"
                  alt="Wellness meditation"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Your Journey to Better Well-being</h2>
              <p className="text-lg text-teddy-accent mb-6">
                Teddy is more than just a wellness app - it's your personal companion on the journey to better health and happiness. We combine cutting-edge AI technology with a warm, intuitive interface to help you understand and improve your well-being.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-teddy-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Personalized wellness tracking</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-teddy-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI-powered insights and recommendations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-teddy-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Beautiful journaling experience</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-teddy-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <svg className="w-6 h-6 text-teddy-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-semibold">Teddy</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-teddy-accent hover:text-teddy-brown transition-colors">Privacy</a>
              <a href="#" className="text-teddy-accent hover:text-teddy-brown transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
