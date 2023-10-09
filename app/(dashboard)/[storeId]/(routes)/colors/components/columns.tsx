"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellActions from "./cell-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
  id: string
  name: string
  value: string
  createdAt: string
}

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "색상 이름",
  },
  {
    accessorKey: "value",
    header: "색상 값",
  },
  {
    accessorKey: "createdAt",
    header: "날짜",
  },
  {
    id:"actions",
    cell: ({row})=> <CellActions data={row.original}/>
  } 
]
