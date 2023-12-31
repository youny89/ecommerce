// @route: /api/:storeId/categories

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req:Request,
    { params } :{ params:{ storeId: string}}
) {
    try {
        if(!params.storeId) return new NextResponse('Store ID is missing',{status:400});

        const categories = await prismadb.category.findMany({
            where: { storeId: params.storeId }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.log('[CATEGORY_GET]',error);
        return new NextResponse('Internal Error',{status:500});
    }
}

export async function POST (
    req:Request,
    { params } : { params : { storeId: string }}
) {
    try {
        const { userId } = auth();
        const body = await req.json()
        const { name, billboardId } = body;

        if(!userId) return new NextResponse('Unauthenticated',{status: 401});
        if(!name) return new NextResponse('Name field is missing',{status: 400});
        if(!params.storeId) return new NextResponse('Store ID is missing',{status: 400});
        if(!billboardId) return new NextResponse('Billboard ID is missing',{status:400});

        const storebyUserId = await prismadb.store.findUnique({
            where : {
                id: params.storeId,
                userId
            }
        })
        if(!storebyUserId) return new NextResponse('Unauthrozied', { status: 403});

        const category = await prismadb.category.create({
            data : { 
                name,
                storeId : params.storeId,
                billboardId
            }
        })

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse('Internal Error',{ status: 500});
    }
}