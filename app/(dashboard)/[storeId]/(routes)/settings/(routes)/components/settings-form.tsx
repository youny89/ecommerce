'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Store } from "@prisma/client"
import { Trash } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios from 'axios'

interface SettingFormProps {
    initialData: Store
}

const formSchema = z.object({
    name: z.string().min(1)
})

type SettingFormValues = z.infer<typeof formSchema>;

const SettingsForm = ({ initialData }: SettingFormProps) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<SettingFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:initialData
    })

    const onSubmit = async (values: SettingFormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, values);

            router.refresh();
            toast.success('업데이트 완료.')
        } catch (error) {
            toast.error('서버 이름을 수정 할수 없습니다.')
        }finally {
            setLoading(false)
        }
    }

    return (<>
        <div className="flex items-center justify-between">
            <Heading 
                title="설정"
                description="스토어를 설정을 관라 하세요."
            />
            <Button
                variant='destructive'
                size="icon"
                disabled={loading}
                onClick={()=> setOpen(true)}
            >
                <Trash className="h-4 w-4"/>
            </Button>

        </div>
        <Separator />

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                <div className='grid grid-cols-3 gap-8'>
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>스토어 이름</FormLabel>
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
                <Button type='submit' disabled={loading} className='ml-auto'>수정하기</Button>
            </form>
        </Form>
    </>)
}

export default SettingsForm