export interface Book {
  _id: string
  userId: string
  title: string
  author: string
  isbn?: string
  genre: string
  publicationYear?: number
  coverImage?: string
  status: "unread" | "in-progress" | "completed"
  rating?: number
  notes?: string
  collections?: string[]
  completedDate?: Date
  createdAt: Date
  updatedAt: Date
}
