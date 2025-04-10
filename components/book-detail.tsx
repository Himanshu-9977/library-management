"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Book } from "@/types/book"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { ArrowLeft, Edit, Star, Trash } from "lucide-react"
import { deleteBook } from "@/lib/actions"
import { BookCollections } from "@/components/book-collections"
import { BookStatusChanger } from "@/components/book-status-changer"

interface BookDetailProps {
  book: Book
  referringCollectionId?: string
}

export function BookDetail({ book, referringCollectionId }: BookDetailProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deleteBook(book._id)

      toast.success("Book deleted", {
        description: "The book has been removed from your library.",
      })

      router.push("/books")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong", {
        description: "Failed to delete the book. Please try again later.",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "unread":
        return "outline"
      case "in-progress":
        return "secondary"
      case "completed":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={referringCollectionId ? `/collections/${referringCollectionId}` : "/books"}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{book.title}</h1>
          {referringCollectionId && (
            <div className="text-sm text-muted-foreground mt-1">
              <Link href={`/collections/${referringCollectionId}`} className="hover:underline">
                ← Back to collection
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card className="overflow-hidden">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={book.coverImage || "/placeholder.svg?height=450&width=300"}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between">
              <Badge variant={getStatusBadgeVariant(book.status)}>
                {book.status === "in-progress" ? "Reading" : book.status === "completed" ? "Read" : "Unread"}
              </Badge>
              {book.rating && (
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                  <span>{book.rating}/5</span>
                </div>
              )}
            </div>

            <BookStatusChanger bookId={book._id} currentStatus={book.status} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{book.title}</h2>
            <p className="text-lg text-muted-foreground">by {book.author}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {book.genre && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Genre</h3>
                <p>{book.genre}</p>
              </div>
            )}

            {book.publicationYear && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Publication Year</h3>
                <p>{book.publicationYear}</p>
              </div>
            )}

            {book.isbn && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">ISBN</h3>
                <p>{book.isbn}</p>
              </div>
            )}
          </div>

          {book.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <p className="whitespace-pre-line">{book.notes}</p>
            </div>
          )}

          <BookCollections bookId={book._id} collections={book.collections || []} />

          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/books/${book._id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Book</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{book.title}"? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
