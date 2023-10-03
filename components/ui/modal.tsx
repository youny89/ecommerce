import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./button";

interface ModalProps {
    title: string;
    description?: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode
}

const Modal = ({
    title,
    description,
    isOpen,
    onClose,
    children
}: ModalProps) => {
    
    const onChange = (open: boolean) => {
        if(!open) onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent className="pt-8">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">{title}</DialogTitle>
                    <DialogDescription className="text-center">{description}</DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
                {/* <DialogFooter>
                    <Button variant="outline" onClick={onClose}>취소</Button>
                    <Button type="submit">확인</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}

export default Modal