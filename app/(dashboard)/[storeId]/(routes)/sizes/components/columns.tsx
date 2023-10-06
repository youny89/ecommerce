"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SizeColumn = {
  id: string
  name: string
  value: string
  createdAt: string
}

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "사이즈명",
  },
  {
    accessorKey: "value",
    header: "사이즈 값",
  },
  {
    accessorKey: "createdAt",
    header: "날짜",
  },
  {
    id:"actions",
    cell: ({row})=> <CellAction data={row.original}/>
  } 
]
