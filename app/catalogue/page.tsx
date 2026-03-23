import { getProducts } from "@/lib/products";
import CatalogueClient from "@/components/CatalogueClient";

export default async function CataloguePage() {
    const products = await getProducts();

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-[#4a3fb3] to-[#6b5cff] px-8 py-10 text-white shadow-lg">
                <h1 className="text-3xl font-bold">Catalogue</h1>
                <p className="mt-2 text-sm text-white/80">
                    Découvrez notre sélection de matériel audiovisuel
                </p>
            </div>

            <CatalogueClient products={products} />
        </main>
    );
}