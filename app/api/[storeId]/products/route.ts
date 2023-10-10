import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (
    req:Request,
    { params }: { params: { storeId:string}}
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { 
            images,
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            isFeatured,
            isArchived
        } = body;

        if(!userId) return new NextResponse('Unauthenticated',{status:401});
        if(!params.storeId) return new NextResponse('Store ID is missing',{status:400});
        if(!name) return new NextResponse('Name field is missing',{status:400});
        if(!images || !images.length ) return new NextResponse('Images field is missing',{status:400});
        if(!price) return new NextResponse('Price field is missing',{status:400});
        if(!categoryId) return new NextResponse('Category field is missing',{status:400});
        if(!sizeId) return new NextResponse('Size field is missing',{status:400});
        if(!colorId) return new NextResponse('Color field is missing',{status:400});

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId }
        });
        if(!storeByUserId) return new NextResponse('Unauthorized',{status:403});

        const product = await prismadb.product.create({
            data:{
                name,
                price,
                description:"",
                isArchived,
                isFeatured,
                categoryId,
                colorId,
                sizeId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [ ...images.map((image:{url:string})=>image)]
                    }
                }
            }
        })


        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCTS_POST]',error);
        return new NextResponse('Internal Error',{status:500})
    }
}