import { useEffect, useState } from "react"

export const useOrigin = () => {
    const [mountd, setMounted] = useState(false)

    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin:'';


    useEffect(() => {
        setMounted(true)
    },[])

    if(!mountd) return '';

    return origin;
}