"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Library, BookCopy, ChartColumnIncreasing } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  
  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: <Home className="h-4 w-4 mr-2" />,
      active: pathname === "/"
    },
    {
      href: "/books",
      label: "Books",
      icon: <BookCopy className="h-4 w-4 mr-2" />,
      active: pathname === "/books" || pathname.startsWith("/books/")
    },
    // {
    //   href: "/loans",
    //   label: "Loans",
    //   icon: <BookOpen className="h-4 w-4 mr-2" />,
    //   active: pathname === "/loans" || pathname.startsWith("/loans/")
    // },
    {
      href: "/stats",
      label: "Statistics",
      icon: <ChartColumnIncreasing className="h-4 w-4 mr-2" />,
      active: pathname === "/stats"
    },
    {
      href: "/collections",
      label: "Collections",
      icon: <Library className="h-4 w-4 mr-2" />,
      active: pathname === "/collections" || pathname.startsWith("/collections/")
    }
  ]

  return (
    <div className="hidden md:flex items-center space-x-1">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={route.active ? "default" : "ghost"}
          size="sm"
          asChild
          className={cn(
            "h-9",
            route.active && "bg-primary text-primary-foreground"
          )}
        >
          <Link href={route.href} className="flex items-center">
            {route.icon}
            {route.label}
          </Link>
        </Button>
      ))}
    </div>
  )
}
