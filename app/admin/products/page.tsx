"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUser } from "@/lib/users";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/products";
import { uploadImage } from "@/lib/upload";
import { Product } from "@/types/product";
import Link from "next/link";

const EMPTY: Omit<Product, "id"> = {
    name: "", description: "", price: 0, stock: 0,
    imageUrl: "", condition: "neuf", category: "camera",
};

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState<Omit<Product, "id">>(EMPTY);
    const [editId, setEditId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (!u) { router.push("/login"); return; }
            const p = await getUser(u.uid);
            if (p?.role !== "admin") { router.push("/"); return; }
            loadProducts();
        });
        return () => unsub();
    }, [router]);

    const loadProducts = async () => {
        const list = await getProducts();
        setProducts(list);
    };

    const set = (field: keyof Omit<Product, "id">) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            const val = field === "price" || field === "stock" ? Number(e.target.value) : e.target.value;
            setForm((f) => ({ ...f, [field]: val }));
        };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file);
            setForm((f) => ({ ...f, imageUrl: url }));
        } catch { alert("Erreur upload image"); }
        finally { setUploading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) { await updateProduct(editId, form); }
            else { await createProduct(form); }
            setForm(EMPTY);
            setEditId(null);
            setShowForm(false);
            loadProducts();
        } finally { setLoading(false); }
    };

    const handleEdit = (p: Product) => {
        setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, imageUrl: p.imageUrl, condition: p.condition, category: p.category });
        setEditId(p.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce produit ?")) return;
        await deleteProduct(id);
        loadProducts();
    };

    return (
        <>
            <div className="px-admin-header"><h1>Dashboard Admin</h1></div>

            <div style={{ background: "#f5f4f0", padding: "24px 32px", minHeight: 500 }}>
                <div style={{ display: "flex", gap: 24, maxWidth: 1400, margin: "0 auto" }}>

                    <aside className="px-admin-sidebar">
                        <Link href="/admin/products" className="px-admin-link active">Produit</Link>
                        <Link href="/admin" className="px-admin-link">Commande</Link>
                        <Link href="/admin/users" className="px-admin-link">Comptes client</Link>
                    </aside>

                    <div style={{ flex: 1 }}>
                        {showForm && (
                            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 6, padding: 24, marginBottom: 24 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{editId ? "Modifier un produit" : "Ajouter un produit"}</h2>
                                    <button onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY); }} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#888" }}>✕</button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                                        <div><label className="px-label">Nom du produit</label><input className="px-input" value={form.name} onChange={set("name")} placeholder="Sony A7 IV" required /></div>
                                        <div><label className="px-label">Prix (€)</label><input className="px-input" type="number" value={form.price} onChange={set("price")} min={0} required /></div>
                                        <div><label className="px-label">Stock</label><input className="px-input" type="number" value={form.stock} onChange={set("stock")} min={0} required /></div>
                                        <div>
                                            <label className="px-label">État</label>
                                            <select className="px-input" value={form.condition} onChange={set("condition")}>
                                                <option value="neuf">Neuf</option>
                                                <option value="occasion">Occasion</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="px-label">Catégorie</label>
                                            <select className="px-input" value={form.category} onChange={set("category")}>
                                                <option value="camera">Caméra</option>
                                                <option value="objectif">Objectif</option>
                                                <option value="micro">Micro</option>
                                                <option value="accessoire">Accessoire</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: 14 }}><label className="px-label">Description</label><textarea className="px-input" rows={3} value={form.description} onChange={set("description")} style={{ resize: "vertical" }} /></div>
                                    <div style={{ marginBottom: 20 }}>
                                        <label className="px-label">Image</label>
                                        <input className="px-input" value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://... ou uploadez un fichier" style={{ marginBottom: 8 }} />
                                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: 12, color: "#555" }} />
                                        {uploading && <p style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Upload en cours...</p>}
                                        {form.imageUrl && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={form.imageUrl} alt="preview" style={{ width: 80, height: 64, objectFit: "cover", borderRadius: 4, marginTop: 8 }} />
                                        )}
                                    </div>
                                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                        <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY); }} className="px-btn px-btn-sm px-btn-outline">Annuler</button>
                                        <button type="submit" disabled={loading} className="px-btn px-btn-red px-btn-sm">{loading ? "Enregistrement..." : editId ? "Mettre à jour" : "Enregistrer"}</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 6, overflow: "hidden" }}>
                            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Liste des Produits</h2>
                                <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }} className="px-btn px-btn-red px-btn-sm">+ Ajouter un produit</button>
                            </div>
                            <table className="px-table" style={{ borderRadius: 0, border: "none" }}>
                                <thead>
                                    <tr><th>Image</th><th>Nom</th><th>Prix</th><th>Stock</th><th>État</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr key={p.id}>
                                            <td>
                                                <div style={{ background: "#e8e6de", width: 48, height: 40, borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    {p.imageUrl
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        ? <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                        : <span style={{ fontSize: 18 }}>📷</span>}
                                                </div>
                                            </td>
                                            <td><div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>{p.name}</div><div style={{ fontSize: 11, color: "#888", textTransform: "capitalize" }}>{p.category}</div></td>
                                            <td style={{ fontWeight: 800, color: "#e63012" }}>{p.price.toLocaleString("fr-FR")} &euro;</td>
                                            <td><span style={{ color: p.stock === 0 ? "#c62828" : p.stock <= 2 ? "#e65100" : "#333", fontWeight: 600 }}>{p.stock}</span></td>
                                            <td><span className={`px-badge ${p.condition === "neuf" ? "px-badge-new" : "px-badge-used"}`}>{p.condition === "neuf" ? "Neuf" : "Occasion"}</span></td>
                                            <td>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <button onClick={() => handleEdit(p)} className="px-btn px-btn-sm px-btn-outline">Modifier</button>
                                                    <button onClick={() => handleDelete(p.id)} className="px-btn px-btn-sm" style={{ background: "transparent", border: "1px solid #e63012", color: "#e63012" }}>Supprimer</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {products.length === 0 && <div style={{ padding: "48px 32px", textAlign: "center", color: "#888" }}>Aucun produit. Cliquez sur &quot;+ Ajouter un produit&quot;.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
