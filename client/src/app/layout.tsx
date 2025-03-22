import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Quicksand } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Teddy - Your Wellness Companion",
  description: "Track your mood, sleep, and wellness journey with Teddy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${quicksand.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
