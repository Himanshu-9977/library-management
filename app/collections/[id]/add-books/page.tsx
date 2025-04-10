import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { BooksListSkeleton } from "@/components/skeletons"
import { AddBooksToCollection } from "@/components/add-books-to-collection"
import { getCollectionById } from "@/lib/actions"

export default async function AddBooksToCollectionPage({ params }: { params: { id: string } }) {
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
          <Link href={`/collections/${params.id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Collection
          </Link>
          <PageHeader 
            heading={`Add Books to ${collection.name}`} 
            subheading="Select books to add to this collection" 
          />
        </div>
      </div>

      <Suspense fallback={<BooksListSkeleton />}>
        <AddBooksToCollection collectionId={params.id} />
      </Suspense>
    </div>
  )
}
