import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookPlus } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { BooksListSkeleton } from "@/components/skeletons"
import { CollectionBooks } from "@/components/collection-books"
import { getCollectionById } from "@/lib/actions"

export default async function CollectionPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const collection = await getCollectionById(params.id)

  if (!collection) {
    redirect("/collections")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/collections" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Collections
          </Link>
          <PageHeader 
            heading={collection.name} 
            subheading={collection.description || "Books in this collection"} 
          />
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="sm:self-start">
            <Link href={`/collections/${params.id}/add-books`}>
              <BookPlus className="mr-2 h-4 w-4" />
              Add Books
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<BooksListSkeleton />}>
        <CollectionBooks collectionId={params.id} />
      </Suspense>
    </div>
  )
}
