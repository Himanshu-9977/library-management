"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getStats } from "@/lib/actions"

interface ReadingStatsData {
  totalBooks: number
  byStatus: {
    unread: number
    inProgress: number
    completed: number
  }
}

export function ReadingStats() {
  const [stats, setStats] = useState<ReadingStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats()
        setStats(data)
      } catch (error) {
        console.error(error)
        setError("Failed to load reading stats")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Reading Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-1/4 bg-muted rounded"></div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reading Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const total = stats?.totalBooks || 0
  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Unread</span>
            <span className="text-sm text-muted-foreground">{getPercentage(stats?.byStatus.unread || 0)}%</span>
          </div>
          <Progress value={getPercentage(stats?.byStatus.unread || 0)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">In Progress</span>
            <span className="text-sm text-muted-foreground">{getPercentage(stats?.byStatus.inProgress || 0)}%</span>
          </div>
          <Progress value={getPercentage(stats?.byStatus.inProgress || 0)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Completed</span>
            <span className="text-sm text-muted-foreground">{getPercentage(stats?.byStatus.completed || 0)}%</span>
          </div>
          <Progress value={getPercentage(stats?.byStatus.completed || 0)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
