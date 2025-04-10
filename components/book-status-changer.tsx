"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { BookX, BookOpen, BookMarked, ChevronDown, Loader2 } from "lucide-react"
import { updateBook } from "@/lib/actions"

interface BookStatusChangerProps {
  bookId: string
  currentStatus: string
}

export function BookStatusChanger({ bookId, currentStatus }: BookStatusChangerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return
    
    setIsLoading(true)
    try {
      await updateBook(bookId, { status: newStatus })
      
      toast.success("Status updated", {
        description: `Book marked as ${newStatus === "in-progress" ? "Reading" : newStatus === "completed" ? "Read" : "Unread"}`
      })
      
      router.refresh()
    } catch (error) {
      console.error("Error updating book status:", error)
      toast.error("Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unread":
        return <BookX className="h-4 w-4 mr-2" />
      case "in-progress":
        return <BookOpen className="h-4 w-4 mr-2" />
      case "completed":
        return <BookMarked className="h-4 w-4 mr-2" />
      default:
        return <BookX className="h-4 w-4 mr-2" />
    }
  }
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "unread":
        return "Unread"
      case "in-progress":
        return "Reading"
      case "completed":
        return "Read"
      default:
        return "Unread"
    }
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between" disabled={isLoading}>
          <div className="flex items-center">
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              getStatusIcon(currentStatus)
            )}
            <span>{getStatusLabel(currentStatus)}</span>
          </div>
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem 
          onClick={() => handleStatusChange("unread")}
          disabled={currentStatus === "unread" || isLoading}
          className="cursor-pointer"
        >
          <BookX className="h-4 w-4 mr-2" />
          <span>Mark as Unread</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusChange("in-progress")}
          disabled={currentStatus === "in-progress" || isLoading}
          className="cursor-pointer"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          <span>Mark as Reading</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusChange("completed")}
          disabled={currentStatus === "completed" || isLoading}
          className="cursor-pointer"
        >
          <BookMarked className="h-4 w-4 mr-2" />
          <span>Mark as Read</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
