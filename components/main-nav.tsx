'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";

const MainNav = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) => {
    const pathname = usePathname()
    const params = useParams()

    const routes = [
        {
            href:`/${params.storeId}`,
            label:"대시보드",
            active:pathname === `/${params.storeId}`
        },
        {
            href:`/${params.storeId}/billboards`,
            label:"빌보드",
            active:pathname === `/${params.storeId}/billboards`
        },
        {
            href:`/${params.storeId}/settings`,
            label:"설정",
            active:pathname === `/${params.storeId}/settings`
        },
    ];


    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {routes.map(route => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active ? "text-black dark:text-white": "text-muted-foreground"
                )}>
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}

export default MainNav