"use client"

import { ColumnDef } from "@tanstack/react-table"
// import CellAction from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
    id: string
    name: string
    price: string
    isFeatured: boolean
    isArchived: boolean
    category:string
    color:string
    size:string
    createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "상품명",
  },
  {
    accessorKey: "price",
    header: "가격",
  },
  {
    accessorKey: "category",
    header: "카테고리",
  },
  {
    accessorKey: "size",
    header: "사이즈",
  },
  {
    accessorKey: "color",
    header: "색상",
    cell:({row})=>(
        <div className="flex">
            {/* {row.original.color} */}
            <div className="h-6 w-6 rounded-full border border-2" style={{backgroundColor:row.original.color}}></div>
        </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "날짜",
  },
//   {
//     id: "actions",
//     cell:({row})=> <CellAction data={row.original}/> // this is how we can access original object. and that object is BillboardColumn!
//   },
]
