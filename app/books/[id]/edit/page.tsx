import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { BookForm } from "@/components/book-form"
import { getBookById } from "@/lib/actions"
import { PageHeader } from "@/components/page-header"
import { Suspense } from "react"
import { BookFormSkeleton } from "@/components/skeletons"
import { ErrorBoundary } from "@/components/error-boundary"

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Edit Book" subheading="Update book information" />

      <ErrorBoundary
        fallback={<div className="p-4 text-destructive">Failed to load book data. Please try again later.</div>}
      >
        <Suspense fallback={<BookFormSkeleton />}>
          <EditBookFormContent id={params.id} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

async function EditBookFormContent({ id }: { id: string }) {
  const book = await getBookById(id)

  if (!book) {
    redirect("/books")
  }

  return <BookForm book={book} />
}
