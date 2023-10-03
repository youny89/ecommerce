import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function POST (req: Request) {
    try {
        const { userId } = auth();
        const { name } = await req.json();
        if(!userId) return new NextResponse('unauthroized',{status: 401});
        if(!name) new NextResponse('Missing Required Field.',{status:400});


        const store = await prismadb.store.create({
            data: { name,userId}
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORES_POST]',error)
        return new NextResponse("Server Error",{status:500});
    }
}