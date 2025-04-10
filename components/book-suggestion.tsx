"use client"

import { useState, useEffect } from "react"
import type { Book } from "@/types/book"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { getBooks } from "@/lib/actions"

export function BookSuggestion() {
  const [books, setBooks] = useState<Book[]>([])
  const [suggestion, setSuggestion] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks({ status: "unread" })
        setBooks(data)
        
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length)
          setSuggestion(data[randomIndex])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBooks()
  }, [])
  
  const getNewSuggestion = () => {
    if (books.length > 0) {
      const randomIndex = Math.floor(Math.random() * books.length)
      setSuggestion(books[randomIndex])
    }
  }
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>What to Read Next?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <div className="w-full h-40 bg-muted/50 animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    )
  }
  
  if (books.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>What to Read Next?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-center text-muted-foreground">
            You don't have any unread books in your library.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/books/add">Add Books</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>What to Read Next?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-4">
        {suggestion && (
          <div className="flex flex-col items-center text-center">
            <div className="relative h-40 w-28 mb-4">
              <Image
                src={suggestion.coverImage || "/placeholder.svg?height=160&width=112"}
                alt={suggestion.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <h3 className="font-medium">{suggestion.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{suggestion.author}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={getNewSuggestion}>
                Try Another
              </Button>
              <Button size="sm" asChild>
                <Link href={`/books/${suggestion._id}`}>
                  View Book <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          )}
      </CardContent>
    </Card>
  )
}
