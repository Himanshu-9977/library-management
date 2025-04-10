"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Collection } from "@/types/collection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Edit, Trash } from "lucide-react"
import Link from "next/link"
import { CreateCollectionDialog } from "@/components/create-collection-dialog"
import { getCollections, deleteCollection } from "@/lib/actions"
import { CollectionsListSkeleton } from "@/components/skeletons"

export function CollectionsList() {
  const router = useRouter()
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections()
        setCollections(data)
      } catch (error) {
        console.error(error)
        setError("Failed to load collections. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteCollection(id)
      setCollections(collections.filter((collection) => collection._id !== id))

      toast.success("Collection deleted", {
        description: "The collection has been removed.",
      })

      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong", {
        description: "Failed to delete the collection. Please try again later.",
      })
    }
  }

  if (isLoading) {
    return <CollectionsListSkeleton />
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-medium">No collections yet</h3>
        <p className="text-muted-foreground">Create your first collection to organize your books.</p>
        <CreateCollectionDialog>
          <Button className="mt-4">Create Your First Collection</Button>
        </CreateCollectionDialog>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <Card key={collection._id} className="transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: collection.color }} />
              <CardTitle>{collection.name}</CardTitle>
            </div>
            {collection.description && <CardDescription>{collection.description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <Link href={`/collections/${collection._id}`} className="text-sm text-primary hover:underline">
              View books in this collection
            </Link>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <CreateCollectionDialog collection={collection}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit collection</span>
              </Button>
            </CreateCollectionDialog>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(collection._id)}>
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete collection</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
