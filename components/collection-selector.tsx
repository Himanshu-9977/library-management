"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { getCollections } from "@/lib/actions"
import { CreateCollectionDialog } from "@/components/create-collection-dialog"
import type { Collection } from "@/types/collection"

interface CollectionSelectorProps {
  selectedCollections: string[]
  onChange: (collections: string[]) => void
}

export function CollectionSelector({ selectedCollections, onChange }: CollectionSelectorProps) {
  const [open, setOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections()
        setCollections(data)
      } catch (error) {
        console.error("Error fetching collections:", error)
        toast.error("Failed to load collections")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  const toggleCollection = (collectionId: string) => {
    if (selectedCollections.includes(collectionId)) {
      onChange(selectedCollections.filter(id => id !== collectionId))
    } else {
      onChange([...selectedCollections, collectionId])
    }
  }

  const handleCreateSuccess = (newCollection: Collection) => {
    setCollections(prev => [...prev, newCollection])
    onChange([...selectedCollections, newCollection._id])
    toast.success("Collection created and selected")
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedCollections.length > 0 ? (
          collections
            .filter(collection => selectedCollections.includes(collection._id))
            .map(collection => (
              <Badge
                key={collection._id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: collection.color }}
                />
                {collection.name}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1"
                  onClick={() => toggleCollection(collection._id)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {collection.name}</span>
                </button>
              </Badge>
            ))
        ) : (
          <div className="text-sm text-muted-foreground">No collections selected</div>
        )}
      </div>

      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full"
              disabled={isLoading}
            >
              {isLoading ? "Loading collections..." : "Select collections"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]">
            <Command>
              <CommandInput placeholder="Search collections..." />
              <CommandList>
                <CommandEmpty>No collections found.</CommandEmpty>
                <CommandGroup>
                  {collections.map((collection) => (
                    <CommandItem
                      key={collection._id}
                      value={collection._id}
                      onSelect={() => toggleCollection(collection._id)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: collection.color }}
                        />
                        <span>{collection.name}</span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedCollections.includes(collection._id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CreateCollectionDialog onSuccess={handleCreateSuccess}>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Collection
                    </Button>
                  </CreateCollectionDialog>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
