"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Book } from "@/types/book"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getBooks } from "@/lib/actions"

export function RecentlyAddedBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Use the server action instead of the API route
        const data = await getBooks({ limit: 5 })
        setBooks(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recently Added</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-12 w-8 bg-muted rounded"></div>
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-24 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Added</CardTitle>
      </CardHeader>
      <CardContent>
        {books.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No books added yet</p>
            <Button className="mt-2" asChild>
              <Link href="/books/add">Add Your First Book</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <Link
                key={book._id}
                href={`/books/${book._id}`}
                className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors"
              >
                <div className="relative h-12 w-8 overflow-hidden rounded-sm">
                  <Image
                    src={book.coverImage || "/placeholder.svg?height=48&width=32"}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium line-clamp-1">{book.title}</h4>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                </div>
              </Link>
            ))}

            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/books">View All Books</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
