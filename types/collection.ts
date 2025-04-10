export interface Collection {
  _id: string
  userId: string
  name: string
  description?: string
  color: string
  createdAt: Date
  updatedAt: Date
}
