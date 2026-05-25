"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getOrdersByUserId } from "@/lib/orders";
import { getUser } from "@/lib/users";
import { Order, OrderItem } from "@/types/order";
import { UserProfile } from "@/types/user";
import Link from "next/link";

export default function MonComptePage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [resetSent, setResetSent] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (!u) { router.push("/login"); return; }
            const [o, p] = await Promise.all([getOrdersByUserId(u.uid), getUser(u.uid)]);
            setOrders(o);
            setProfile(p);
            setLoading(false);
        });
        return () => unsub();
    }, [router]);

    const handleReset = async () => {
        if (!auth.currentUser?.email) return;
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        setResetSent(true);
    };

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/");
    };

    const totalSpent = orders.reduce((s, o) => s + (o.amount ?? 0), 0);

    const statusStyle = (status: string) => {
        if (status === "paid") return { label: "Payé", bg: "#e8f5e9", color: "#2e7d32" };
        if (status === "pending") return { label: "En cours", bg: "#fff3e0", color: "#e65100" };
        return { label: "Annulé", bg: "#fce4e4", color: "#c62828" };
    };

    const formatDate = (createdAt: Order["createdAt"]) => {
        if (!createdAt) return "—";
        try {
            const d = typeof createdAt === "object" && "toDate" in createdAt && createdAt.toDate
                ? createdAt.toDate()
                : new Date(createdAt as string | Date);
            return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
        } catch { return "—"; }
    };

    if (loading) {
        return (
            <div style={{ background: "#f5f4f0", minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#888" }}>Chargement...</p>
            </div>
        );
    }

    return (
        <>
            <div className="px-page-hero">
                <h1>Votre compte</h1>
                <p>{profile?.email}</p>
            </div>

            <div className="px-page-content">
                <div style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "180px 1fr",
                    gap: isMobile ? 16 : 24,
                }}>

                    <aside className="px-admin-sidebar" style={isMobile ? {
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        overflowX: "auto",
                        padding: 6,
                        gap: 4,
                    } : {}}>
                        <div className="px-admin-link active" style={{ cursor: "default", whiteSpace: "nowrap" }}>Mon compte</div>
                        <div className="px-admin-link" style={{ cursor: "default", whiteSpace: "nowrap" }}>Commandes</div>
                        {!isMobile && <div style={{ height: 1, background: "#f0f0f0", margin: "4px 0" }} />}
                        <button
                            onClick={handleSignOut}
                            className="px-admin-link"
                            style={{ width: isMobile ? "auto" : "100%", textAlign: "left", border: "none", cursor: "pointer", background: "transparent", whiteSpace: "nowrap" }}
                        >
                            Déconnexion
                        </button>
                    </aside>

                    <div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                            gap: 14,
                            marginBottom: 24,
                        }}>
                            {[
                                { label: "Commandes passées", value: String(orders.length) },
                                { label: "Total dépensé", value: `${totalSpent.toLocaleString("fr-FR")} €` },
                                { label: "Email", value: profile?.email ?? "—" },
                            ].map((s) => (
                                <div key={s.label} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 6, padding: 16 }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#888", marginBottom: 6 }}>{s.label}</div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.value}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #eee", overflow: "hidden", marginBottom: 16 }}>
                            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
                                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Liste de vos commandes</h2>
                            </div>

                            {orders.length === 0 ? (
                                <div style={{ padding: "48px 32px", textAlign: "center" }}>
                                    <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                                    <div style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>Vous n&apos;avez pas encore passé de commande.</div>
                                    <Link href="/catalogue" className="px-btn px-btn-red px-btn-sm">Voir le catalogue</Link>
                                </div>
                            ) : (
                                <div>
                                    {orders.map((order) => {
                                        const s = statusStyle(order.status ?? "pending");
                                        const isExpanded = expandedOrder === order.id;
                                        const items: OrderItem[] = order.items ?? [];

                                        return (
                                            <div key={order.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                                                <div
                                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateColumns: isMobile ? "1fr auto" : "130px 1fr auto auto 130px",
                                                        alignItems: "center",
                                                        gap: isMobile ? 8 : 16,
                                                        padding: isMobile ? "12px 16px" : "14px 20px",
                                                        cursor: "pointer",
                                                    }}
                                                >

                                                    {!isMobile && (
                                                        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#aaa" }}>
                                                            #{order.id.slice(0, 8)}
                                                        </div>
                                                    )}

                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 }}>
                                                        {isMobile && (
                                                            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#aaa", marginBottom: 2 }}>
                                                                #{order.id.slice(0, 8)} · {formatDate(order.createdAt)}
                                                            </div>
                                                        )}
                                                        {items.slice(0, isMobile ? 1 : 3).map((item, i) => (
                                                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                                <div style={{ width: 36, height: 30, borderRadius: 3, background: "#e8e6de", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                                    {item.product?.imageUrl ? (
                                                                        // eslint-disable-next-line @next/next/no-img-element
                                                                        <img src={item.product.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                    ) : (
                                                                        <span style={{ fontSize: 14 }}>📷</span>
                                                                    )}
                                                                </div>
                                                                <span style={{ fontSize: 12, color: "#333", fontWeight: 500, maxWidth: isMobile ? 140 : 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                                    {item.product?.name ?? "Produit"}
                                                                </span>
                                                                {item.quantity > 1 && <span style={{ fontSize: 11, color: "#888" }}>×{item.quantity}</span>}
                                                            </div>
                                                        ))}
                                                        {items.length > (isMobile ? 1 : 3) && (
                                                            <span style={{ fontSize: 11, color: "#888", background: "#f5f4f0", padding: "2px 8px", borderRadius: 10 }}>
                                                                +{items.length - (isMobile ? 1 : 3)} autre{items.length - (isMobile ? 1 : 3) > 1 ? "s" : ""}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {!isMobile && (
                                                        <span className="px-badge" style={{ background: s.bg, color: s.color, fontSize: 11, whiteSpace: "nowrap" }}>{s.label}</span>
                                                    )}

                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                                                        <div style={{ fontWeight: 800, color: "#e63012", fontSize: 15, whiteSpace: "nowrap" }}>
                                                            {order.amount?.toLocaleString("fr-FR")} &euro;
                                                        </div>
                                                        {isMobile && (
                                                            <span className="px-badge" style={{ background: s.bg, color: s.color, fontSize: 10 }}>{s.label}</span>
                                                        )}
                                                        {!isMobile && (
                                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                                                                <span style={{ fontSize: 12, color: "#888" }}>{formatDate(order.createdAt)}</span>
                                                            </div>
                                                        )}
                                                        <span style={{ fontSize: 14, color: "#aaa", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div style={{ background: "#f5f4f0", borderTop: "1px solid #eee", padding: isMobile ? "12px 16px" : "16px 20px" }}>
                                                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#888", marginBottom: 12 }}>
                                                            Détail #{order.id.slice(0, 8)}
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                            {items.map((item, i) => (
                                                                <div key={i} style={{ background: "#fff", borderRadius: 4, border: "1px solid #eee", padding: isMobile ? "10px 12px" : "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                                                                    <div style={{ width: isMobile ? 44 : 56, height: isMobile ? 36 : 46, borderRadius: 4, background: "#e8e6de", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                                        {item.product?.imageUrl ? (
                                                                            // eslint-disable-next-line @next/next/no-img-element
                                                                            <img src={item.product.imageUrl} alt={item.product?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                        ) : (
                                                                            <span style={{ fontSize: 20 }}>📷</span>
                                                                        )}
                                                                    </div>
                                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                                            {item.product?.name ?? "Produit supprimé"}
                                                                        </div>
                                                                        {item.product?.condition && (
                                                                            <span className={`px-badge ${item.product.condition === "neuf" ? "px-badge-new" : "px-badge-used"}`} style={{ fontSize: 10 }}>
                                                                                {item.product.condition === "neuf" ? "Neuf" : "Occasion"}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                                        <div style={{ fontSize: 12, color: "#888" }}>×{item.quantity}</div>
                                                                        <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e" }}>
                                                                            {((item.product?.price ?? 0) * item.quantity).toLocaleString("fr-FR")} &euro;
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16, paddingTop: 10, borderTop: "1px solid #eee" }}>
                                                                <span style={{ fontSize: 12, color: "#888" }}>{items.length} article{items.length > 1 ? "s" : ""}</span>
                                                                <span style={{ fontSize: 16, fontWeight: 900, color: "#e63012" }}>Total : {order.amount?.toLocaleString("fr-FR")} &euro;</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 6, padding: 20 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 10 }}>Sécurité du compte</div>
                            {resetSent ? (
                                <p style={{ fontSize: 12, color: "#2e7d32" }}>✓ Email de réinitialisation envoyé à {profile?.email}</p>
                            ) : (
                                <button onClick={handleReset} className="px-btn px-btn-sm px-btn-outline">
                                    Réinitialiser mon mot de passe
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
