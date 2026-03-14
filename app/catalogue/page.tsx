"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import FilterBar from "@/components/FilterBar";
import { products } from "@/data/products";

export default function CataloguePage() {
    const [selectedFilter, setSelectedFilter] = useState("tous");

    const filteredProducts = useMemo(() => {
        if (selectedFilter === "tous") {
            return products;
        }

        return products.filter(
            (product) => product.condition === selectedFilter
        );
    }, [selectedFilter]);

    return (
        <main className="p-10">
            <h1 className="mb-6 text-3xl font-bold">Catalogue</h1>

            <FilterBar
                selected={selectedFilter}
                onChange={setSelectedFilter}
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
}