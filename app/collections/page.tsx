import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CollectionsList } from "@/components/collections-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CreateCollectionDialog } from "@/components/create-collection-dialog"
import { PageHeader } from "@/components/page-header"
import { Suspense } from "react"
import { CollectionsListSkeleton } from "@/components/skeletons"

export default async function CollectionsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader heading="My Collections" subheading="Organize your books into collections" />
        <CreateCollectionDialog>
          <Button size="sm" className="sm:self-start">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Collection
          </Button>
        </CreateCollectionDialog>
      </div>

      <Suspense fallback={<CollectionsListSkeleton />}>
        <CollectionsList />
      </Suspense>
    </div>
  )
}
