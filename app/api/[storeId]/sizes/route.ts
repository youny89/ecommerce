// @route: /api/:storeId/sizes

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"


export async function GET (
    req: Request,
    { params } : { params : { storeId: string}}
) {
    try {
        if(!params.storeId) return new NextResponse('Store ID is missing',{status:400});
        const sizes = await prismadb.size.findMany({
            where : { storeId : params.storeId}
        });

        return NextResponse.json(sizes);
    } catch (error) {
        console.log('[SIZE_GET]', error)
        return new NextResponse('Internal Error',{ status: 500});
    }
}

export async function POST (
    req:Request,
    { params } :{ params: {storeId: string }}
) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const {name, value} = body;

        if(!userId) return new NextResponse('Unauthenticated',{status:401});
        if(!name) return new NextResponse('Name field is missing',{status:400});
        if(!value) return new NextResponse('Value field is missing',{status:400});
        if(!params.storeId) return new NextResponse('Store ID is missing',{status:500});

        const storeByUserId = await prismadb.store.findMany({
            where: { id: params.storeId, userId}
        });

        if(!storeByUserId) return new NextResponse('Unauthorized',{status:403});

        const size = await prismadb.size.create({
            data:{
                storeId: params.storeId,
                name,
                value,
            }
        })
        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_POST]',error)
        return new NextResponse('Internal Error',{status:500});
    }
}