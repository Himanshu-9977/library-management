export interface Loan {
  _id: string
  userId: string
  bookId: string | Book
  borrowerName: string
  borrowerEmail?: string
  loanDate: Date
  dueDate: Date
  returnedDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

import type { Book } from "./book"
