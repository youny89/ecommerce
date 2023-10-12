import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: { storeId:string, productId:string}}
) {
    try {
        if(!params.storeId) return new NextResponse('Store ID is missing')
        if(!params.productId) return new NextResponse('Product ID is missing')

        const product = await prismadb.product.findFirst({
            where: {
                id: params.productId,
                storeId: params.storeId
            },
            include:{
                images:true,
                category:true,
                color:true,
                size:true
            }
        })

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_ID_GET]',error);
        return new NextResponse('internal error',{status:500});
    }
}

export async function DELETE (
    req:Request,
    { params }: { params: { storeId: string, productId: string}}
) {
    try {
        const { userId } = auth();

        if(!userId) return new NextResponse('Unauthenticated',{status:401});
        if(!params.storeId) return new NextResponse('Store Id is missing',{status:400})
        if(!params.productId) return new NextResponse('Product Id is missing',{status:400})
        const storeByUserId = await prismadb.store.findFirst({
            where:{ id: params.storeId, userId }
        })
        if(!storeByUserId) return new NextResponse('Unauthorized',{status:403});

        const product = await prismadb.product.delete({ where: { id : params.productId}})

        return Response.json(product);
    } catch (error) {
        console.log('[PRODUCT_ID_DELETE]',error);
        return new Response('Internal Error',{status:500})
    }
}

export async function PATCH (
    req:Request,
    { params }: { params: { storeId: string, productId: string}}
){
    try {
        const { userId } = auth();
        const body = await req.json()
        const {
            name, price, images, categoryId, colorId, sizeId, isFeatured, isArchived
        } = body;

        if(!userId) return new NextResponse('Unauthenticated',{status:401})
        if(!params.productId) return new NextResponse('Product Id is missing',{status:400})
        if(!name) return new NextResponse('Name field is missing',{status:400})
        if(!price) return new NextResponse('Price field is missing',{status:400})
        if(!categoryId) return new NextResponse('CategoryId field is missing',{status:400})
        if(!colorId) return new NextResponse('ColorId is missing',{status:400})
        if(!sizeId) return new NextResponse('SizeId is missing',{status:400})
        if(!images || !images.length) return new NextResponse('Images field is missing',{status:400})        

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId}
        })
        if(!storeByUserId) return new NextResponse('Unauthorized',{status:403})

        await prismadb.product.update({
            where: { id: params.productId },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                isFeatured,
                isArchived,
                description:"",
                images:{
                    deleteMany:{}
                }
            }
        });
        const product = await prismadb.product.update({
            where: {id: params.productId },
            data:{
                images:{
                    createMany: {
                        data: [
                            ...images.map((image:{url:string})=> image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_ID_PATCH]',error)
        return new NextResponse('Internal Error',{status:500})
    }
}