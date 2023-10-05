'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BillboardColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: BillboardColumn
}

const CellAction: React.FC<CellActionProps> = ({data}) => {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('ID 복사 완료.')
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
            router.refresh()
            toast.success('빌보드 삭제 완료.')
        } catch (error) {
            toast.error('현재 빌보드에서 사용 중인 카테고리를 삭제 해주세요 .')
        } finally {
            setOpen(false)
            setLoading(false)
        }
    }


    return ( <>
        <AlertModal isOpen={open} loading={loading} onClose={()=> setOpen(false)} onConfirm={onDelete}/>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 ">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>액션</DropdownMenuLabel>
                <DropdownMenuItem onClick={()=> onCopy(data.id)}>
                    <Copy className="h-4 w-4 mr-2"/>
                    ID 복사
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/billboards/${data.id}`)}>
                    <Edit className="h-4 w-4 mr-2"/>
                    수정
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> setOpen(true)}>
                    <Trash className="h-4 w-4 mr-2"/>
                    삭제
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
    )
}

export default CellAction