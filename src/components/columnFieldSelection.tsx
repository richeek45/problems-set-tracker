"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { ListFilter  } from "lucide-react";

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]



export function ColumnFieldSelection({
  columnFilterSelection, setColumnFilterSelection
} : {
  columnFilterSelection: string, setColumnFilterSelection: (val: string) => void
}) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter by <ListFilter /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={columnFilterSelection === "url"}
          onCheckedChange={() => setColumnFilterSelection("url")}
        >
          Title
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columnFilterSelection === "tags"}
          onCheckedChange={() => setColumnFilterSelection("tags")}
        >
          Tags
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columnFilterSelection === "difficulty"}
          onCheckedChange={() => setColumnFilterSelection("difficulty")}
        >
          Difficulty
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columnFilterSelection === "attempts"}
          onCheckedChange={() => setColumnFilterSelection("attempts")}
        >
          Attempts
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}