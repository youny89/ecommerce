'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Billboard } from "@prisma/client"
import { Trash } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios from 'axios'
import { AlertModal } from '@/components/modals/alert-modal'
import ImageUpload from '@/components/image-upload'

interface BillboardFormProps {
    initialData: Billboard | null
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl:z.string().min(1)
})

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:initialData || {
            label:'',
            imageUrl:''
        }
    })


    const title = initialData ? '빌보드 수정':'빌보드 만들기';
    const description = initialData ? '빌보드를 수정하세요':'새로운 빌보드를 만드세요.';
    const toastMessage = initialData ? '빌보드 수정 완료.':'빌보드 생성 완료.';
    const action = initialData ? '업데이트.':'빌보드 만들기.';


    const onSubmit = async (values: BillboardFormValues) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, values);
            }

            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success(toastMessage)
        } catch (error) {
            toast.error('서버 에러')
        }finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push(`/${params.storeId}/billboards`);
            toast.success('빌보드 삭제 완료.')
        } catch (error) {
            toast.error('현재 빌보드에서 사용 중인 카테고리를 삭제 해주세요 .')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (<>
        <AlertModal isOpen={open} loading={loading} onClose={()=> setOpen(false)} onConfirm={onDelete}/>
        <div className="flex items-center justify-between">
            <Heading 
                title={title}
                description={description}
            />
            {initialData && (
                <Button
                    variant='destructive'
                    size="icon"
                    disabled={loading}
                    onClick={()=> setOpen(true)}
                >
                    <Trash className="h-4 w-4"/>
                </Button>
            )}

        </div>
        <Separator />

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                <FormField 
                    control={form.control}
                    name="imageUrl"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Backgroup Image</FormLabel>
                            <FormControl>
                                <ImageUpload 
                                    value={field.value? [field.value]: []}
                                    disabled={loading}
                                    onChange={url=> field.onChange(url)}
                                    onRemove={()=> field.onChange("")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='grid grid-cols-3 gap-8'>
                    <FormField 
                        control={form.control}
                        name="label"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>레이블</FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={loading}
                                        placeholder='스토어 이름을 입력해주세요'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type='submit' disabled={loading} className='ml-auto'>{action}</Button>
            </form>
        </Form>
        <Separator />
    </>)
}

export default BillboardForm