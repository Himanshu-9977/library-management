import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ReadingStats } from "@/components/reading-stats"
import { GenreDistribution } from "@/components/genre-distribution"
import { YearlyProgress } from "@/components/yearly-progress"
import { PageHeader } from "@/components/page-header"
import { Suspense } from "react"
import { StatsSkeleton } from "@/components/skeletons"

export default async function StatsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Reading Statistics" subheading="Insights and analytics about your reading habits" />

      <Suspense fallback={<StatsSkeleton />}>
        <div className="grid gap-6 md:grid-cols-2">
          <ReadingStats />
          <GenreDistribution />
        </div>

        <YearlyProgress />
      </Suspense>
    </div>
  )
}
