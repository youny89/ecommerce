import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColorColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { useState } from "react"
import axios from "axios"

interface CellActionsProps {
    data : ColorColumn
}

const CellActions:React.FC<CellActionsProps> = ({data}) => {

    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(data.id);
        toast.success('색상 ID 복사 완료');
    }

    const onConfirm = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/colors/${data.id}`)

            router.refresh();
            router.push(`/${params.storeId}/colors`);
            toast.success('색상 삭제 완료');
        } catch (error) {
            toast.error('서버 에러')
        } finally{
            setLoading(false);
            setAlertOpen(false)
        }
    }

    return (
        <>  
            <AlertModal isOpen={alertOpen} loading={loading} onClose={()=> setAlertOpen(false)} onConfirm={onConfirm}/>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <span className="sr-only">open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>액션</DropdownMenuLabel>
                    <DropdownMenuItem onClick={onCopy}>
                        <Copy className="h-4 w-4 mr-2"/>
                        색상 ID 복사
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/colors/${data.id}`)}>
                        <Edit className="h-4 w-4 mr-2"/>
                        색상 수정
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> setAlertOpen(true)}>
                        <Trash className="h-4 w-4 mr-2"/>
                        색상  삭제
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CellActions