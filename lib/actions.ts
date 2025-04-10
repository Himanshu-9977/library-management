"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import Book from "@/models/book"
import Loan from "@/models/loan"
import Collection from "@/models/collection"
import { auth } from "@clerk/nextjs/server"
import type { Book as BookType } from "@/types/book"
import type { Loan as LoanType } from "@/types/loan"
import type { Collection as CollectionType } from "@/types/collection"

// Book actions
export async function getBooks(params: {
  query?: string
  status?: string
  genre?: string
  collection?: string
  limit?: number
} = {}) {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()

    const { query, status, genre, collection, limit } = params || {}
    const filter: any = { userId }

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { isbn: { $regex: query, $options: "i" } },
      ]
    }

    if (status && status !== "all") {
      filter.status = status
    }

    if (genre && genre !== "all") {
      filter.genre = genre
    }

    if (collection && collection !== "all") {
      filter.collections = collection
    }

    let booksQuery = Book.find(filter).sort({ createdAt: -1 })

    if (limit) {
      booksQuery = booksQuery.limit(limit)
    }

    const books = await booksQuery.exec()

    return JSON.parse(JSON.stringify(books))
  } catch (error) {
    console.error("Error fetching books:", error)
    throw new Error("Failed to fetch books")
  }
}

export async function getBookById(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()
    const book = await Book.findOne({ _id: id, userId })

    if (!book) {
      throw new Error("Book not found")
    }

    return JSON.parse(JSON.stringify(book))
  } catch (error) {
    console.error("Error fetching book:", error)
    throw new Error("Failed to fetch book")
  }
}

export async function createBook(bookData: Partial<BookType>) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const newBook = new Book({
      ...bookData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await newBook.save()
    revalidatePath("/books")
    return JSON.parse(JSON.stringify(newBook))
  } catch (error) {
    console.error("Error creating book:", error)
    throw new Error("Failed to create book")
  }
}

export async function updateBook(id: string, bookData: Partial<BookType>) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const book = await Book.findOneAndUpdate({ _id: id, userId }, { ...bookData, updatedAt: new Date() }, { new: true })

    if (!book) {
      throw new Error("Book not found")
    }

    revalidatePath(`/books/${id}`)
    revalidatePath("/books")
    return JSON.parse(JSON.stringify(book))
  } catch (error) {
    console.error("Error updating book:", error)
    throw new Error("Failed to update book")
  }
}

export async function deleteBook(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const book = await Book.findOneAndDelete({ _id: id, userId })

    if (!book) {
      throw new Error("Book not found")
    }

    revalidatePath("/books")
    return { success: true }
  } catch (error) {
    console.error("Error deleting book:", error)
    throw new Error("Failed to delete book")
  }
}

// Loan actions
export async function getLoans() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const loans = await Loan.find({ userId }).populate("bookId").sort({ loanDate: -1 })
    return JSON.parse(JSON.stringify(loans))
  } catch (error) {
    console.error("Error fetching loans:", error)
    throw new Error("Failed to fetch loans")
  }
}

export async function createLoan(loanData: Partial<LoanType>) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const newLoan = new Loan({
      ...loanData,
      userId,
      loanDate: new Date(loanData.loanDate!),
      dueDate: new Date(loanData.dueDate!),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await newLoan.save()
    revalidatePath("/loans")
    return JSON.parse(JSON.stringify(newLoan))
  } catch (error) {
    console.error("Error creating loan:", error)
    throw new Error("Failed to create loan")
  }
}

export async function updateLoan(id: string, loanData: Partial<LoanType>) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const loan = await Loan.findOneAndUpdate({ _id: id, userId }, { ...loanData, updatedAt: new Date() }, { new: true })

    if (!loan) {
      throw new Error("Loan not found")
    }

    revalidatePath("/loans")
    return JSON.parse(JSON.stringify(loan))
  } catch (error) {
    console.error("Error updating loan:", error)
    throw new Error("Failed to update loan")
  }
}

export async function deleteLoan(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const loan = await Loan.findOneAndDelete({ _id: id, userId })

    if (!loan) {
      throw new Error("Loan not found")
    }

    revalidatePath("/loans")
    return { success: true }
  } catch (error) {
    console.error("Error deleting loan:", error)
    throw new Error("Failed to delete loan")
  }
}

// Collection actions
export async function getCollections() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const collections = await Collection.find({ userId }).sort({ name: 1 })
    return JSON.parse(JSON.stringify(collections))
  } catch (error) {
    console.error("Error fetching collections:", error)
    throw new Error("Failed to fetch collections")
  }
}

export async function getCollectionById(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const collection = await Collection.findOne({ _id: id, userId })
    if (!collection) throw new Error("Collection not found")

    return JSON.parse(JSON.stringify(collection))
  } catch (error) {
    console.error("Error fetching collection:", error)
    throw new Error("Failed to fetch collection")
  }
}

export async function getBooksByCollection(collectionId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    // Verify the collection exists and belongs to the user
    const collection = await Collection.findOne({ _id: collectionId, userId })
    if (!collection) throw new Error("Collection not found")

    // Find books that have this collection ID in their collections array
    const books = await Book.find({
      userId,
      collections: collectionId
    }).sort({ createdAt: -1 })

    return JSON.parse(JSON.stringify(books))
  } catch (error) {
    console.error("Error fetching books by collection:", error)
    throw new Error("Failed to fetch books in collection")
  }
}

