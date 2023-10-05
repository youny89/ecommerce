'use client'

import { Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { BillboardColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface BillboardClientProps {
    data: BillboardColumn[]
}

export const BillboardClient:React.FC<BillboardClientProps> = ({ data }) => {
    const router = useRouter()
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`billboards (${data?.length})`} description="스토어 빌보드를 관리하세요"/>
                <Button onClick={()=> router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    추가하기
                </Button>
            </div>
            <Separator/>

            <DataTable columns={columns} data={data} searchKey="label"/>
        </>
    )
}