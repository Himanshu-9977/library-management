"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { FolderPlus, X, Check, Loader2 } from "lucide-react"
import { CollectionSelector } from "@/components/collection-selector"
import { getCollections, addBooksToCollection, removeBookFromCollection } from "@/lib/actions"
import type { Collection } from "@/types/collection"

interface BookCollectionsProps {
  bookId: string
  collections: string[]
}

export function BookCollections({ bookId, collections = [] }: BookCollectionsProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [bookCollections, setBookCollections] = useState<string[]>(collections)
  const [allCollections, setAllCollections] = useState<Collection[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>(collections)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections()
        setAllCollections(data)
      } catch (error) {
        console.error("Error fetching collections:", error)
        toast.error("Failed to load collections")
      } finally {
        setIsLoading(false)
      }
    }

    if (isDialogOpen) {
      fetchCollections()
    }
  }, [isDialogOpen])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // For each collection that was added
      const addedCollections = selectedCollections.filter(id => !bookCollections.includes(id))
      for (const collectionId of addedCollections) {
        await addBooksToCollection([bookId], collectionId)
      }
      
      // For each collection that was removed
      const removedCollections = bookCollections.filter(id => !selectedCollections.includes(id))
      for (const collectionId of removedCollections) {
        await removeBookFromCollection(bookId, collectionId)
      }
      
      setBookCollections(selectedCollections)
      toast.success("Collections updated", {
        description: "The book's collections have been updated successfully."
      })
      
      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating collections:", error)
      toast.error("Failed to update collections")
    } finally {
      setIsSaving(false)
    }
  }

  const getCollectionById = (id: string) => {
    return allCollections.find(collection => collection._id === id)
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Collections</h3>
      
      <div className="flex flex-wrap gap-2">
        {bookCollections.length > 0 ? (
          allCollections
            .filter(collection => bookCollections.includes(collection._id))
            .map(collection => (
              <Badge 
                key={collection._id} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                <div 
                  className="h-2 w-2 rounded-full" 
                  style={{ backgroundColor: collection.color }} 
                />
                {collection.name}
              </Badge>
            ))
        ) : (
          <p className="text-sm text-muted-foreground">Not in any collections</p>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2">
            <FolderPlus className="mr-2 h-4 w-4" />
            Manage Collections
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Collections</DialogTitle>
            <DialogDescription>
              Add this book to collections or remove it from collections.
            </DialogDescription>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="py-4">
              <CollectionSelector 
                selectedCollections={selectedCollections}
                onChange={setSelectedCollections}
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || isLoading}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
