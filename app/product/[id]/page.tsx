import { getProductById } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

type ProductPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return <p className="p-10">Produit introuvable</p>;
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <div className="grid gap-10 lg:grid-cols-2">
                <div>
                    <div className="mb-4 h-[420px] w-full overflow-hidden rounded-2xl bg-slate-100">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400">
                                No image
                            </div>
                        )}
                    </div>


                </div>

                <div>
                    <p className="text-sm capitalize text-[#4a3fb3]">
                        {product.category}
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-grey">
                        {product.name}
                    </h1>

                    <p className="mt-2 text-sm capitalize text-slate-500">
                        {product.condition}
                    </p>

                    <p className="mt-6 text-3xl font-bold text-grey">
                        {product.price} €
                    </p>

                    <div className="mt-6">
                        <AddToCartButton product={product} />
                    </div>

                    <div className="mt-8 space-y-3 text-sm text-slate-600 text-white">
                        <p>✔ Produit vérifié</p>
                        <p>✔ Expédition rapide</p>
                        <p>✔ Paiement sécurisé</p>
                    </div>
                </div>
            </div>

            <section className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-[#1c1c24]">
                    Description
                </h2>

                <p className="leading-7 text-slate-600">
                    {product.description || "Aucune description disponible."}
                </p>
            </section>
        </main>
    );
}