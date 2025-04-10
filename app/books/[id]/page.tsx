import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { BookDetail } from "@/components/book-detail"
import { getBookById } from "@/lib/actions"
import { Suspense } from "react"
import { BookDetailSkeleton } from "@/components/skeletons"
import { ErrorBoundary } from "@/components/error-boundary"

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <ErrorBoundary
      fallback={<div className="p-4 text-destructive">Failed to load book details. Please try again later.</div>}
    >
      <Suspense fallback={<BookDetailSkeleton />}>
        <BookDetailContent id={params.id} />
      </Suspense>
    </ErrorBoundary>
  )
}

async function BookDetailContent({ id }: { id: string }) {
  const book = await getBookById(id)

  // Get the referring collection ID from the URL search params
  const searchParams = new URL(headers().get("referer") || "").searchParams
  const referringCollectionId = searchParams.get("from") || undefined

  if (!book) {
    redirect("/books")
  }

  return <BookDetail book={book} referringCollectionId={referringCollectionId} />
}
