import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Suspense } from "react"
import { BooksListSkeleton } from "@/components/skeletons"
import { DirectBooksList } from "@/components/direct-books-list"

export default async function BooksPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader heading="My Books" subheading="Browse and manage your book collection" />
        <Button asChild size="sm" className="sm:self-start">
          <Link href="/books/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Book
          </Link>
        </Button>
      </div>

      <Suspense fallback={<BooksListSkeleton />}>
        <DirectBooksList />
      </Suspense>
    </div>
  )
}
