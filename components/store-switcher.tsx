'use client';

import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import { Store } from "@prisma/client"

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { useStoreModal } from '@/hooks/use-store-modal';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps{
    items: Store[]
}

const StoreSwitcher = ({
    className,
    items=[]
}: StoreSwitcherProps ) => {
    const params = useParams()
    const router = useRouter()
    const { onOpen } = useStoreModal();

    const formattedItems = items.map(item=>({
        label:item.name,
        value: item.id
    }));

    const currentStore = formattedItems.find(item=> item.value === params.storeId);

    const [open, setOpen] = useState(false);

    const onStoreSelect = (store:{value: string, label:string}) => {
        setOpen(true);
        router.push(`/${store.value}`)
    }

    const onCreateStoreSelect = () => {
        setOpen(false)
        onOpen();
    }


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    size="sm"
                    role='combobox'
                    aria-expanded={open}
                    aria-label="스토어를 선택하세요."
                    className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon className='mr-2 h-4 w-4'/>
                    {currentStore?.label}
                    <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandList>
                        <CommandInput placeholder='스토어 검색'/>
                        <CommandEmpty>스토어를 찾지 못했습니다.</CommandEmpty>
                        <CommandGroup heading="스토어">
                            {formattedItems.map(store=>(
                                <CommandItem
                                    key={store.value}
                                    onSelect={()=> onStoreSelect(store)}
                                    className='text-sm'
                                >
                                    <StoreIcon className='w-4 h-4 mr-2'/>
                                    {store.label}
                                    <Check className={cn(
                                        "ml-auto h-4 w-4",
                                        currentStore?.value === store.value ? 'opacity-100':'opacity-0'
                                    )}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={onCreateStoreSelect}
                            >   
                                <PlusCircle className='mr-2 h-5 w-5'/>
                                스토어 만들기
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default StoreSwitcher