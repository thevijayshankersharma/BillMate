"use client";
import { Banknote, Home, Package, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../lib/utils";
import { Button } from "./ui/button"; // Import Button component
import React, { useState, useEffect } from 'react'; // Import useState and useEffect

export function MainNav() {
  const items = [
    { title: "Home", href: "/invoice-form", icon: Home }, // Corrected href to "/invoice-form" - Consider renaming to Invoice or Dashboard if it's not just for invoice form
    { title: "Sales", href: "/sales", icon: Banknote }, // Example - adjust if you have a sales page
    { title: "Purchases", href: "/purchases", icon: Package }, // Example - adjust if you have a purchases page
    { title: "Settings", href: "/profile", icon: Settings }, // Corrected href to "/profile" and updated title to Settings (Profile)
  ];

  const pathname = usePathname();
  const router = useRouter(); // Use useRouter for redirection
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    // Client-side effect to check login status from localStorage
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    const loggedIn = storedLoginStatus === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Clear login status from localStorage
    setIsLoggedIn(false); // Update local state to logged out
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="ml-6 flex items-center space-x-4 lg:space-x-6">
      {isLoggedIn && items.map((item) => ( // Conditionally render navigation items when logged in
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors text-gray-700 hover:text-indigo-600",
            pathname === item.href ? "text-indigo-600" : "text-gray-500"
          )}
        >
          <item.icon className="h-4 w-4 text-gray-500" />
          {item.title}
        </Link>
      ))}
      {isLoggedIn && ( // Conditionally render Logout button when logged in
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      )}
      {!isLoggedIn && ( // Conditionally render Login and Register buttons when logged out (Optional - if you want them in MainNav)
        <>
          <Link href="/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Register</Button>
          </Link>
        </>
      )}
    </nav>
  );
}