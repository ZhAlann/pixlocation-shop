import { getProducts } from "@/lib/products";
import CatalogueClient from "@/components/CatalogueClient";

export const metadata = {
    title: "Catalogue — PixShop",
    description: "Parcourez notre catalogue de matériel audiovisuel neuf et occasion.",
};

export default async function CataloguePage() {
    const products = await getProducts();

    return (
        <>
            <div className="px-page-hero">
                <h1>Catalogue</h1>
                <p>Matériel audiovisuel neuf et occasion — {products.length} produits disponibles</p>
            </div>
            <CatalogueClient products={products} />
        </>
    );
}
