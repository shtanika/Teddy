import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { headers } from 'next/headers';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Teddy - Your Wellness Companion",
  description: "Track your mood, sleep, and wellness journey with Teddy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  const isLandingPage = pathname === '/';

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {isLandingPage ? (
          children
        ) : (
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
