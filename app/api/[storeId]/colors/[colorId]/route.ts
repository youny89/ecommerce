import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params : { storeId: string, colorId: string}}
) { 

    try {

        if(!params.storeId) return new NextResponse('Store ID is missing',{status:400})
        if(!params.colorId) return new NextResponse('Color ID is missing',{status:400})


        const color = await prismadb.color.findFirst({
            where: {
                id: params.colorId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_ID_GET]', error);
        return new NextResponse('Internal Error',{status:500})
    }
}
export async function DELETE (
    req: Request,
    { params } : { params : { storeId: string, colorId: string}}
) { 

    try {
        const { userId } = auth();

        if(!userId) return new NextResponse('Unauthenticated',{status:401})

        if(!params.storeId) return new NextResponse('Store ID is missing',{status:400})
        if(!params.colorId) return new NextResponse('Color ID is missing',{status:400})

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId}
        })
        if(!storeByUserId) return new NextResponse('Unauthorized',{status:403});

        const colors = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
                storeId: params.storeId
            }
        });

        return NextResponse.json(colors);
    } catch (error) {
        console.log('[COLOR_ID_DELETE]', error);
        return new NextResponse('Internal Error',{status:500})
    }
}
export async function PATCH (
    req: Request,
    { params } : { params : { storeId: string, colorId: string}}
) { 
    try {
        const { userId } = auth();
        const { name, value } = await req.json();

        if(!userId) return new NextResponse('Unauthenticated',{status:401})
        if(!name) return new NextResponse('Name field is missing',{status:400})
        if(!value) return new NextResponse('Value field is missing',{status:400})

        if(!params.storeId) return new NextResponse('Store ID is missing',{status:400})
        if(!params.colorId) return new NextResponse('Color ID is missing',{status:400})

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId}
        })
        if(!storeByUserId) return new NextResponse('Unauthorized',{status:403});

        const colors = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
                storeId: params.storeId
            },
            data : { name,value }
        });

        return NextResponse.json(colors);
    } catch (error) {
        console.log('[COLOR_ID_PATCH]', error);
        return new NextResponse('Internal Error',{status:500})
    }
}