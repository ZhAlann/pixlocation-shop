import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default async function CataloguePage() {
    const products = await getProducts();

    return (
        <main className="p-10">
            <h1 className="mb-8 text-3xl font-bold">Catalogue</h1>

            {products.length === 0 ? (
                <p>Aucun produit disponible.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-3">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </main>
    );
}