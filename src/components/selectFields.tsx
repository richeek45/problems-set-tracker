import * as React from "react"
 
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
 
export function SelectTopics() {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a topic" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="array">Array</SelectItem>
          <SelectItem value="linkedList">Linked List</SelectItem>
          <SelectItem value="string">String</SelectItem>
          <SelectItem value="tree">Tree</SelectItem>
          <SelectItem value="graph">Graph</SelectItem>
          <SelectItem value="dynamicProgramming">Dynamic Programming</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}