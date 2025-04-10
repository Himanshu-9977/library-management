"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { getStats } from "@/lib/actions"

export function ReadingGoals() {
  const [goal, setGoal] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats to get completed books using the server action
        const statsData = await getStats()
        setCompleted(statsData.byStatus.completed || 0)

        // Fetch reading goal from localStorage
        const savedGoal = localStorage.getItem("readingGoal")
        setGoal(savedGoal ? Number.parseInt(savedGoal, 10) : 12) // Default to 12 books per year
      } catch (error) {
        console.error("Error fetching reading goals data:", error)
        toast.error("Failed to load reading goal data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSaveGoal = () => {
    const parsedGoal = Number.parseInt(newGoal, 10)

    if (isNaN(parsedGoal) || parsedGoal < 1) {
      toast.error("Invalid goal", {
        description: "Please enter a valid number greater than 0.",
      })
      return
    }

    setGoal(parsedGoal)
    localStorage.setItem("readingGoal", parsedGoal.toString())
    setIsDialogOpen(false)

    toast.success("Reading goal updated", {
      description: `Your goal has been set to ${parsedGoal} books.`,
    })
  }

  const progress = goal > 0 ? Math.min(Math.round((completed / goal) * 100), 100) : 0

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Reading Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-8 w-1/2 bg-muted rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reading Goal</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Reading Goal</DialogTitle>
              <DialogDescription>Set your reading goal for the year.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goal">Number of books</Label>
                <Input
                  id="goal"
                  type="number"
                  min="1"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder={goal.toString()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveGoal}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {completed} of {goal} books
          </span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      </CardContent>
    </Card>
  )
}
