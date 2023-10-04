// @route /api/:storeId/billboards/:billboardId

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

interface IParams {
     params: { storeId: string, billboardId: string}
}


// 싱글 빌보드 데이터
export async function GET (
    req:Request,
    { params } : { params : { billboardId: string }}
) {
    try {
        if(!params.billboardId) return new NextResponse('Billboard ID is missing',{ status:400});

        const billboard = await prismadb.billboard.findUnique({
            where : { id: params.billboardId }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_ID_GET]', error)
        return new NextResponse('Internal Error',{status: 500});
        
    }
}

// 빌보드 삭제
export async function DELETE (
    req: Request,
    { params }: IParams
) {
    try {
        const { userId } = auth()

        if(!userId) return new NextResponse('Unauthenticated', { status:401 });
        if(!params.storeId) return new NextResponse('Store ID is missing',{ status:400});
        if(!params.billboardId) return new NextResponse('Billboard ID is missing',{ status:400});

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if(!storeByUserId) return new NextResponse('Unauthorized',{status:403});

        const billboard = await prismadb.billboard.deleteMany({
            where: { id: params.billboardId }
        })

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.log('[BILLBOARD_ID_DELETE]', error)
        return new NextResponse('Internal Error',{status: 500});
    }
}


// 빌보드 수정
export async function PATCH (
    req:Request,
    { params } : IParams
) {
    try {
        const { userId } = auth()
        const body = await req.json();
        const { label, imageUrl } = body;

        if(!userId) return new NextResponse('Unauthenticated', { status:401 });
        if(!label) return new NextResponse('Label field is required', { status:400 });
        if(!imageUrl) return new NextResponse('Image URL field is required', { status:400 });
        if(!params.storeId) return new NextResponse('Store ID is missing',{ status:400});
        if(!params.billboardId) return new NextResponse('Billboard ID is missing',{ status:400});

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if(!storeByUserId) return new NextResponse('Unauthorized',{status:403});

        const billboard = await prismadb.billboard.updateMany({
            where: { id: params.billboardId },
            data: { label, imageUrl }
        })

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_ID_PATCH]', error)
        return new NextResponse('Internal Error',{status: 500});
    }
}