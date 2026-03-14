import Link from "next/link";
import { Product } from "@/types/product";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <article className="rounded-lg border p-4 shadow-sm">
            <div className="mb-4 h-40 rounded-md bg-gray-200" />

            <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <span className="rounded bg-black px-2 py-1 text-sm text-white">
                    {product.condition}
                </span>
            </div>

            <p className="mb-3 text-sm text-gray-600">{product.description}</p>

            <div className="mb-4 flex items-center justify-between">
                <span className="font-bold">{product.price} €</span>
                <span className="text-sm text-gray-500">Stock : {product.stock}</span>
            </div>

            <Link
                href={`/product/${product.id}`}
                className="inline-block rounded bg-black px-4 py-2 text-white"
            >
                Voir le produit
            </Link>
        </article>
    );
}