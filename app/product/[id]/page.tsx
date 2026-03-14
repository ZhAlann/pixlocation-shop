import { notFound } from "next/navigation";
import { products } from "@/data/products";
import AddToCartButton from "@/components/AddToCartButton";
type ProductPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;

    const product = products.find((item) => item.id === id);

    if (!product) {
        notFound();
    }

    return (
        <main className="p-10">
            <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
            <p className="mb-4 text-gray-600">{product.description}</p>
            <p className="mb-2">Prix : {product.price} €</p>
            <p className="mb-2">Stock : {product.stock}</p>
            <p className="mb-6">État : {product.condition}</p>

            <AddToCartButton product={product} />
        </main>
    );
}