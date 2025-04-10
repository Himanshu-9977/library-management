"use client"

import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { UserButton } from "@clerk/nextjs"
import { BookMarked } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 w-full items-center justify-between">
        <Link href="/" className="flex items-center mr-4 space-x-2">
          <BookMarked className="h-6 w-6" />
          <span className="font-bold hidden sm:inline-block">Library Manager</span>
        </Link>
        
        <MainNav />
        
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  )
}
