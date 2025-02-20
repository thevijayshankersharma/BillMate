"use client";

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainNav } from "./components/main-nav";

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    const loggedIn = storedLoginStatus === 'true';
    setIsLoggedIn(loggedIn);
  }, [pathname, router]);

  const shouldShowHeader = pathname !== '/' && pathname !== '/login' && pathname !== '/register';

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-geist`}>
        {shouldShowHeader && (
          <header className="sticky top-0 z-50 w-full bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span>BillMate</span>
              </Link>
              <MainNav />
            </div>
          </header>
        )}
        <main className="flex-1">
          {children}
        </main>
        <footer className="w-full border-t border-gray-200 py-4 bg-white text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BillMate. All rights reserved.
        </footer>
      </body>
    </html>
  );
}