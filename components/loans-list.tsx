"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import type { Loan } from "@/types/loan"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Check, Clock, Mail } from "lucide-react"
import Link from "next/link"
import { getLoans, updateLoan } from "@/lib/actions"
import { LoansListSkeleton } from "@/components/skeletons"

export function LoansList() {
  const router = useRouter()
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getLoans()
        setLoans(data)
      } catch (error) {
        console.error(error)
        setError("Failed to load loans. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoans()
  }, [])

  const handleMarkAsReturned = async (id: string) => {
    try {
      await updateLoan(id, { returnedDate: new Date() })

      setLoans(loans.map((loan) => (loan._id === id ? { ...loan, returnedDate: new Date() } : loan)))

      toast.success("Book marked as returned", {
        description: "The loan has been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong", {
        description: "Failed to update the loan. Please try again later.",
      })
    }
  }

  const isOverdue = (dueDate: Date) => {
    return new Date(dueDate) < new Date()
  }

  if (isLoading) {
    return <LoansListSkeleton />
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-medium">No active loans</h3>
        <p className="text-muted-foreground">You haven't loaned any books yet.</p>
        <Button className="mt-4" asChild>
          <Link href="/loans/add">Create Your First Loan</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {loans.map((loan) => {
        const book = typeof loan.bookId === "object" ? loan.bookId : { title: "Unknown Book" }
        const isLoanOverdue = isOverdue(loan.dueDate)
        const isReturned = !!loan.returnedDate

        return (
          <Card key={loan._id} className={isLoanOverdue && !isReturned ? "border-destructive" : ""}>
            <CardHeader>
              <CardTitle className="line-clamp-1">{book.title}</CardTitle>
              <CardDescription>Loaned to {loan.borrowerName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Loan Date</p>
                  <p>{format(new Date(loan.loanDate), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p>{format(new Date(loan.dueDate), "MMM d, yyyy")}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {isReturned ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" /> Returned
                  </Badge>
                ) : isLoanOverdue ? (
                  <Badge variant="destructive">
                    <Clock className="mr-1 h-3 w-3" /> Overdue
                  </Badge>
                ) : (
                  <Badge variant="secondary">Active</Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!isReturned && (
                <Button variant="outline" size="sm" onClick={() => handleMarkAsReturned(loan._id)}>
                  Mark as Returned
                </Button>
              )}
              {loan.borrowerEmail && !isReturned && (
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={`mailto:${loan.borrowerEmail}?subject=Book%20Return%20Reminder&body=Hi%20${loan.borrowerName},%0A%0AThis%20is%20a%20friendly%20reminder%20that%20the%20book%20"${book.title}"%20is%20due%20on%20${format(new Date(loan.dueDate), "MMMM%20d,%20yyyy")}.%0A%0AThanks!`}
                  >
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Send reminder email</span>
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
