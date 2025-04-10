export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-muted/30 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export function BooksListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-[320px] rounded-lg bg-muted/30 animate-pulse" />
      ))}
    </div>
  )
}

export function BookDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-1/3 rounded-lg bg-muted/30 animate-pulse" />
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="h-[450px] rounded-lg bg-muted/30 animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded-lg bg-muted/30 animate-pulse" />
          <div className="h-6 w-1/2 rounded-lg bg-muted/30 animate-pulse" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-16 rounded-lg bg-muted/30 animate-pulse" />
            <div className="h-16 rounded-lg bg-muted/30 animate-pulse" />
          </div>
          <div className="h-32 rounded-lg bg-muted/30 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-24 rounded-lg bg-muted/30 animate-pulse" />
            <div className="h-10 w-24 rounded-lg bg-muted/30 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function BookFormSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 animate-pulse">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-1/4 rounded-lg bg-muted/50" />
              <div className="h-10 rounded-lg bg-muted/30" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-5 w-1/4 rounded-lg bg-muted/50" />
          <div className="h-32 rounded-lg bg-muted/30" />
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-24 rounded-lg bg-muted/30" />
          <div className="h-10 w-24 rounded-lg bg-muted/30" />
        </div>
      </div>
    </div>
  )
}

export function LoansListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-[200px] rounded-lg bg-muted/30 animate-pulse" />
      ))}
    </div>
  )
}

export function CollectionsListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-[150px] rounded-lg bg-muted/30 animate-pulse" />
      ))}
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[300px] rounded-lg bg-muted/30 animate-pulse" />
        <div className="h-[300px] rounded-lg bg-muted/30 animate-pulse" />
      </div>
      <div className="h-[300px] rounded-lg bg-muted/30 animate-pulse" />
    </>
  )
}
