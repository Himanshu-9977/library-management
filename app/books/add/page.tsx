import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { BookForm } from "@/components/book-form"
import { PageHeader } from "@/components/page-header"

export default async function AddBookPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Add New Book" subheading="Add a new book to your collection" />
      <BookForm />
    </div>
  )
}
