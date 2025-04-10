"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookCopy, Library, User, ChartColumnIncreasing } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/",
    },
    {
      href: "/books",
      label: "Books",
      icon: <BookCopy className="h-5 w-5" />,
      active: pathname === "/books" || pathname.startsWith("/books/"),
    },
    // {
    //   href: "/loans",
    //   label: "Loans",
    //   icon: <BookOpen className="h-5 w-5" />,
    //   active: pathname === "/loans" || pathname.startsWith("/loans/")
    // },
    {
      href: "/stats",
      label: "Statistics",
      icon: <ChartColumnIncreasing className="h-4 w-4 mr-2" />,
      active: pathname === "/stats",
    },
    {
      href: "/collections",
      label: "Collections",
      icon: <Library className="h-5 w-5" />,
      active:
        pathname === "/collections" || pathname.startsWith("/collections/"),
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      active: pathname === "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border/40 shadow-sm">
      <div className="flex items-center justify-around h-16">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full px-2 py-1 transition-colors",
              route.active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {route.icon}
            <span className="text-xs mt-1">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