export async function addBooksToCollection(bookIds: string[], collectionId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    // Verify the collection exists and belongs to the user
    const collection = await Collection.findOne({ _id: collectionId, userId })
    if (!collection) throw new Error("Collection not found")

    // First, remove all books from this collection
    await Book.updateMany(
      { userId, collections: collectionId },
      { $pull: { collections: collectionId } }
    )

    // Then add the selected books to the collection
    if (bookIds.length > 0) {
      await Book.updateMany(
        { userId, _id: { $in: bookIds } },
        { $addToSet: { collections: collectionId } }
      )
    }

    revalidatePath(`/collections/${collectionId}`)
    return { success: true }
  } catch (error) {
    console.error("Error adding books to collection:", error)
    throw new Error("Failed to add books to collection")
  }
}

export async function removeBookFromCollection(bookId: string, collectionId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    // Verify the collection exists and belongs to the user
    const collection = await Collection.findOne({ _id: collectionId, userId })
    if (!collection) throw new Error("Collection not found")

    // Remove this collection from the book
    await Book.updateOne(
      { _id: bookId, userId },
      { $pull: { collections: collectionId } }
    )

    revalidatePath(`/collections/${collectionId}`)
    return { success: true }
  } catch (error) {
    console.error("Error removing book from collection:", error)
    throw new Error("Failed to remove book from collection")
  }
}

export async function createCollection(collectionData: Partial<CollectionType>) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const newCollection = new Collection({
      ...collectionData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await newCollection.save()
    revalidatePath("/collections")
    return JSON.parse(JSON.stringify(newCollection))
  } catch (error) {
    console.error("Error creating collection:", error)
    throw new Error("Failed to create collection")
  }
}

export async function updateCollection(id: string, collectionData: Partial<CollectionType>) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const collection = await Collection.findOneAndUpdate(
      { _id: id, userId },
      { ...collectionData, updatedAt: new Date() },
      { new: true },
    )

    if (!collection) {
      throw new Error("Collection not found")
    }

    revalidatePath("/collections")
    return JSON.parse(JSON.stringify(collection))
  } catch (error) {
    console.error("Error updating collection:", error)
    throw new Error("Failed to update collection")
  }
}

export async function deleteCollection(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    const collection = await Collection.findOneAndDelete({ _id: id, userId })

    if (!collection) {
      throw new Error("Collection not found")
    }

    revalidatePath("/collections")
    return { success: true }
  } catch (error) {
    console.error("Error deleting collection:", error)
    throw new Error("Failed to delete collection")
  }
}

// Default books for new users
export async function addDefaultBooks() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    // Check if user already has books
    const existingBooks = await Book.countDocuments({ userId })
    if (existingBooks > 0) {
      return { success: true, message: "User already has books" }
    }

    // Default popular books to add
    const defaultBooks = [
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "fiction",
        status: "unread",
        publicationYear: 1960,
        coverImage: "https://covers.openlibrary.org/b/id/8810494-L.jpg",
      },
      {
        title: "1984",
        author: "George Orwell",
        genre: "fiction",
        status: "unread",
        publicationYear: 1949,
        coverImage: "https://covers.openlibrary.org/b/id/8575708-L.jpg",
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "fiction",
        status: "unread",
        publicationYear: 1925,
        coverImage: "https://covers.openlibrary.org/b/id/8432047-L.jpg",
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "fiction",
        status: "unread",
        publicationYear: 1813,
        coverImage: "https://covers.openlibrary.org/b/id/8479103-L.jpg",
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "fantasy",
        status: "unread",
        publicationYear: 1937,
        coverImage: "https://covers.openlibrary.org/b/id/8406786-L.jpg",
      },
    ]

    // Create books in the database
    const createdBooks = []
    for (const bookData of defaultBooks) {
      const newBook = new Book({
        ...bookData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      await newBook.save()
      createdBooks.push(newBook)
    }

    revalidatePath("/books")
    revalidatePath("/")

    return {
      success: true,
      message: `Added ${createdBooks.length} default books to your library`
    }
  } catch (error) {
    console.error("Error adding default books:", error)
    throw new Error("Failed to add default books")
  }
}

// Stats actions
export async function getStats() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connectToDatabase()

    // Get total books count
    const totalBooks = await Book.countDocuments({ userId })

    // Get books by status
    const unreadBooks = await Book.countDocuments({ userId, status: "unread" })
    const inProgressBooks = await Book.countDocuments({ userId, status: "in-progress" })
    const completedBooks = await Book.countDocuments({ userId, status: "completed" })

    // Get genre distribution
    const genreDistribution = await Book.aggregate([
      { $match: { userId } },
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // Get books read per month (current year)
    const currentYear = new Date().getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)
    const endOfYear = new Date(currentYear, 11, 31)

    const booksReadByMonth = await Book.aggregate([
      {
        $match: {
          userId,
          status: "completed",
          completedDate: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: { $month: "$completedDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Format the monthly data
    const monthlyData = Array(12).fill(0)
    booksReadByMonth.forEach((item: any) => {
      monthlyData[item._id - 1] = item.count
    })

    return {
      totalBooks,
      byStatus: {
        unread: unreadBooks,
        inProgress: inProgressBooks,
        completed: completedBooks,
      },
      genreDistribution,
      monthlyData,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    throw new Error("Failed to fetch stats")
  }
}
