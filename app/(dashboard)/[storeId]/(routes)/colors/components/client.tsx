'use client';

import { Separator } from "@/components/ui/separator"
import { ColorColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import ApiList from "@/components/ui/api-list"
import { Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

interface ColorClilentProps {
    data : ColorColumn[]
}

const ColorClient:React.FC<ColorClilentProps> = ({data}) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`색상 (${data.length}개)`} description="색상을 추가/수정/삭제 관리 하세요"/>
                <Button onClick={()=> router.push(`/${params.storeId}/colors/new`)}>
                    <Plus className="w-4 h-4 mr-2"/>
                    색상 추가하기
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name"/>
            <Separator />
            <ApiList entityIdName="colorId" entityName="colors"/>
        </>
    )
}

export default ColorClient