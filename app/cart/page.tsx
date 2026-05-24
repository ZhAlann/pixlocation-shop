"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getCart, removeFromCart, updateCartQuantity, getCartTotal, CartItem } from "@/lib/cart";

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setCart(getCart());
        const unsub = onAuthStateChanged(auth, (u) => setIsLoggedIn(!!u));
        return () => unsub();
    }, []);

    const refresh = () => setCart(getCart());

    const handleRemove = (productId: string) => {
        removeFromCart(productId);
        refresh();
    };

    const handleQty = (productId: string, qty: number) => {
        if (qty < 1) return;
        updateCartQuantity(productId, qty);
        refresh();
    };

    const total = getCartTotal(cart);
    const neufCount = cart.filter((i) => i.product.condition === "neuf").length;
    const occCount = cart.filter((i) => i.product.condition === "occasion").length;

    return (
        <>
            <div className="px-page-hero">
                <h1>Mon panier</h1>
                <p>{cart.length} article{cart.length > 1 ? "s" : ""} · Total : {total.toLocaleString("fr-FR")} €</p>
            </div>

            <div style={{ background: "#f5f4f0", padding: "24px 64px", minHeight: 400 }}>
                {cart.length === 0 ? (
                    <div style={{
                        background: "#fff", borderRadius: 6, border: "1px solid #eee",
                        padding: "80px 32px", textAlign: "center",
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
                            Votre panier est vide
                        </div>
                        <div style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
                            Parcourez notre catalogue pour trouver votre matériel.
                        </div>
                        <Link href="/catalogue" className="px-btn px-btn-red">
                            Voir le catalogue
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, maxWidth: 1200, margin: "0 auto" }}>

                        {/* TABLE */}
                        <div>
                            <table className="px-table">
                                <thead>
                                    <tr>
                                        <th>Produit</th>
                                        <th style={{ textAlign: "center" }}>Quantité</th>
                                        <th style={{ textAlign: "center" }}>État</th>
                                        <th style={{ textAlign: "right" }}>Prix</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item.product.id}>
                                            {/* Produit */}
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                                    <div style={{
                                                        background: "#e8e6de",
                                                        width: 56, height: 48,
                                                        borderRadius: 4,
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        flexShrink: 0, overflow: "hidden",
                                                    }}>
                                                        {item.product.imageUrl ? (
                                                            <img src={item.product.imageUrl} alt={item.product.name}
                                                                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                        ) : (
                                                            <span style={{ fontSize: 20 }}>📷</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a2e", marginBottom: 4 }}>
                                                            {item.product.name}
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemove(item.product.id)}
                                                            style={{
                                                                background: "none", border: "none",
                                                                color: "#e63012", fontSize: 11,
                                                                fontWeight: 600, cursor: "pointer",
                                                                padding: 0,
                                                            }}
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Quantité */}
                                            <td style={{ textAlign: "center" }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                                    <button
                                                        onClick={() => handleQty(item.product.id, item.quantity - 1)}
                                                        style={{
                                                            width: 24, height: 24, borderRadius: 3,
                                                            border: "1px solid #ddd", background: "#fff",
                                                            cursor: "pointer", fontSize: 14, fontWeight: 600,
                                                        }}
                                                    >−</button>
                                                    <span style={{ fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: "center" }}>
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQty(item.product.id, item.quantity + 1)}
                                                        style={{
                                                            width: 24, height: 24, borderRadius: 3,
                                                            border: "1px solid #ddd", background: "#fff",
                                                            cursor: "pointer", fontSize: 14, fontWeight: 600,
                                                        }}
                                                    >+</button>
                                                </div>
                                            </td>

                                            {/* État */}
                                            <td style={{ textAlign: "center" }}>
                                                <span className={`px-badge ${item.product.condition === "neuf" ? "px-badge-new" : "px-badge-used"}`}>
                                                    {item.product.condition === "neuf" ? "Neuf" : "Occasion"}
                                                </span>
                                            </td>

                                            {/* Prix */}
                                            <td style={{ textAlign: "right", fontWeight: 800, fontSize: 14, color: "#1a1a2e" }}>
                                                {(item.product.price * item.quantity).toLocaleString("fr-FR")} €
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ marginTop: 16 }}>
                                <Link href="/catalogue"
                                    style={{ fontSize: 12, color: "#888", textDecoration: "none" }}>
                                    ← Continuer les achats
                                </Link>
                            </div>
                        </div>

                        {/* RÉCAPITULATIF */}
                        <div className="px-summary-card">
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
                                Récapitulatif
                            </div>

                            <div className="px-summary-row">
                                <span style={{ color: "#888" }}>Nombre d'articles</span>
                                <span style={{ fontWeight: 600 }}>{cart.length}</span>
                            </div>
                            {neufCount > 0 && (
                                <div className="px-summary-row">
                                    <span style={{ color: "#888" }}>Dont neuf</span>
                                    <span style={{ fontWeight: 600, color: "#2e7d32" }}>{neufCount}</span>
                                </div>
                            )}
                            {occCount > 0 && (
                                <div className="px-summary-row">
                                    <span style={{ color: "#888" }}>Dont occasion</span>
                                    <span style={{ fontWeight: 600, color: "#e65100" }}>{occCount}</span>
                                </div>
                            )}

                            <div className="px-summary-total">
                                <span style={{ fontSize: 15, fontWeight: 800 }}>Total</span>
                                <span style={{ fontSize: 22, fontWeight: 900, color: "#e63012" }}>
                                    {total.toLocaleString("fr-FR")} €
                                </span>
                            </div>

                            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                                {isLoggedIn ? (
                                    <button
                                        onClick={() => router.push("/checkout")}
                                        className="px-btn px-btn-red"
                                        style={{ width: "100%", justifyContent: "center", padding: "14px" }}
                                    >
                                        Valider la commande →
                                    </button>
                                ) : (
                                    <>
                                        <Link href="/login" className="px-btn px-btn-red"
                                            style={{ width: "100%", justifyContent: "center", padding: "14px", textAlign: "center" }}>
                                            Se connecter pour commander
                                        </Link>
                                        <p style={{ fontSize: 11, color: "#aaa", textAlign: "center" }}>
                                            Pas encore de compte ?{" "}
                                            <Link href="/signup" style={{ color: "#e63012", fontWeight: 600 }}>
                                                S'inscrire
                                            </Link>
                                        </p>
                                    </>
                                )}
                                <div style={{
                                    background: "#f5f4f0", borderRadius: 4, padding: "10px 14px",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                }}>
                                    <span style={{ fontSize: 14 }}>🔒</span>
                                    <span style={{ fontSize: 11, color: "#888" }}>Paiement sécurisé Stripe</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
