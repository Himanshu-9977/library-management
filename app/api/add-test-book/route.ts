import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/mongodb"
import Book from "@/models/book"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Check if test book already exists
    const existingBook = await Book.findOne({ 
      userId, 
      title: "Test Book",
      author: "Test Author" 
    })

    if (existingBook) {
      return NextResponse.json({ message: "Test book already exists", book: existingBook })
    }

    // Create a test book
    const newBook = new Book({
      userId,
      title: "Test Book",
      author: "Test Author",
      genre: "fiction",
      status: "unread",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await newBook.save()
    
    return NextResponse.json({ 
      message: "Test book created successfully", 
      book: newBook 
    })
  } catch (error) {
    console.error("Error creating test book:", error)
    return NextResponse.json({ error: "Failed to create test book" }, { status: 500 })
  }
}
