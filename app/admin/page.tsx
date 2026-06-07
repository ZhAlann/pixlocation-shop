"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUser } from "@/lib/users";
import { getOrders } from "@/lib/orders";
import { Order } from "@/types/order";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      const p = await getUser(u.uid);
      if (p?.role !== "admin") { router.push("/"); return; }
      const o = await getOrders();
      setOrders(o);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const totalRevenu = orders
    .filter((o) => o.status === "paid")
    .reduce((s, o) => s + (o.amount ?? 0), 0);

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
      return d.toLocaleDateString("fr-FR");
    } catch { return "—"; }
  };

  return (
    <>
      <div className="px-admin-header"><h1>Dashboard Admin</h1></div>

      <div style={{ background: "#f5f4f0", padding: "24px 32px", minHeight: 500 }}>
        <div className="px-admin-layout">

          <aside className="px-admin-sidebar">
            <Link href="/admin/products" className="px-admin-link">Produit</Link>
            <Link href="/admin" className="px-admin-link active">Commande</Link>
            <Link href="/admin/users" className="px-admin-link">Comptes client</Link>
          </aside>

          <div style={{ flex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Total commandes", value: String(orders.length), color: "#1a1a2e" },
                { label: "Payées", value: String(orders.filter((o) => o.status === "paid").length), color: "#2e7d32" },
                { label: "En cours", value: String(orders.filter((o) => o.status === "pending").length), color: "#e65100" },
                { label: "Revenu total", value: `${totalRevenu.toLocaleString("fr-FR")} €`, color: "#e63012" },
              ].map((s) => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 6, padding: "16px 20px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#888", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Liste des Commandes</h2>
              </div>

              {loading ? (
                <div style={{ padding: "48px 32px", textAlign: "center", color: "#888" }}>Chargement...</div>
              ) : orders.length === 0 ? (
                <div style={{ padding: "48px 32px", textAlign: "center", color: "#888" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                  <div style={{ fontSize: 14 }}>Aucune commande pour le moment.</div>
                </div>
              ) : (
                <table className="px-table" style={{ borderRadius: 0, border: "none" }}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Client</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const s = statusStyle(order.status ?? "pending");
                      return (
                        <tr key={order.id}>
                          <td style={{ fontFamily: "monospace", fontSize: 11, color: "#aaa" }}>
                            #{order.id.slice(0, 8)}
                          </td>
                          <td>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
                              {order.customerEmail ?? "—"}
                            </div>
                            <div style={{ fontSize: 11, color: "#888" }}>
                              {order.items?.length ?? 0} article{(order.items?.length ?? 0) > 1 ? "s" : ""}
                            </div>
                          </td>
                          <td style={{ fontWeight: 800, fontSize: 14, color: "#e63012" }}>
                            {order.amount?.toLocaleString("fr-FR")} &euro;
                          </td>
                          <td>
                            <span className="px-badge" style={{ background: s.bg, color: s.color, fontSize: 11 }}>
                              {s.label}
                            </span>
                          </td>
                          <td style={{ fontSize: 12, color: "#888" }}>
                            {formatDate(order.createdAt)}
                          </td>
                          <td>
                            <button
                              onClick={() => alert(`Commande #${order.id}\nClient : ${order.customerEmail}\nMontant : ${order.amount} €\nStatut : ${order.status}`)}
                              className="px-btn px-btn-sm px-btn-outline"
                            >
                              Voir détail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
