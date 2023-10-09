'use client';


import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Color } from "@prisma/client";
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';

interface ColorFormProps {
    initialData : Color | null
}

const formSchema = z.object({
    name:z.string().min(1,{ message:"색상 이름을 입력해주세요"}),
    value:z.string().min(1,{ message:"색상 값을 입력해주세요"}),
})

const ColorForm:React.FC<ColorFormProps> = ({initialData}) => {
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);

    const title = initialData ? '색상 수정':'색상 추가'
    const description = initialData ? '색상을 수정 하세요':'새로운 색상 추가하세요'
    const actionText = initialData ? '수정하기':'추가하기'
    const toastMessage = initialData ? '색상 수정 완료':'색상 추가 완료'

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:initialData || {
            name:"",
            value:""
        }
    })


    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values) 
            } else {
                await axios.post(`/api/${params.storeId}/colors`, values) 
            }

            router.refresh()
            router.push(`/${params.storeId}/colors`);
            toast.success(toastMessage);

        } catch (error) {
            toast.error('서버 에러')
        } finally {
            setLoading(false)
        }
    }

    const onConfirm = async () => {
        try {
            await axios.delete(`/api/${params.storeId}/colors/${initialData?.id}`)
            router.refresh()
            toast.success('색상 삭제 완료')
            router.push(`/${params.storeId}/colors`);
        } catch (error) {
            toast.error('서버 에러')
        } finally{
            setLoading(false)
            setAlertOpen(false)
        }
    }

    return (
        <>  
            <AlertModal isOpen={alertOpen} loading={loading} onClose={()=>setAlertOpen(false)} onConfirm={onConfirm}/>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description}/>
                {initialData && (
                    <Button
                        variant='destructive'
                        size='icon'
                        disabled={loading}
                        onClick={()=> setAlertOpen(true)}
                    >
                        <Trash className="w-4 h-4"/>
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
                    <div className='md:grid md:grid-cols-3 gap-8'>
                        {/* Color Name */}
                            <FormField 
                                control={form.control}
                                name='name'
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>색상 이름</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='색상 이름을 입력 해주세요'
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        {/* Color Value */}
                        <FormField 
                                control={form.control}
                                name='value'
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>색상 값</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='색상 값을 입력 해주세요'
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                    </div>
                    <Button type="submit" disabled={loading}>{actionText}</Button>
                </form>
            </Form>
        </>
    )
}

export default ColorForm