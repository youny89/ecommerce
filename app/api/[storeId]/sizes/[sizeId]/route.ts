import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params : { storeId: string, sizeId: string}}
) {
    try {
        if(!params.storeId) return new NextResponse('Store ID is missing',{status:400})
        if(!params.sizeId) return new NextResponse('Size ID is missing',{status:400})

        const size = await prismadb.size.findFirst({
            where : { id: params.sizeId, storeId: params.storeId}
        })

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_ID_GET]', error);
        return new NextResponse('Internal Error', {status:500});
    }
}

export async function PATCH (
    req:Request,
    { params } : { params : { storeId: string, sizeId: string}}
) {
    try {
        const { userId } = auth();
        const { name, value } = await req.json();

        if(!userId) return new NextResponse('Unauthenticated', {status:401});
        if(!name) return new NextResponse('Name field is missing', {status:400});
        if(!value) return new NextResponse('Value field is missing', {status:400});
        if(!params.storeId) return new NextResponse('Store ID is missing',{status:400})
        if(!params.sizeId) return new NextResponse('Size ID is missing',{status:400})

        const storeByUserID = await prismadb.store.findFirst({
            where: { id: params.storeId, userId }
        });
        if(!storeByUserID) return new NextResponse('Unauthorized', {status: 4003});


        const sizes = await prismadb.size.updateMany({
            where: { id: params.sizeId, storeId: params.storeId },
            data : { name, value }
        })

        return NextResponse.json(sizes);
    } catch (error) {
        console.log('[SIZE_ID_PATCH]', error)
        return new NextResponse('Internal Error', { status:500});
    }
}

export async function DELETE (
    req: Request,
    { params } : { params : { storeId: string, sizeId: string}}
) {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse('Unauthenticated',{status:401});
        if(!params.storeId) return new NextResponse('Store ID is missing',{status:400});
        if(!params.sizeId) return new NextResponse('Size ID is missing',{status:400});

        const storeByUserId = await prismadb.store.findFirst({ 
            where : { id: params.storeId, userId}
        })
        if(!storeByUserId) return new NextResponse('Unauthorized',{status:403});

        const sizes = await prismadb.size.deleteMany({
            where : { id : params.sizeId, storeId : params.storeId }
        })

        return NextResponse.json(sizes);
    } catch (error) {
        console.log('[STORE_ID_DELETE]',error);
        return new NextResponse('Internal Error', {status:500});
    }
}