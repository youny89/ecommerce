"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumn = {
    id: string
    label: string
    createdAt: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "라벨",
  },
  {
    accessorKey: "createdAt",
    header: "날짜",
  },
  {
    id: "actions",
    cell:({row})=> <CellAction data={row.original}/> // this is how we can access original object. and that object is BillboardColumn!
  },
]
