import prismadb from "@/lib/prismadb";
import ColorForm from "./components/color-form";

const ColorIdPage = async ({ params } : {params : { colorId: string}}) => {

    let color = null;
    if(params.colorId !== 'new') {
        color = await prismadb.color.findUnique({ where : { id: params.colorId }})
    }


    // const textColor = {
    //     id:"123",
    //     name:"빨강",
    //     value:"red",
    //     createdAt:"2023/10/09"
    // }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm initialData={color}/>
            </div>
        </div>
    )
}

export default ColorIdPage