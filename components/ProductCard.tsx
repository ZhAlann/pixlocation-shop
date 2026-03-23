"use client";

import Link from "next/link";

export default function ProductCard({ product }: any) {
    return (
        <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            {/* IMAGE */}
            <div className="mb-4 h-40 w-full overflow-hidden rounded-xl bg-slate-100">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        No image
                    </div>
                )}
            </div>

            {/* INFOS */}
            <h3 className="text-sm font-semibold text-[#1c1c24] line-clamp-2">
                {product.name}
            </h3>

            <p className="mt-1 text-xs text-slate-500 capitalize">
                {product.category} • {product.condition}
            </p>

            <p className="mt-3 text-lg font-bold text-[#1c1c24]">
                {product.price} €
            </p>

            {/* CTA */}
            <Link
                href={`/product/${product.id}`}
                className="mt-4 block w-full rounded-lg bg-[#4a3fb3] py-2 text-center text-sm font-semibold text-white transition hover:bg-[#3d3399]"
            >
                Voir le produit
            </Link>
        </article>
    );
}