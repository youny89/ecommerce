'use client';

import { Heading } from "@/components/ui/Heading"
import ApiList from "@/components/ui/api-list";
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { SizeColumn, columns } from "./columns";


interface SizeClientProps {
    data: SizeColumn[]
}

const SizeClient:React.FC<SizeClientProps> = ({data}) => {
    const params = useParams()
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`사이즈 (${data.length} 개)`} description="사이즈를 추가/수정/삭제 관리하세요"/>
                <Button onClick={()=> router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className="w-4 h-4 mr-2"/>
                    사이즈 추가
                </Button>
            </div>
            <Separator />

            <DataTable columns={columns} data={data} searchKey="name"/>

            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId"/>
        </>
    )
}

export default SizeClient