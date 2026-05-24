"use client";

import { useState } from "react";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulation envoi — à remplacer par votre service email (Brevo, EmailJS, etc.)
        await new Promise((r) => setTimeout(r, 1000));
        setSent(true);
        setLoading(false);
    };

    return (
        <>
            <div className="px-page-hero">
                <h1>Contactez-nous</h1>
                <p>Notre équipe vous répond du lundi au vendredi, 09h00–17h00</p>
            </div>

            <div style={{ background: "#f5f4f0", padding: "40px 64px" }}>
                <div style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 360px",
                    gap: 32,
                    alignItems: "start",
                }}>

                    {/* FORMULAIRE */}
                    <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #eee", padding: 32 }}>
                        {sent ? (
                            <div style={{ textAlign: "center", padding: "40px 0" }}>
                                <div style={{ fontSize: 56, marginBottom: 16 }}>✉️</div>
                                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>
                                    Message envoyé !
                                </h2>
                                <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
                                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                                </p>
                                <button
                                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                                    className="px-btn px-btn-red px-btn-sm"
                                >
                                    Envoyer un autre message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", marginBottom: 24 }}>
                                    Envoyer un message
                                </h2>
                                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                        <div>
                                            <label className="px-label">Nom complet</label>
                                            <input
                                                className="px-input"
                                                value={form.name}
                                                onChange={set("name")}
                                                placeholder="Nom complet"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="px-label">Email</label>
                                            <input
                                                className="px-input"
                                                type="email"
                                                value={form.email}
                                                onChange={set("email")}
                                                placeholder="Mail"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="px-label">Sujet</label>
                                        <select className="px-input" value={form.subject} onChange={set("subject")} required>
                                            <option value="">Sélectionner un sujet...</option>
                                            <option>Question sur un produit</option>
                                            <option>Suivi de commande</option>
                                            <option>Retour / Remboursement</option>
                                            <option>Problème technique</option>
                                            <option>Autre</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="px-label">Message</label>
                                        <textarea
                                            className="px-input"
                                            rows={6}
                                            value={form.message}
                                            onChange={set("message")}
                                            placeholder="Décrivez votre demande en détail..."
                                            required
                                            style={{ resize: "vertical" }}
                                        />
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-btn px-btn-red"
                                            style={{ opacity: loading ? 0.7 : 1 }}
                                        >
                                            {loading ? "Envoi..." : "Envoyer le message →"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>

                    {/* INFOS CONTACT */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Carte agence */}
                        <div style={{ background: "#1a1a2e", borderRadius: 6, padding: 24 }}>
                            <div style={{
                                fontSize: 11, fontWeight: 700, letterSpacing: 2,
                                textTransform: "uppercase", color: "#e63012", marginBottom: 16,
                            }}>
                                Notre agence
                            </div>
                            {[
                                { icon: "📍", title: "Adresse", text: "36, rue Émile Decorps\n69100 Villeurbanne" },
                                { icon: "📞", title: "Téléphone", text: "04 28 298 298" },
                                { icon: "✉️", title: "Email", text: "contact@pixloc.fr" },
                                { icon: "🕐", title: "Horaires", text: "Lun – Ven\n09h00–12h00 / 14h00–17h00" },
                            ].map((info) => (
                                <div key={info.title} style={{
                                    display: "flex", gap: 14, marginBottom: 18,
                                    paddingBottom: 18, borderBottom: "1px solid #2a2a42",
                                }}>
                                    <div style={{
                                        width: 36, height: 36, background: "#2a2a42",
                                        borderRadius: "50%", display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        fontSize: 16, flexShrink: 0,
                                    }}>
                                        {info.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: "#7a7a9a", marginBottom: 4 }}>
                                            {info.title}
                                        </div>
                                        <div style={{ fontSize: 13, color: "#e0e0f0", whiteSpace: "pre-line" }}>
                                            {info.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Dernier item sans border */}
                        </div>

                        {/* Réseaux sociaux */}
                        <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #eee", padding: 20 }}>
                            <div style={{
                                fontSize: 11, fontWeight: 700, letterSpacing: 2,
                                textTransform: "uppercase", color: "#888", marginBottom: 14,
                            }}>
                                Suivez-nous
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {[
                                    { icon: "f", label: "Facebook", url: "https://facebook.com" },
                                    { icon: "in", label: "Instagram", url: "https://instagram.com" },
                                    { icon: "▶", label: "YouTube", url: "https://youtube.com" },
                                ].map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: "flex", alignItems: "center", gap: 12,
                                            textDecoration: "none", color: "#333",
                                            fontSize: 13, fontWeight: 500,
                                            padding: "8px 12px", borderRadius: 4,
                                            border: "1px solid #eee",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <div style={{
                                            width: 28, height: 28, background: "#1a1a2e",
                                            borderRadius: "50%", display: "flex",
                                            alignItems: "center", justifyContent: "center",
                                            color: "#fff", fontSize: 11, fontWeight: 700,
                                        }}>
                                            {s.icon}
                                        </div>
                                        {s.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
