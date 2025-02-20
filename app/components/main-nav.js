"use client";

import { Banknote, Home, Package, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function MainNav() {
  const items = [
    { title: "Home", href: "/invoice-form", icon: Home },
    { title: "Sales", href: "/sales", icon: Banknote },
    { title: "Purchases", href: "/purchases", icon: Package },
    { title: "Settings", href: "/profile", icon: Settings },
  ];

  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(storedLoginStatus === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="flex items-center space-x-6">
      {isLoggedIn &&
        items.map((item) => (
          <motion.div
            key={item.href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                pathname === item.href ? "text-indigo-600" : "text-gray-600 hover:text-indigo-500"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          </motion.div>
        ))}
      {isLoggedIn && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="rounded-lg text-gray-600 hover:text-indigo-500"
          >
            Logout
          </Button>
        </motion.div>
      )}
    </nav>
  );
}