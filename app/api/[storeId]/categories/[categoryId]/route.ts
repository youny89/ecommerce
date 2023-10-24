// @route: /api/:storeId/categories/:categoryId

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req:Request,
    { params }: {params:{ storeId: string, categoryId: string}}
) {
    try {
        if(!params.storeId) return new NextResponse('Store ID is missing',{status:400})
        if(!params.categoryId) return new NextResponse('Category ID is missing',{status:400})
        const category = await prismadb.category.findFirst({
            where: { id: params.categoryId },
            include:{ billboard: true }
        });
        console.log('category: ',category);
        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_ID_GET]',error)
        return new NextResponse('Internal Error',{status:500});
    }
}

export async function PATCH(
    req: Request,
    { params } : { params: {storeId: string, categoryId: string }}
) {
    try {   
        const { userId } = auth();
        const body = await req.json();
        console.log('body : ',body);
        const { name } = body;

        if(!userId) return new NextResponse('Unauthenticated', {status:401});
        if(!name) return new NextResponse('Name field is missing', {status:400});
        if(!params.storeId) return new NextResponse('Store ID is missing', {status:400});
        if(!params.categoryId) return new NextResponse('Category ID is missing', {status:400});

        const storeByUserId = await prismadb.store.findUnique({
            where: { id: params.storeId, userId }
        })
        if(!storeByUserId) return new NextResponse('Unauthorized',{ status:403});

        const category = await prismadb.category.updateMany({
            where : { id: params.categoryId },
            data : { name }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_ID_PATCH]', error);
        return new NextResponse('Internal Error',{status:500});
    }
}

export async function DELETE (
    req:Request,
    { params } : { params:{ storeId:string, categoryId:string}}
) {
    try {
        const { userId } = auth();
        if(!userId) return new NextResponse('Unauthenticated',{status:401});
        if(!params.storeId) return new NextResponse('Store ID is missing',{status:400});
        if(!params.categoryId) return new NextResponse('Category ID is missing',{status:400});

        const storeByUserId = await prismadb.store.findUnique({
            where: { id: params.storeId, userId }
        });
        if(!storeByUserId) return new NextResponse('Unauthorized',{status:403});

        const category = await prismadb.category.deleteMany({
            where: { id: params.categoryId,storeId: params.storeId}
        })

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_ID_DELETE]',error)
        return new NextResponse('Internal Error',{status:500})
    }
}