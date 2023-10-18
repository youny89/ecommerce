'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Heading } from "@/components/ui/Heading"
import { Billboard, Category } from "@prisma/client"
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CategoryFormProps {
    initialData: Category | null
    billboards: Billboard[]
}

const formSchema = z.object({
    name:z.string().min(1),
    billboardId:z.string().min(1)
})

type CategoryFormValus = z.infer<typeof formSchema> 

const CategoryForm = ({ initialData,billboards }: CategoryFormProps ) => {
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const form = useForm<CategoryFormValus>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name:"",
            billboardId:""
        }
    });

    const title = initialData ? '카테고리 수정' : '카테고리 만들기'
    const description = initialData ? '카테고리를 수정하세요' : '새로운 카테고리 추가 하세요.'
    const toastMessage = initialData ? '카테고리 수정 완료':'카테고리 추가 완료'
    const action = initialData ? '업데이트':'만들기'

    const onSubmit = async (values: CategoryFormValus) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/categories`, values);
            }

            router.refresh();
            router.push(`/${params.storeId}/categories`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error('서버에러')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>  
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description}/>
                {initialData && (
                    <Button
                        variant='destructive'
                        size='icon'
                        disabled={loading}
                        onClick={()=> {}}
                    >
                        <Trash className='h-4 w-4'/>
                    </Button>
                )}
            </div>
            <Separator />
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
                    <div className='md:grid md:grid-cols-3 gap-8'>

                        <FormField 
                            control={form.control}
                            name='name'
                            render={({field})=> (
                                <FormItem>
                                    <FormLabel>카테고리 이름</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder='카테고리 이름을 입력해주세요'
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name='billboardId'
                            render={({field})=> (
                                <FormItem>
                                    <FormLabel>빌보드</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="빌보드를 선택해주세요"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards?.map(billboard=>(
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <Button type='submit' disabled={loading} className='ml-auto'>{action}</Button>
                </form>
            </Form>
        </>
    )
}

export default CategoryForm