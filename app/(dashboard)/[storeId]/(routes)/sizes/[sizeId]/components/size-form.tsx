/** 사이즈 추가 혹은 수정.
 * If there's data -> edit current size.
 * If there's No data -> create new size.
 */
'use client';

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';


interface SizeFormProps {
    initialData: Size | null
}

const formSchema = z.object({
    name:z.string().min(1,{ message:"사이즈명을 입력해주세요."}),
    value:z.string().min(1,{ message:"사이즈 값을 입력해주세요."}),
})



const SizeForm = ({initialData}: SizeFormProps) => {
    const params = useParams()
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name:"",
            value:""
        },
    })

    const title =  initialData ? '사이즈 수정' : '사이즈 추가'
    const description =  initialData ? '사이즈를 수정 해주세요.' : '새로운 사이즈을 추가하세요.'
    const actionText =  initialData ? '수정하기' : '추가하기'
    const toastMessage = initialData ? '사이즈 수정 완료':'사이즈 추가 완료';

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${initialData.id}`, values)
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, values);            
            }

            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success(toastMessage);
        } catch (error) {
            toast.error('서버 에러');
        } finally{
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);

            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success('사이즈 삭제 완료.');
        } catch (error) {
            toast.error('해당 사이즈를 삭제 못했습니다.')
        } finally {
            setLoading(false)
            setOpenAlert(false)
        }
    }

    return (
        <>  
            <AlertModal onConfirm={onDelete} isOpen={openAlert} loading={loading} onClose={()=> setOpenAlert(false)}/>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description}/>
                {initialData && (
                    <Button
                        variant="destructive"
                        size="icon"
                        disabled={loading}
                        onClick={()=> setOpenAlert(true)}
                    >
                        <Trash className="h-4 w-4"/>

                    </Button>
                )}
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
                    <div className='md:grid md:grid-cols-3 gap-8'>

                        {/* Size Name */}
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>사이즈 이름</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder='사이즈 이름을 입력해주세요'
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Size value  */}
                        <FormField 
                            control={form.control}
                            name="value"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>사이즈 값</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder='사이즈 값을 입력해주세요'
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type='submit' disabled={loading}>{actionText}</Button>
                </form>
            </Form>
        </>
    )
}

export default SizeForm