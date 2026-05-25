"use client";

import { useMemo, useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface Props {
    products: Product[];
}

const CATEGORIES = [
    { value: "toutes", label: "Toutes" },
    { value: "camera", label: "Caméras" },
    { value: "objectif", label: "Objectifs" },
    { value: "micro", label: "Micros" },
    { value: "accessoire", label: "Accessoires" },
];

export default function CatalogueClient({ products }: Props) {
    const [search, setSearch] = useState("");
    const [condition, setCondition] = useState("tous");
    const [category, setCategory] = useState("toutes");

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
            const matchCondition = condition === "tous" || p.condition === condition;
            const matchCategory = category === "toutes" || p.category === category;
            return matchSearch && matchCondition && matchCategory;
        });
    }, [products, search, condition, category]);

    const resetFilters = () => {
        setSearch("");
        setCondition("tous");
        setCategory("toutes");
    };

    return (
        <div className="px-catalogue-layout">
            <div className="px-catalogue-grid">

                <aside className="px-filter-card" style={{ height: "fit-content" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", letterSpacing: "0.5px", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
                        Filtrer par
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label className="px-filter-title">Recherche</label>
                        <input className="px-input" placeholder="Nom du produit..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <div className="px-filter-title">État</div>
                        {["tous", "neuf", "occasion"].map((val) => (
                            <label key={val} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: condition === val ? "#e63012" : "#555", marginBottom: 10, cursor: "pointer", fontWeight: condition === val ? 600 : 400 }}>
                                <input type="radio" name="condition" value={val} checked={condition === val} onChange={() => setCondition(val)} style={{ accentColor: "#e63012" }} />
                                {val === "tous" ? "Tous" : val.charAt(0).toUpperCase() + val.slice(1)}
                            </label>
                        ))}
                    </div>

                    <div style={{ marginBottom: 20, paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                        <div className="px-filter-title">Catégorie</div>
                        {CATEGORIES.map((cat) => (
                            <label key={cat.value} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: category === cat.value ? "#e63012" : "#555", marginBottom: 10, cursor: "pointer", fontWeight: category === cat.value ? 600 : 400 }}>
                                <input type="radio" name="category" value={cat.value} checked={category === cat.value} onChange={() => setCategory(cat.value)} style={{ accentColor: "#e63012" }} />
                                {cat.label}
                            </label>
                        ))}
                    </div>

                    <button onClick={resetFilters} className="px-btn px-btn-sm" style={{ width: "100%", background: "transparent", border: "1px solid #e63012", color: "#e63012", borderRadius: 3 }}>
                        Réinitialiser
                    </button>
                </aside>

                <div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span><strong style={{ color: "#1a1a2e" }}>{filtered.length}</strong> produit{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</span>
                    </div>

                    {filtered.length > 0 ? (
                        <div className="px-products-grid">
                            {filtered.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #eee", padding: "60px 32px", textAlign: "center", color: "#888" }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 8 }}>Aucun produit trouvé</div>
                            <div style={{ fontSize: 13 }}>Essayez de modifier vos filtres.</div>
                            <button onClick={resetFilters} className="px-btn px-btn-red px-btn-sm" style={{ marginTop: 16 }}>Voir tous les produits</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
