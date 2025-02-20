"use client";

import { GeistSans, GeistMono } from "geist/font"; // Updated import
import "./globals.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { MainNav } from "./components/main-nav";
import { motion } from "framer-motion";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(storedLoginStatus === "true");
  }, [pathname, router]);

  const shouldShowHeader = !["/", "/login", "/register"].includes(pathname);

  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased bg-gray-50`}>
        {shouldShowHeader && (
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full bg-white shadow-lg"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-indigo-600 font-extrabold text-xl">
                BillMate
              </Link>
              <MainNav />
            </div>
          </motion.header>
        )}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}