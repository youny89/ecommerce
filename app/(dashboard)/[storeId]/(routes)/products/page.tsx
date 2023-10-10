import prismadb from "@/lib/prismadb"
import ProductsClient from "./components/client"
import { ProductColumn } from "./components/columns"
import { format } from "date-fns"
import { formatter } from "@/lib/utils"

const ProductsPage = async ({ params }: { params: { storeId: string}}) => {

    const products = await prismadb.product.findMany({
        where:{ storeId: params.storeId },
        orderBy: { createdAt: 'desc' },
        include: { color: true, size: true, category: true}
    })

    const formattedProducts: ProductColumn[] = products.map(item=>({
        id: item.id,
        name: item.name,
        price: formatter.format(item.price),
        category: item.category.name,
        size: item.size.name,
        color: item.size.value,
        isFeatured:item.isFeatured,
        isArchived:item.isArchived,
        createdAt: format(item.createdAt,"yyyy/MM/dd"),
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6  space-y-4">
                <ProductsClient data={formattedProducts}/>
            </div>
        </div>
    )
}

export default ProductsPage