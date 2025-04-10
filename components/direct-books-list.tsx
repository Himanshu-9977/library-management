"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { Book } from "@/types/book"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Edit, MoreVertical, Star, Trash, BookOpen, BookX, BookMarked } from "lucide-react"
import { getBooks, deleteBook, updateBook } from "@/lib/actions"

export function DirectBooksList() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      try {
        const data = await getBooks({})
        setBooks(data)
      } catch (error) {
        console.error("Error fetching books:", error)
        toast.error("Something went wrong", {
          description: "Failed to load your books. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const confirmDelete = (id: string) => {
    setBookToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!bookToDelete) return

    setIsDeleting(true)
    try {
      await deleteBook(bookToDelete)
      setBooks(books.filter((book) => book._id !== bookToDelete))
      toast.success("Book deleted", {
        description: "The book has been removed from your library.",
      })
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong", {
        description: "Failed to delete the book. Please try again later.",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setBookToDelete(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unread":
        return <BookX className="h-4 w-4 mr-1" />
      case "in-progress":
        return <BookOpen className="h-4 w-4 mr-1" />
      case "completed":
        return <BookMarked className="h-4 w-4 mr-1" />
      default:
        return <BookX className="h-4 w-4 mr-1" />
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-5 w-48 bg-muted/60 rounded animate-pulse"></div>
          <div className="h-8 w-20 bg-muted/60 rounded animate-pulse"></div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative aspect-[2/3] w-full bg-muted/50"></div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-5 w-3/4 bg-muted/50 rounded"></div>
                  <div className="h-4 w-1/2 bg-muted/50 rounded"></div>
                  <div className="flex justify-between">
                    <div className="h-6 w-16 bg-muted/50 rounded-full"></div>
                    <div className="h-6 w-6 bg-muted/50 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-background/50 shadow-sm">
        <div className="w-16 h-16 mb-4 text-muted-foreground">
          <BookX className="w-full h-full" />
        </div>
        <h3 className="text-xl font-medium">Your library is empty</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          Start building your collection by adding your first book.
        </p>
        <Button className="mt-6" size="lg" asChild>
          <Link href="/books/add">Add Your First Book</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {books.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-muted-foreground">
            Showing {books.length} {books.length === 1 ? "book" : "books"} in your library
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => router.refresh()}>
              <svg className="mr-1 h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              Refresh
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book, index) => (
          <Card
            key={book._id}
            className="overflow-hidden transition-all hover:shadow-md group animate-in fade-in-5 slide-in-from-bottom-3 duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Link href={`/books/${book._id}`} className="block">
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted/30">
                <Image
                  src={book.coverImage || "/book-placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  priority={index < 4} // Load first 4 images with priority
                />
              </div>
            </Link>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/books/${book._id}`} className="hover:underline">
                    <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/books/${book._id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/books/${book._id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          const newStatus = book.status === "unread" ? "in-progress" : book.status === "in-progress" ? "completed" : "unread";
                          await updateBook(book._id, { status: newStatus });
                          setBooks(books.map(b => b._id === book._id ? { ...b, status: newStatus } : b));
                          toast.success(`Book marked as ${newStatus === "in-progress" ? "Reading" : newStatus === "completed" ? "Read" : "Unread"}`);
                          router.refresh();
                        } catch (error) {
                          console.error(error);
                          toast.error("Failed to update status");
                        }
                      }}
                    >
                      {book.status === "unread" ? (
                        <>
                          <BookOpen className="mr-2 h-4 w-4" /> Mark as Reading
                        </>
                      ) : book.status === "in-progress" ? (
                        <>
                          <BookMarked className="mr-2 h-4 w-4" /> Mark as Read
                        </>
                      ) : (
                        <>
                          <BookX className="mr-2 h-4 w-4" /> Mark as Unread
                        </>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => confirmDelete(book._id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant={getStatusBadgeVariant(book.status)} className="flex items-center">
                  {getStatusIcon(book.status)}
                  {book.status === "in-progress" ? "Reading" : book.status === "completed" ? "Read" : "Unread"}
                </Badge>
                {book.rating && (
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{book.rating}/5</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this book from your library. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
