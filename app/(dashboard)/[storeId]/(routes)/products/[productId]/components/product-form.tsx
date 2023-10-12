'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Category,
    Color,
    Image,
    Product,
    Size } from "@prisma/client"
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import ImageUpload from '@/components/image-upload';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import toast from 'react-hot-toast';
import axios from 'axios';

const formSchema = z.object({
    name:z.string().min(1,{message:"상품명을 입력해주세요"}),
    images:z.object({ url:z.string()}).array(),
    price:z.coerce.number().min(1,{ message:"상품 가격을 입력해주세요"}),
    colorId:z.string().min(1,{message:"색상을 선택해주세요"}),
    sizeId:z.string().min(1,{message:"사이즈를 선택해주세요"}),
    categoryId:z.string().min(1,{message:"카테고리를 선택해주세요"}),
    isFeatured:z.boolean().default(false).optional(),
    isArchived:z.boolean().default(false).optional(),
})

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[];
    colors:Color[];
    sizes:Size[]
}

const ProductForm:React.FC<ProductFormProps> = ({
    initialData,
    categories,
    colors,
    sizes
}) => {
    const params = useParams()
    const router = useRouter();

    const [ alertOpen, setAlertOpen] = useState(false)
    const [ loading, setLoading] = useState(false)

    const title = initialData ? '상품 수정':'상품 등록'
    const description = initialData ? '상품을 수정 하세요':'새로운 상품을 추가하세요'
    const toastMessage = initialData ? '상품 수정 완료':'상품 등록 완료'
    const actionText = initialData ? '수정하기':'추가하기'
    
    const defaultValues = initialData ? {
        ...initialData,
        price:parseInt(String(initialData.price))
    } : {
        name:'',
        images:[],
        price:0,
        categoryId:'',
        colorId:'',
        sizeId:'',
        isFeatured:false,
        isArchived:false
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
    })

    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`,values)
            }else {
                await axios.post(`/api/${params.storeId}/products`,values)
            }

            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error('서버 에러')
        } finally{
            setLoading(false)
        }
    }

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description}/>
                {initialData && (
                    <Button variant='destructive' size='icon'>
                        <Trash className='w-4 h-4'/>
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
                    <FormField 
                        control={form.control}
                        name='images'
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>상품 사진</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        value={field.value.map(image=>image.url)}
                                        disabled={loading}
                                        onChange={url => field.onChange([...field.value,{ url }])}
                                        onRemove={url => field.onChange([...field.value.filter(current=> current.url !== url)])}
                                    />          
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className='md:grid md:grid-cols-3 gap-8'>
                        {/* 상품 이름 */}
                        <FormField 
                            control={form.control}
                            name='name'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>상품명</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loading} placeholder='상품명을 입력해주세요'/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        
                        {/* 상품 가격 */}
                        <FormField 
                            control={form.control}
                            name='price'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>상품 가격</FormLabel>
                                    <FormControl>
                                        <Input type='number' {...field} disabled={loading} placeholder='상품 가격을 입력해주세요'/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* 카테고리 */}
                        <FormField 
                            control={form.control}
                            name='categoryId'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>카테고리</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="카테고리를 선택해주세요"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map(category=>(
                                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        
                        {/* 사이즈 */}
                        <FormField 
                            control={form.control}
                            name='sizeId'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>사이즈</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="사이즈를 선택해주세요"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map(size=>(
                                                <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        
                        
                        {/* 색상 */}
                        <FormField 
                            control={form.control}
                            name='colorId'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>색상</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="색상를 선택해주세요"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map(color=>(
                                                <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        
                        {/* isFeatured */}
                        <FormField 
                            control={form.control}
                            name="isFeatured"
                            render={({field})=>(
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>featured</FormLabel>
                                        <FormDescription>This product will appear the home page</FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        
                        <FormField 
                            control={form.control}
                            name="isArchived"
                            render={({field})=>(
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>Archived</FormLabel>
                                        <FormDescription>This product will not anywhere in the store</FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type='submit' disabled={loading} className='ml-auto'>{actionText}</Button>
                </form>
            </Form>
        </>
    )
}

export default ProductForm