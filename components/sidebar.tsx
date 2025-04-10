"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { BookOpen, LayoutDashboard, Library, PieChart, Settings, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      href: "/books",
      label: "My Books",
      icon: BookOpen,
      active: pathname.startsWith("/books"),
    },
    {
      href: "/loans",
      label: "Loans",
      icon: Share2,
      active: pathname.startsWith("/loans"),
    },
    {
      href: "/collections",
      label: "Collections",
      icon: Library,
      active: pathname.startsWith("/collections"),
    },
    {
      href: "/stats",
      label: "Statistics",
      icon: PieChart,
      active: pathname.startsWith("/stats"),
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
  ]

  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-lg">MyLibrary</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant={route.active ? "secondary" : "ghost"}
              className={cn("justify-start", route.active && "bg-primary/10 text-primary hover:bg-primary/20")}
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-2 pb-2">
          <UserButton afterSignOutUrl="/sign-in" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">My Account</span>
          </div>
        </div>
      </div>
    </div>
  )
}
