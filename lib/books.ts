import { connectToDatabase } from "@/lib/mongodb"
import Book from "@/models/book"

export async function getBookById(id: string) {
  try {
    await connectToDatabase()
    const book = await Book.findById(id)
    return book
  } catch (error) {
    console.error("Error fetching book by ID:", error)
    return null
  }
}
