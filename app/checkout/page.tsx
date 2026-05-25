"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCart, toCheckoutItems, getCartTotal, CartItem } from "@/lib/cart";
import { saveShippingData } from "@/lib/checkoutStorage";
import { ShippingData } from "@/types/checkout";

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("France");

    useEffect(() => {
        setCart(getCart());
        const unsub = onAuthStateChanged(auth, (u) => {
            if (!u) router.push("/login");
            else if (u.email) setEmail(u.email);
        });
        return () => unsub();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const shippingData: ShippingData = {
            firstName, lastName, email,
            address, city, postalCode, country,
        };

        try {
            saveShippingData(shippingData);
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: toCheckoutItems(cart),
                    shippingData,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || "Erreur lors du paiement."); return; }
            if (data.url) window.location.href = data.url;
        } catch {
            setError("Erreur réseau. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    const total = getCartTotal(cart);

    const inputStyle = {
        width: "100%",
        background: "#f5f4f0",
        border: "1px solid #e0ddd8",
        borderRadius: 3,
        padding: "10px 14px",
        fontSize: 13,
        color: "#1a1a2e",
        outline: "none",
        fontFamily: "inherit",
    } as React.CSSProperties;

    const labelStyle = {
        display: "block",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: "#888",
        marginBottom: 6,
    } as React.CSSProperties;

    return (
        <>
            <div className="px-page-hero">
                <h1>Validation de la commande</h1>
                <p>Étape 2/2 — Informations de livraison et paiement</p>
            </div>

            <div className="px-page-content">
                <form onSubmit={handleSubmit}>
                    <div className="px-checkout-grid">

                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                            <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #eee", padding: 24 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
                                    Informations personnelles
                                </div>
                                <div className="px-form-grid-2" style={{ display: "grid", gap: 14, marginBottom: 14 }}>
                                    <div>
                                        <label style={labelStyle}>Nom</label>
                                        <input
                                            style={inputStyle}
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Nom"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Prénom</label>
                                        <input
                                            style={inputStyle}
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Prénom"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Email</label>
                                    <input
                                        style={inputStyle}
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #eee", padding: 24 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
                                    Adresse de livraison
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    <div>
                                        <label style={labelStyle}>Rue</label>
                                        <input
                                            style={inputStyle}
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Adresse"
                                            required
                                        />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                        <div>
                                            <label style={labelStyle}>Ville</label>
                                            <input
                                                style={inputStyle}
                                                type="text"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                placeholder="Ville"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Code postal</label>
                                            <input
                                                style={inputStyle}
                                                type="text"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                placeholder="Code postal"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Pays</label>
                                        <select
                                            style={inputStyle}
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        >
                                            <option>France</option>
                                            <option>Belgique</option>
                                            <option>Suisse</option>
                                            <option>Luxembourg</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RÉCAPITULATIF ── */}
                        <div className="px-summary-card" style={{ height: "fit-content" }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
                                Total panier
                            </div>

                            {/* Articles */}
                            <div style={{ marginBottom: 14 }}>
                                {cart.map((item) => (
                                    <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: 12 }}>
                                        <span style={{ color: "#555", flex: 1, marginRight: 8 }}>
                                            {item.product.name} ×{item.quantity}
                                        </span>
                                        <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                                            {(item.product.price * item.quantity).toLocaleString("fr-FR")} €
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
                                <span style={{ fontSize: 15, fontWeight: 800 }}>Prix total</span>
                                <span style={{ fontSize: 22, fontWeight: 900, color: "#e63012" }}>
                                    {total.toLocaleString("fr-FR")} €
                                </span>
                            </div>

                            {error && (
                                <div style={{ background: "#fce4e4", border: "1px solid #f7c1c1", borderRadius: 4, padding: "10px 14px", fontSize: 12, color: "#c62828", marginBottom: 14 }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || cart.length === 0}
                                className="px-btn px-btn-red"
                                style={{
                                    width: "100%", justifyContent: "center",
                                    padding: "14px", fontSize: 14,
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? "not-allowed" : "pointer",
                                }}
                            >
                                {loading ? "Redirection..." : "Commander →"}
                            </button>

                            <div style={{ background: "#f5f4f0", borderRadius: 4, padding: "10px 14px", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                <span>🔒</span>
                                <span style={{ fontSize: 11, color: "#888" }}>Paiement sécurisé via Stripe</span>
                            </div>

                            <p style={{ fontSize: 10, color: "#aaa", textAlign: "center", marginTop: 10 }}>
                                En cliquant sur Commander, vous acceptez nos CGV.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
