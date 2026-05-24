"use client";

import Link from "next/link";

export default function CancelPage() {
    return (
        <>
            <div className="px-page-hero">
                <h1>Paiement annulé</h1>
                <p>Votre commande n'a pas été finalisée</p>
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
                    maxWidth: 520,
                    width: "100%",
                    textAlign: "center",
                }}>
                    {/* Icône annulation */}
                    <div style={{
                        width: 72, height: 72,
                        background: "#fce4e4",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        fontSize: 32,
                    }}>
                        ✕
                    </div>

                    <h2 style={{
                        fontSize: 24, fontWeight: 800,
                        color: "#1a1a2e", marginBottom: 12,
                    }}>
                        Paiement annulé
                    </h2>

                    <p style={{
                        fontSize: 13, color: "#555",
                        marginBottom: 32, lineHeight: 1.7,
                    }}>
                        Vous avez annulé le paiement. Votre panier a été conservé —
                        vous pouvez reprendre votre commande à tout moment.
                    </p>

                    {/* Info panier conservé */}
                    <div style={{
                        background: "#f5f4f0",
                        borderRadius: 6,
                        padding: 16,
                        marginBottom: 32,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        textAlign: "left",
                    }}>
                        <span style={{ fontSize: 22 }}>🛒</span>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 2 }}>
                                Votre panier est toujours là
                            </div>
                            <div style={{ fontSize: 12, color: "#888" }}>
                                Vos articles ont été conservés. Reprenez où vous en étiez.
                            </div>
                        </div>
                    </div>

                    {/* Boutons */}
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/cart" className="px-btn px-btn-red">
                            Retourner au panier
                        </Link>
                        <Link href="/catalogue" className="px-btn px-btn-outline">
                            Continuer mes achats
                        </Link>
                    </div>

                    {/* Contact */}
                    <p style={{ fontSize: 12, color: "#aaa", marginTop: 24 }}>
                        Un problème avec le paiement ?{" "}
                        <Link href="/contact" style={{ color: "#e63012", fontWeight: 600, textDecoration: "none" }}>
                            Contactez-nous
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
