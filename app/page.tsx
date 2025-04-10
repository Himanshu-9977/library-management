import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentlyAddedBooks } from "@/components/recently-added-books"
import { ReadingGoals } from "@/components/reading-goals"
import { BookSuggestion } from "@/components/book-suggestion"
import { PageHeader } from "@/components/page-header"
import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/skeletons"
import { addDefaultBooks } from "@/lib/actions"

export default async function Home() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Add default books for new users
  try {
    await addDefaultBooks()
  } catch (error) {
    console.error("Error adding default books:", error)
    // Continue even if adding default books fails
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Dashboard" subheading="Overview of your reading activity and library stats" />

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div className="h-[300px] rounded-lg bg-muted/30 animate-pulse" />}>
          <RecentlyAddedBooks />
        </Suspense>
        <Suspense fallback={<div className="h-[300px] rounded-lg bg-muted/30 animate-pulse" />}>
          <ReadingGoals />
        </Suspense>
        <Suspense fallback={<div className="h-[300px] rounded-lg bg-muted/30 animate-pulse" />}>
          <BookSuggestion />
        </Suspense>
      </div>
    </div>
  )
}
