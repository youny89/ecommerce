import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/category-form";


const CategoryIdPage = async (
    { params } : { params: { categoryId: string}}
) => {
    let category = null;

    if(params.categoryId !== 'new') category = await prismadb.category.findUnique({where : { id: params.categoryId }});

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm initialData={category}/>
            </div>
        </div>
    )
}

export default CategoryIdPage