"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Collection } from "@/types/collection"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createCollection, updateCollection } from "@/lib/actions"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().min(1, "Color is required"),
})

type FormValues = z.infer<typeof formSchema>

interface CreateCollectionDialogProps {
  children: React.ReactNode
  collection?: Collection
  onSuccess?: (collection: Collection) => void
}

export function CreateCollectionDialog({ children, collection, onSuccess }: CreateCollectionDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues: Partial<FormValues> = {
    name: collection?.name || "",
    description: collection?.description || "",
    color: collection?.color || "#6366f1",
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)

    try {
      if (collection) {
        // Update existing collection
        const updatedCollection = await updateCollection(collection._id, data)
        toast.success("Collection updated", {
          description: "Your collection has been updated successfully.",
        })

        if (onSuccess) {
          onSuccess(updatedCollection)
        }
      } else {
        // Create new collection
        const newCollection = await createCollection(data)
        toast.success("Collection created", {
          description: "Your new collection has been created.",
        })

        if (onSuccess) {
          onSuccess(newCollection)
        }
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong", {
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{collection ? "Edit Collection" : "Create Collection"}</DialogTitle>
          <DialogDescription>
            {collection ? "Update your collection details." : "Create a new collection to organize your books."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Collection name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="color" {...field} className="w-12 h-8 p-1" />
                      <span className="text-sm text-muted-foreground">Choose a color for your collection</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : collection ? "Update Collection" : "Create Collection"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
