'use client';
import * as z from'zod'

import Modal from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '../ui/button';
import { useState } from 'react';
import axios from 'axios';

const formSchema = z.object({
  name:z.string().min(1,{ message : '스토어 이름을 입력해주세요.'})
})

const CreateStoreModal = () => {
  const {isOpen,onClose, onOpen} = useStoreModal();
  const [ loading, setLoading ] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
      name:""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await axios.post(`/api/stores`, values);

      // the reason not using router from next navigation:
      // window.location.assign() is going to completely refresh page 
      // meaning that this store i just created after refresh  is going to 100% loaded in the database
      // but if i use router from next navigation, at least my case, what happen was is database is simply not ready, data not sync.
      // and the modal to create store opened on the dashboard page. 
      window.location.assign(`/${response.data.id}`);
      
    } catch (error) {
      console.log(error); 
      toast.error('스토어를 생성 할수 없습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      title="스토어를 만들어 주세요"
      description="상품 및 카테고리를 관리하기 위해서 새로운 상점을 만들어 보세요."
      isOpen={isOpen}
      onClose={onClose}
      >
        <div className='space-y-2 py-2 pb-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField 
                control={form.control}
                name='name'
                render={({field}) => (
                  <FormItem>
                    <FormLabel>스토어 이름</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder='E-commerce' {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='mt-4 flex justify-end'>
                <Button variant='outline' onClick={onClose} disabled={loading}>취소</Button>
                <Button type='submit' disabled={loading}>확인</Button>
              </div>
            </form>
          </Form>
        </div>
    </Modal>
  )
}

export default CreateStoreModal