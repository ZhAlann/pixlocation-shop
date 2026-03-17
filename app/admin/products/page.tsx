"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUser } from "@/lib/users";
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from "@/lib/products";

export default function AdminProductsPage() {
    const [allowed, setAllowed] = useState<boolean | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        condition: "neuf",
        category: "camera",
        imageUrl: "",
    });

    const loadProducts = async () => {
        const data = await getProducts();
        setProducts(data as any[]);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setAllowed(false);
                return;
            }

            const profile: any = await getUser(user.uid);

            if (profile?.role === "admin") {
                setAllowed(true);
                await loadProducts();
            } else {
                setAllowed(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            price: "",
            stock: "",
            condition: "neuf",
            category: "camera",
            imageUrl: "",
        });
        setEditingId(null);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            stock: Number(form.stock),
            condition: form.condition,
            category: form.category,
            imageUrl: form.imageUrl,
        };

        if (editingId) {
            await updateProduct(editingId, productData);
        } else {
            await createProduct(productData);
        }

        resetForm();
        await loadProducts();
    };

    const handleEdit = (product: any) => {
        setEditingId(product.id);
        setForm({
            name: product.name || "",
            description: product.description || "",
            price: String(product.price || ""),
            stock: String(product.stock || ""),
            condition: product.condition || "neuf",
            category: product.category || "camera",
            imageUrl: product.imageUrl || "",
        });
    };

    const handleDelete = async (productId: string) => {
        await deleteProduct(productId);
        await loadProducts();
    };

    if (allowed === null) {
        return (
            <main className="p-10">
                <p>Chargement...</p>
            </main>
        );
    }

    if (!allowed) {
        return (
            <main className="p-10">
                <h1 className="text-2xl font-bold">Accès refusé</h1>
            </main>
        );
    }

    return (
        <main className="p-10">
            <h1 className="mb-8 text-3xl font-bold">Admin Produits</h1>

            <form onSubmit={handleSubmit} className="mb-10 grid max-w-2xl gap-4">
                <input
                    name="name"
                    placeholder="Nom du produit"
                    value={form.name}
                    onChange={handleChange}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                    required
                />

                <input
                    name="price"
                    type="number"
                    placeholder="Prix"
                    value={form.price}
                    onChange={handleChange}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                    required
                />

                <input
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                    required
                />

                <select
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                >
                    <option value="neuf">neuf</option>
                    <option value="occasion">occasion</option>
                </select>

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                >
                    <option value="camera">camera</option>
                    <option value="objectif">objectif</option>
                    <option value="micro">micro</option>
                    <option value="accessoire">accessoire</option>
                </select>

                <input
                    name="imageUrl"
                    placeholder="URL de l'image"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                />

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="rounded bg-white px-4 py-2 font-semibold text-black"
                    >
                        {editingId ? "Modifier le produit" : "Ajouter le produit"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded border px-4 py-2"
                        >
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            <div className="grid gap-6">
                {products.map((product) => (
                    <article key={product.id} className="rounded-lg border p-4">
                        <h2 className="text-xl font-bold">{product.name}</h2>
                        <p className="text-gray-300">{product.description}</p>
                        <p>Prix : {product.price} €</p>
                        <p>Stock : {product.stock}</p>
                        <p>Condition : {product.condition}</p>
                        <p>Catégorie : {product.category}</p>

                        {product.imageUrl && (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="mt-4 h-40 rounded object-cover"
                            />
                        )}

                        <div className="mt-4 flex gap-4">
                            <button
                                onClick={() => handleEdit(product)}
                                className="rounded bg-yellow-500 px-4 py-2 text-black"
                            >
                                Modifier
                            </button>

                            <button
                                onClick={() => handleDelete(product.id)}
                                className="rounded bg-red-600 px-4 py-2 text-white"
                            >
                                Supprimer
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}