import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import AddToCartButton from "@/components/AddToCartButton";

type ProductPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;

    const ref = doc(db, "products", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        return (
            <main className="p-10">
                <p>Produit introuvable</p>
            </main>
        );
    }

    const product = { id: snap.id, ...snap.data() };

    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {product.imageUrl && (
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="my-6 w-full max-w-xl rounded"
                />
            )}

            <p>{product.description}</p>

            <p className="mt-4 text-xl font-semibold">{product.price} €</p>

            <div className="mt-6">
                <AddToCartButton product={product} />
            </div>
        </main>
    );
}