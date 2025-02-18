"use client";
import { Banknote, Home, Package, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

export function MainNav() {
  const items = [
    { title: "Home", href: "/", icon: Home },
    { title: "Sales", href: "/sales", icon: Banknote },
    { title: "Purchases", href: "/purchases", icon: Package },
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  const pathname = usePathname();

  return (
    <nav className="ml-6 flex items-center space-x-4 lg:space-x-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors text-gray-700 hover:text-indigo-600", // Changed text colors and hover effect
            pathname === item.href
              ? "text-indigo-600" // Active link color
              : "text-gray-500" // Default muted color
          )}
        >
          <item.icon className="h-4 w-4 text-gray-500" /> {/* Muted icons */}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}