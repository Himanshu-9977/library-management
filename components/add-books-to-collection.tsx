"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Book } from "@/types/book"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { BookOpen, BookX, BookMarked, Search, PlusCircle, Check } from "lucide-react"
import { getBooks, addBooksToCollection, getBooksByCollection } from "@/lib/actions"

interface AddBooksToCollectionProps {
  collectionId: string
}

export function AddBooksToCollection({ collectionId }: AddBooksToCollectionProps) {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [collectionBooks, setCollectionBooks] = useState<Book[]>([])
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch all books
        const allBooks = await getBooks({})
        setBooks(allBooks)
        
        // Fetch books already in the collection
        const booksInCollection = await getBooksByCollection(collectionId)
        setCollectionBooks(booksInCollection)
        
        // Create a set of book IDs already in the collection for easy lookup
        const collectionBookIds = new Set(booksInCollection.map(book => book._id))
        
        // Pre-select books that are already in the collection
        setSelectedBooks(booksInCollection.map(book => book._id))
      } catch (error) {
        console.error("Error fetching books:", error)
        toast.error("Something went wrong", {
          description: "Failed to load books. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [collectionId])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await addBooksToCollection(selectedBooks, collectionId)
      toast.success("Books updated", {
        description: "The collection has been updated with the selected books.",
      })
      router.push(`/collections/${collectionId}`)
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong", {
        description: "Failed to update the collection. Please try again later.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const toggleBook = (bookId: string) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId) 
        : [...prev, bookId]
    )
  }

  const isInCollection = (bookId: string) => {
    return collectionBooks.some(book => book._id === bookId)
  }

  const filteredBooks = books.filter(book => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      (book.isbn && book.isbn.toLowerCase().includes(query))
    )
  })

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
        <div className="h-10 w-full max-w-sm bg-muted/60 rounded animate-pulse"></div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card 
              key={i} 
              className="overflow-hidden animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="p-4 flex gap-3">
                <div className="h-5 w-5 rounded-sm bg-muted/60"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-muted/60 rounded"></div>
                  <div className="h-4 w-1/2 bg-muted/60 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search books..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="min-w-[100px]"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      
      {selectedBooks.length > 0 && (
        <div className="bg-muted/30 p-3 rounded-md border">
          <p className="text-sm font-medium flex items-center">
            <Check className="h-4 w-4 mr-1.5 text-primary" />
            {selectedBooks.length} {selectedBooks.length === 1 ? "book" : "books"} selected
          </p>
        </div>
      )}
      
      {filteredBooks.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">No books found matching your search.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => {
            const isSelected = selectedBooks.includes(book._id)
            const wasInCollection = isInCollection(book._id)
            
            return (
              <Card 
                key={book._id} 
                className={`overflow-hidden transition-all hover:shadow-sm ${
                  isSelected ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                <div className="p-4 flex gap-3">
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => toggleBook(book._id)}
                    id={`book-${book._id}`}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-sm bg-muted/30">
                        <Image
                          src={book.coverImage || "/book-placeholder.svg"}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <label 
                          htmlFor={`book-${book._id}`}
                          className="font-medium line-clamp-1 cursor-pointer hover:text-primary"
                        >
                          {book.title}
                        </label>
                        <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                        <div className="mt-1.5">
                          <Badge variant={getStatusBadgeVariant(book.status)} className="flex items-center text-xs h-5 px-1.5 inline-flex">
                            {getStatusIcon(book.status)}
                            <span className="text-xs">
                              {book.status === "in-progress" ? "Reading" : book.status === "completed" ? "Read" : "Unread"}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {wasInCollection && (
                      <div className="mt-2 text-xs text-muted-foreground flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Already in collection
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          size="lg"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
