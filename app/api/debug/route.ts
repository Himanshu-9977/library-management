import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/mongodb"
import Book from "@/models/book"
import mongoose from "mongoose"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check MongoDB connection
    let connectionStatus = "Not connected"
    try {
      await connectToDatabase()
      connectionStatus = "Connected"
    } catch (error) {
      connectionStatus = `Connection error: ${error.message}`
    }

    // Check if Book model is registered
    const modelNames = mongoose.modelNames()
    const bookModelRegistered = modelNames.includes("Book")

    // Count books for the user
    let bookCount = 0
    let books = []
    try {
      bookCount = await Book.countDocuments({ userId })
      books = await Book.find({ userId }).limit(5).lean()
    } catch (error) {
      return NextResponse.json({
        error: `Error counting books: ${error.message}`,
        connectionStatus,
        bookModelRegistered,
        modelNames
      }, { status: 500 })
    }

    return NextResponse.json({
      connectionStatus,
      bookModelRegistered,
      modelNames,
      bookCount,
      sampleBooks: books,
      userId
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
