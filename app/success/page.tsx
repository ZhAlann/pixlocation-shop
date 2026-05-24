"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getCart, clearCart } from "@/lib/cart";
import { getShippingData, clearShippingData } from "@/lib/checkoutStorage";
import { createOrder } from "@/lib/orders";

export default function SuccessPage() {
    const [message, setMessage] = useState("Enregistrement de la commande...");
    const [done, setDone] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            const cart = getCart();

            if (!cart.length || !user?.uid) {
                setMessage("Paiement confirmé !");
                setDone(true);
                return;
            }

            try {
                const shipping = getShippingData();
                const total = cart.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                );

                await createOrder({
                    userId: user.uid,
                    customerEmail: user.email ?? "",
                    items: cart,
                    amount: total,
                    status: "paid",
                    shipping: shipping ?? null,
                });

                clearCart();
                clearShippingData();
                setMessage("Commande enregistrée avec succès !");
            } catch {
                setMessage("Paiement confirmé !");
            } finally {
                setDone(true);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <div className="px-page-hero">
                <h1>Paiement confirmé</h1>
                <p>Merci pour votre commande !</p>
            </div>

            <div style={{
                background: "#f5f4f0",
                minHeight: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 32px",
            }}>
                <div style={{
                    background: "#fff",
                    borderRadius: 6,
                    border: "1px solid #eee",
                    padding: "56px 48px",
                    maxWidth: 560,
                    width: "100%",
                    textAlign: "center",
                }}>
                    {/* Icône succès */}
                    <div style={{
                        width: 72, height: 72,
                        background: "#e8f5e9",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        fontSize: 32,
                    }}>
                        ✓
                    </div>

                    <h2 style={{
                        fontSize: 24, fontWeight: 800,
                        color: "#1a1a2e", marginBottom: 12,
                    }}>
                        Commande validée !
                    </h2>

                    <p style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
                        {message}
                    </p>

                    {done && (
                        <>
                            <p style={{ fontSize: 13, color: "#555", marginBottom: 32, lineHeight: 1.7 }}>
                                Vous recevrez une confirmation par email sous peu.<br />
                                Retrouvez le détail de vos commandes dans votre espace personnel.
                            </p>

                            {/* Garanties */}
                            <div style={{
                                background: "#f5f4f0",
                                borderRadius: 6,
                                padding: 20,
                                marginBottom: 32,
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                                textAlign: "left",
                            }}>
                                {[
                                    { icon: "🚚", text: "Livraison sous 24h partout en France" },
                                    { icon: "📦", text: "Matériel soigneusement préparé et vérifié" },
                                    { icon: "↩", text: "Retour possible sous 14 jours" },
                                ].map((g) => (
                                    <div key={g.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <span style={{ fontSize: 18 }}>{g.icon}</span>
                                        <span style={{ fontSize: 13, color: "#555" }}>{g.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Boutons */}
                            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                                <Link href="/mon-compte" className="px-btn px-btn-red">
                                    Voir mes commandes
                                </Link>
                                <Link href="/catalogue" className="px-btn px-btn-outline">
                                    Continuer mes achats
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
