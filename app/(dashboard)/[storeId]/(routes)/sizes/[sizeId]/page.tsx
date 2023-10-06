import prismadb from "@/lib/prismadb";
import SizeForm from "./components/size-form";


/**
 * If sizeId is new --> create new size
 * If sizeId is Not new ---> find size by sizeId. 
 */
const SizeIdPage = async ({ params }: { params: {sizeId:string}}) => {
    let size = null;

    if(params.sizeId !== 'new') {
        size = await prismadb.size.findUnique({ where: { id: params.sizeId }});
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeForm initialData={size} />
            </div>
        </div>
    )
}

export default SizeIdPage