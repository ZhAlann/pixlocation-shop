import { Order } from "@/types/order";

interface Props {
    order: Order;
}

export default function OrderCard({ order }: Props) {
    const statusColor =
        order.status === "paid"
            ? { bg: "#e8f5e9", color: "#2e7d32", label: "Payé" }
            : order.status === "pending"
                ? { bg: "#fff3e0", color: "#e65100", label: "En cours" }
                : { bg: "#fce4e4", color: "#c62828", label: "Annulé" };

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
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 6, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: "#aaa" }}>#{order.id.slice(0, 8)}</span>
                <span className="px-badge" style={{ background: statusColor.bg, color: statusColor.color }}>{statusColor.label}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#e63012", marginBottom: 6 }}>
                {order.amount?.toLocaleString("fr-FR")} &euro;
            </div>
            <div style={{ fontSize: 11, color: "#888" }}>{formatDate(order.createdAt)}</div>
            {(order.items ?? []).length > 0 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f5f5f5" }}>
                    {order.items.map((item, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#555", marginBottom: 3 }}>
                            {item.product?.name ?? "Produit"} &times; {item.quantity}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
