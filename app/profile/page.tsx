import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { LogOut, Settings, User } from "lucide-react"

export default async function ProfilePage() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Profile" subheading="Manage your account settings" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt={user.firstName || "User"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <UserButton afterSignOutUrl="/sign-in" />
              <Button variant="outline" size="sm" className="gap-1">
                <Settings className="h-4 w-4 mr-1" />
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Library Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Total Books</div>
                <div className="text-2xl font-bold">--</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Books Read</div>
                <div className="text-2xl font-bold">--</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Active Loans</div>
                <div className="text-2xl font-bold">--</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Collections</div>
                <div className="text-2xl font-bold">--</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
