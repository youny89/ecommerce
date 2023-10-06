'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SizeColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { AlertModal } from "@/components/modals/alert-modal"
import axios from "axios"

interface CellActionProps {
    data: SizeColumn
}

const CellAction = ({data}:CellActionProps) => {
    const params = useParams()
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAleret] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(data.id);
        toast.success('사이즈 ID 복사 완료');
    }

    const onDelete = async () => {
        try {
            await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);

            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success('사이즈 삭제 완료.');
        } catch (error) {
            toast.error('해당 사이즈를 삭제 못했습니다.')
        } finally {
            setLoading(false)
            setOpenAleret(false)
        }
    }

    return (
        <>
            <AlertModal isOpen={openAlert} loading={loading} onClose={()=> setOpenAleret(false)} onConfirm={onDelete}/>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost'>
                        <span className="sr-only">open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>액션</DropdownMenuLabel>
                    <DropdownMenuItem onClick={onCopy}>
                        <Copy className="h-4 w-4 mr-2"/>
                        사이즈 ID 복사
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/sizes/${data.id}`)}>
                        <Edit className="h-4 w-4 mr-2"/>
                        수정
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> setOpenAleret(true)}>
                        <Trash className="h-4 w-4 mr-2"/>
                        삭제
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CellAction