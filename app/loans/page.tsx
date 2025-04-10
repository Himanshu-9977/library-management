import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { LoansList } from "@/components/loans-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Suspense } from "react"
import { LoansListSkeleton } from "@/components/skeletons"

export default async function LoansPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader heading="Book Loans" subheading="Track books you've loaned to others" />
        <Button asChild size="sm" className="sm:self-start">
          <Link href="/loans/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Loan
          </Link>
        </Button>
      </div>

      <Suspense fallback={<LoansListSkeleton />}>
        <LoansList />
      </Suspense>
    </div>
  )
}
