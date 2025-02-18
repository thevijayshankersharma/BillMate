"use client";
import { Banknote, Home, Package, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

export function MainNav() {
  const items = [
    { title: "Home", href: "/invoice-form", icon: Home }, // Corrected href to "/invoice-form"
    { title: "Sales", href: "/sales", icon: Banknote }, // Example - adjust if you have a sales page
    { title: "Purchases", href: "/purchases", icon: Package }, // Example - adjust if you have a purchases page
    { title: "Settings", href: "/profile", icon: Settings }, // Corrected href to "/profile" and updated title to Settings (Profile)
  ];

  const pathname = usePathname();

  return (
    <nav className="ml-6 flex items-center space-x-4 lg:space-x-6">
      {items.map((item) => (
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
    </nav>
  );
}