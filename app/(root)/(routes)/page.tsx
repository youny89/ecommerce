'use client';

import { useStoreModal } from "@/hooks/use-store-modal"
import { useEffect } from "react";


// i only want to use this setup page to trigger modal.
const SetUpPage = () => {
    const { onOpen, isOpen } = useStoreModal();

    useEffect(()=>{
        if(!isOpen) onOpen();
    },[isOpen, onOpen])

    return null;
}

export default SetUpPage

