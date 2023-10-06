'use client'

import { Heading } from '@/components/ui/Heading'
import ApiList from '@/components/ui/api-list'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { CategoryColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'

interface CategoryClientProps {
    data: CategoryColumn[]
}

const CategoryClient = ({data}: CategoryClientProps) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`카테고리 (${data?.length} 개)`} description='카테고리를 추가/수정/삭제 관리 하세요.'/>
                <Button onClick={()=> router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className='mr-2 h-4 w-4'/>
                    추가하기
                </Button>
            </div>
            <Separator />

            <DataTable columns={columns} data={data} searchKey='name'/>

            <Separator />

            <Heading title='API' description='카테고리 API'/>
            <ApiList entityName='categories' entityIdName='categoryId'/>
        </>
    )
}

export default CategoryClient