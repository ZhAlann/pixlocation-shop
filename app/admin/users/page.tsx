"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUser, getAllUsers, updateUserRole } from "@/lib/users";
import { UserProfile } from "@/types/user";
import Link from "next/link";

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (!u) { router.push("/login"); return; }
            const p = await getUser(u.uid);
            if (p?.role !== "admin") { router.push("/"); return; }
            const list = await getAllUsers();
            setUsers(list);
            setLoading(false);
        });
        return () => unsub();
    }, [router]);

    const handleRoleToggle = async (uid: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (!confirm(`Changer le rôle de cet utilisateur en "${newRole}" ?`)) return;
        setUpdatingId(uid);
        try {
            await updateUserRole(uid, newRole as "user" | "admin");
            setUsers((prev) =>
                prev.map((u) => (u.id === uid ? { ...u, role: newRole as "user" | "admin" } : u))
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = users.filter(
        (u) =>
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
            u.lastName?.toLowerCase().includes(search.toLowerCase())
    );

    const adminCount = users.filter((u) => u.role === "admin").length;

    return (
        <>
            <div className="px-admin-header">
                <h1>Dashboard Admin</h1>
            </div>

            <div style={{ background: "#f5f4f0", padding: "24px 32px", minHeight: 500 }}>
                <div className="px-admin-layout">

                    {/* SIDEBAR */}
                    <aside className="px-admin-sidebar">
                        <Link href="/admin/products" className="px-admin-link">Produit</Link>
                        <Link href="/admin" className="px-admin-link">Commande</Link>
                        <Link href="/admin/users" className="px-admin-link active">Comptes client</Link>
                    </aside>

                    {/* CONTENU */}
                    <div style={{ flex: 1 }}>

                        {/* Stats */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                            {[
                                { label: "Total utilisateurs", value: users.length, color: "#1a1a2e" },
                                { label: "Administrateurs", value: adminCount, color: "#e63012" },
                                { label: "Clients standard", value: users.length - adminCount, color: "#2e7d32" },
                            ].map((s) => (
                                <div key={s.label} style={{
                                    background: "#fff", border: "1px solid #eee",
                                    borderRadius: 6, padding: "16px 20px",
                                }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#888", marginBottom: 8 }}>
                                        {s.label}
                                    </div>
                                    <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>
                                        {s.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Table utilisateurs */}
                        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 6, overflow: "hidden" }}>
                            {/* Header + search */}
                            <div style={{
                                padding: "16px 20px", borderBottom: "1px solid #f0f0f0",
                                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                            }}>
                                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>
                                    Liste des Clients
                                </h2>
                                <input
                                    className="px-input"
                                    placeholder="Rechercher un utilisateur..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ width: 260, padding: "8px 12px" }}
                                />
                            </div>

                            {loading ? (
                                <div style={{ padding: "48px 32px", textAlign: "center", color: "#888" }}>
                                    Chargement...
                                </div>
                            ) : filtered.length === 0 ? (
                                <div style={{ padding: "48px 32px", textAlign: "center", color: "#888" }}>
                                    <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
                                    <div style={{ fontSize: 14 }}>
                                        {search ? "Aucun utilisateur trouvé." : "Aucun utilisateur enregistré."}
                                    </div>
                                </div>
                            ) : (
                                <table className="px-table" style={{ borderRadius: 0, border: "none" }}>
                                    <thead>
                                        <tr>
                                            <th>Utilisateur</th>
                                            <th>Email</th>
                                            <th>Adresse</th>
                                            <th>Rôle</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((u) => (
                                            <tr key={u.id}>
                                                {/* Avatar + nom */}
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div style={{
                                                            width: 36, height: 36, borderRadius: "50%",
                                                            background: u.role === "admin" ? "#e63012" : "#1a1a2e",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0,
                                                        }}>
                                                            {(u.firstName?.[0] ?? u.email?.[0] ?? "?").toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
                                                                {u.firstName && u.lastName
                                                                    ? `${u.firstName} ${u.lastName}`
                                                                    : "—"}
                                                            </div>
                                                            {u.phone && (
                                                                <div style={{ fontSize: 11, color: "#888" }}>{u.phone}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email */}
                                                <td style={{ fontSize: 12, color: "#555" }}>
                                                    {u.email ?? "—"}
                                                </td>

                                                {/* Adresse */}
                                                <td style={{ fontSize: 12, color: "#888" }}>
                                                    {u.city
                                                        ? `${u.city}${u.postalCode ? ` (${u.postalCode})` : ""}`
                                                        : "—"}
                                                </td>

                                                {/* Rôle */}
                                                <td>
                                                    <span className="px-badge" style={{
                                                        background: u.role === "admin" ? "#fce4e4" : "#e8f5e9",
                                                        color: u.role === "admin" ? "#c62828" : "#2e7d32",
                                                        fontSize: 11,
                                                    }}>
                                                        {u.role === "admin" ? "Admin" : "Client"}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td>
                                                    <div style={{ display: "flex", gap: 8 }}>
                                                        <button
                                                            onClick={() => handleRoleToggle(u.id, u.role)}
                                                            disabled={updatingId === u.id}
                                                            className="px-btn px-btn-sm"
                                                            style={{
                                                                background: "transparent",
                                                                border: `1px solid ${u.role === "admin" ? "#e63012" : "#1a1a2e"}`,
                                                                color: u.role === "admin" ? "#e63012" : "#1a1a2e",
                                                                opacity: updatingId === u.id ? 0.6 : 1,
                                                            }}
                                                        >
                                                            {updatingId === u.id
                                                                ? "..."
                                                                : u.role === "admin"
                                                                    ? "Rétrograder"
                                                                    : "Promouvoir admin"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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
