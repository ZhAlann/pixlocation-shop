"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    condition: string;
    category: string;
    imageUrl: string;
    createdAt?: string | null;
};

type Props = {
    products: Product[];
};

export default function CatalogueClient({ products }: Props) {
    const [search, setSearch] = useState("");
    const [condition, setCondition] = useState("tous");
    const [category, setCategory] = useState("toutes");

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesCondition =
                condition === "tous" || product.condition === condition;

            const matchesCategory =
                category === "toutes" || product.category === category;

            return matchesSearch && matchesCondition && matchesCategory;
        });
    }, [products, search, condition, category]);

    return (
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-[#1c1c24]">Filtres</h2>

                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Recherche
                        </label>
                        <input
                            type="text"
                            placeholder="Rechercher un produit"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a3fb3] focus:bg-white text-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            État
                        </label>
                        <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a3fb3] focus:bg-white text-black"
                        >
                            <option value="tous">Toutes conditions</option>
                            <option value="neuf">Neuf</option>
                            <option value="occasion">Occasion</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Catégorie
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a3fb3] focus:bg-white text-black"
                        >
                            <option value="toutes">Toutes catégories</option>
                            <option value="camera">Caméra</option>
                            <option value="objectif">Objectif</option>
                            <option value="micro">Micro</option>
                            <option value="accessoire">Accessoire</option>
                        </select>
                    </div>
                </div>
            </aside>

            <section>
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                        {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
                    </p>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <p className="text-slate-600">
                            Aucun produit ne correspond à votre recherche.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}