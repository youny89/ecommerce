'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CategoryColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast, { ToastBar } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { AlertModal } from "@/components/modals/alert-modal"
import axios from "axios"

interface CellActionProps {
    data: CategoryColumn
}

const CellAction:React.FC<CellActionProps> = ({data}) => {
    const params = useParams();
    const router = useRouter();

    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(data.id);
        toast.success('카테고리 ID 복사 완료.');
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/categories/${data.id}`);

            router.refresh();
            toast.success('카테고리 삭제 완료');
            router.push(`/${params.storeId}/categories`);
        } catch (error) {
            toast.error('카테고리를 삭제 할수 없습니다');
        } finally {
            setLoading(false)
            setOpenAlert(false);
        }
    }


    return (
        <>
            <AlertModal onConfirm={onDelete} isOpen={openAlert} loading={loading} onClose={()=> setOpenAlert(false)}/>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>액션</DropdownMenuLabel>
                    <DropdownMenuItem onClick={onCopy}>
                        <Copy className="h-4 w-4 mr-2"/>
                        카테고리 ID 복사
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/categories/${data.id}`)}>
                        <Edit className="h-4 w-4 mr-2"/>
                        수정
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> setOpenAlert(true)}>
                        <Trash className="h-4 w-4 mr-2"/>
                        삭제
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CellAction