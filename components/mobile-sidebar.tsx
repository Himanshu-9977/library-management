"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserButton } from "@clerk/nextjs"
import { BookOpen, LayoutDashboard, Library, Menu, PieChart, Settings, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

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
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex justify-between items-center w-full">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>MyLibrary</span>
          </Link>

          <UserButton afterSignOutUrl="/sign-in" />
        </div>

        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
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
                  <Link href={route.href} onClick={() => setOpen(false)}>
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
        </SheetContent>
      </Sheet>
    </div>
  )
}
