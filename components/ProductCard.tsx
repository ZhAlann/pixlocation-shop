import Link from "next/link";

export default function ProductCard({ product }: any) {
    return (
        <article className="rounded-lg border p-4">
            {product.imageUrl && (
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="mb-4 h-40 w-full rounded object-cover"
                />
            )}

            <h2 className="text-xl font-bold">{product.name}</h2>

            <p className="text-gray-400">{product.description}</p>

            <p className="mt-2 font-semibold">{product.price} €</p>

            <Link
                href={`/product/${product.id}`}
                className="mt-4 inline-block rounded bg-white px-4 py-2 text-black"
            >
                Voir le produit
            </Link>
        </article>
    );
}