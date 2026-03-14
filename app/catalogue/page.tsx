"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export default function CataloguePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [condition, setCondition] = useState("tous");
    const [category, setCategory] = useState("toutes");

    useEffect(() => {
        const loadProducts = async () => {
            const data = await getProducts();
            setProducts(data as any[]);
        };

        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name
                ?.toLowerCase()
                .includes(search.toLowerCase());

            const matchesCondition =
                condition === "tous" || product.condition === condition;

            const matchesCategory =
                category === "toutes" || product.category === category;

            return matchesSearch && matchesCondition && matchesCategory;
        });
    }, [products, search, condition, category]);

    return (
        <main className="p-10">
            <h1 className="mb-8 text-3xl font-bold">Catalogue</h1>

            <section className="mb-8 grid gap-4 md:grid-cols-3">
                <input
                    type="text"
                    placeholder="Rechercher un produit"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                />

                <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                >
                    <option value="tous">Toutes conditions</option>
                    <option value="neuf">Neuf</option>
                    <option value="occasion">Occasion</option>
                </select>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                >
                    <option value="toutes">Toutes catégories</option>
                    <option value="camera">Caméra</option>
                    <option value="objectif">Objectif</option>
                    <option value="micro">Micro</option>
                    <option value="accessoire">Accessoire</option>
                </select>
            </section>

            {filteredProducts.length === 0 ? (
                <p>Aucun produit ne correspond à votre recherche.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </main>
    );
}