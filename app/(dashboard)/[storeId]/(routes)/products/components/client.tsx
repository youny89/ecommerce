'use client'

import { Heading } from "@/components/ui/Heading"
import ApiList from "@/components/ui/api-list"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { ProductColumn, columns } from "./columns"
import { useParams, useRouter } from "next/navigation"

interface ProductsClientProps {
    data: ProductColumn[]
}

const ProductsClient:React.FC<ProductsClientProps> = ({data}) => {

    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`상품 (0개)`} description="상품을 추가/수정/삭제 관리하세요"/>
                <Button onClick={()=> router.push(`/${params.storeId}/products/new`)}>
                    <Plus className="h-4 w-4 mr-2"/>
                    상품 추가하기
                </Button>
            </div>
            <DataTable columns={columns} data={data} searchKey="name"/>
            <Separator />
            <Heading title="API" description="상품 API"/>
            <ApiList entityName="products" entityIdName="productId"/>
        </>
    )
}

export default ProductsClient