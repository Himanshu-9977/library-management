import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectToDatabase } from "@/lib/mongodb"
import Book from "@/models/book"

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!) : undefined

    await connectToDatabase()

    const filter = { userId }
    let booksQuery = Book.find(filter).sort({ createdAt: -1 })

    if (limit) {
      booksQuery = booksQuery.limit(limit)
    }

    const books = await booksQuery.exec()
    return NextResponse.json(JSON.parse(JSON.stringify(books)))
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}
