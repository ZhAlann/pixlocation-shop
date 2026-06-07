import { getProductById } from "@/lib/products";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) notFound();

    return (
        <>
            {/* Breadcrumb */}
            <div style={{ background: "#f5f4f0", padding: "12px 64px", borderBottom: "1px solid #eee" }}>
                <p style={{ fontSize: 12, color: "#888" }}>
                    <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Accueil</Link>
                    {" / "}
                    <Link href="/catalogue" style={{ color: "#888", textDecoration: "none" }}>Catalogue</Link>
                    {" / "}
                    <span style={{ color: "#1a1a2e", fontWeight: 600 }}>{product.name}</span>
                </p>
            </div>

            {/* Fiche produit */}
            <section style={{ background: "#fff", padding: "48px 64px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>

                    {/* IMAGE */}
                    <div>
                        <div style={{
                            background: "#f5f4f0",
                            borderRadius: 6,
                            height: 360,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            marginBottom: 12,
                        }}>
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <span style={{ fontSize: 80, color: "#ccc" }}>📷</span>
                            )}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} style={{
                                    background: i === 1 ? "#e8e6de" : "#f5f4f0",
                                    border: i === 1 ? "2px solid #e63012" : "2px solid transparent",
                                    borderRadius: 4,
                                    width: 72,
                                    height: 56,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    fontSize: 20,
                                }}>
                                    📷
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* INFOS */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* Catégorie */}
                        <p style={{
                            fontSize: 11, fontWeight: 700, letterSpacing: 2,
                            textTransform: "uppercase", color: "#e63012",
                        }}>
                            {product.category}
                        </p>

                        {/* Nom */}
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.2 }}>
                            {product.name}
                        </h1>

                        {/* Badges */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span className={`px-badge ${product.condition === "neuf" ? "px-badge-new" : "px-badge-used"}`}
                                style={{ fontSize: 11, padding: "4px 10px" }}>
                                {product.condition === "neuf" ? "Neuf" : "Occasion"}
                            </span>
                            {product.stock <= 2 && product.stock > 0 && (
                                <span style={{ fontSize: 11, color: "#e65100", fontWeight: 600 }}>
                                    Plus que {product.stock} en stock !
                                </span>
                            )}
                            {product.stock === 0 && (
                                <span style={{ fontSize: 11, color: "#c62828", fontWeight: 600 }}>
                                    Rupture de stock
                                </span>
                            )}
                        </div>

                        {/* Prix */}
                        <div style={{ fontSize: 36, fontWeight: 900, color: "#e63012" }}>
                            {product.price.toLocaleString("fr-FR")} €
                        </div>

                        {/* Garanties */}
                        <div style={{
                            background: "#f5f4f0", borderRadius: 6, padding: 16,
                            display: "flex", flexDirection: "column", gap: 10,
                        }}>
                            {[
                                { icon: "✓", text: "Produit vérifié par nos experts" },
                                { icon: "🚚", text: "Livraison 24h partout en France" },
                                { icon: "↩", text: "Retour sous 14 jours" },
                                { icon: "🔒", text: "Paiement sécurisé Stripe" },
                            ].map((g) => (
                                <div key={g.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: 14 }}>{g.icon}</span>
                                    <span style={{ fontSize: 12, color: "#333" }}>{g.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Bouton panier */}
                        {product.stock > 0 ? (
                            <AddToCartButton product={product} />
                        ) : (
                            <button
                                disabled
                                className="px-btn"
                                style={{
                                    background: "#ccc", color: "#fff",
                                    cursor: "not-allowed", padding: "14px 24px", fontSize: 14,
                                }}
                            >
                                Rupture de stock
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* DESCRIPTION */}
            <section style={{ background: "#1a1a2e", padding: "40px 64px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <h2 style={{
                        color: "#fff", fontSize: 14, fontWeight: 700,
                        letterSpacing: 2, textTransform: "uppercase", marginBottom: 12,
                    }}>
                        Description
                    </h2>
                    <div style={{ width: 60, height: 3, background: "#e63012", borderRadius: 2, marginBottom: 20 }} />
                    <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.9, maxWidth: 800 }}>
                        {product.description || "Aucune description disponible pour ce produit."}
                    </p>
                </div>
            </section>
        </>
    );
}
