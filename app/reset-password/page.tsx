"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirebaseAuthErrorMessage } from "@/lib/authErrors";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setSent(true);
        } catch (err: unknown) {
            const code = (err as { code?: string }).code ?? "";
            setError(getFirebaseAuthErrorMessage(code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="px-page-hero" style={{ textAlign: "center" }}>
                <h1>Mot de passe oublié</h1>
                <p>Réinitialisez votre mot de passe en quelques secondes</p>
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
                    padding: "40px",
                    width: "100%",
                    maxWidth: 420,
                }}>
                    {sent ? (
                        /* État : email envoyé */
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                width: 64, height: 64,
                                background: "#e8f5e9",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 20px",
                                fontSize: 28,
                            }}>
                                ✉️
                            </div>

                            <h2 style={{
                                fontSize: 18, fontWeight: 700,
                                color: "#1a1a2e", marginBottom: 12,
                            }}>
                                Email envoyé !
                            </h2>

                            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 8 }}>
                                Un email de réinitialisation a été envoyé à
                            </p>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 24 }}>
                                {email}
                            </p>

                            <div style={{
                                background: "#f5f4f0",
                                borderRadius: 4,
                                padding: 14,
                                fontSize: 12,
                                color: "#666",
                                lineHeight: 1.7,
                                marginBottom: 28,
                                textAlign: "left",
                            }}>
                                <strong>Vous ne recevez rien ?</strong><br />
                                Vérifiez votre dossier spam ou attendez quelques minutes.
                                Le lien est valable 1 heure.
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <button
                                    onClick={() => { setSent(false); setEmail(""); }}
                                    className="px-btn px-btn-outline"
                                    style={{ width: "100%", justifyContent: "center" }}
                                >
                                    Utiliser une autre adresse
                                </button>
                                <Link
                                    href="/login"
                                    className="px-btn px-btn-dark"
                                    style={{ width: "100%", justifyContent: "center", textAlign: "center" }}
                                >
                                    Retour à la connexion
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Formulaire */
                        <>
                            <h2 style={{
                                fontSize: 20, fontWeight: 700,
                                color: "#1a1a2e", marginBottom: 8,
                            }}>
                                Réinitialiser le mot de passe
                            </h2>
                            <p style={{ fontSize: 13, color: "#888", marginBottom: 28, lineHeight: 1.6 }}>
                                Saisissez votre adresse email. Nous vous enverrons
                                un lien pour créer un nouveau mot de passe.
                            </p>

                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div>
                                    <label className="px-label">Adresse email</label>
                                    <input
                                        className="px-input"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Mail"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <div style={{
                                        background: "#fce4e4",
                                        border: "1px solid #f7c1c1",
                                        borderRadius: 4,
                                        padding: "10px 14px",
                                        fontSize: 12,
                                        color: "#c62828",
                                    }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-btn px-btn-red"
                                    style={{
                                        width: "100%",
                                        justifyContent: "center",
                                        padding: "13px",
                                        opacity: loading ? 0.7 : 1,
                                    }}
                                >
                                    {loading ? "Envoi..." : "Envoyer le lien →"}
                                </button>
                            </form>

                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 20,
                                paddingTop: 16,
                                borderTop: "1px solid #f0f0f0",
                            }}>
                                <Link
                                    href="/login"
                                    style={{ fontSize: 12, color: "#888", textDecoration: "none" }}
                                >
                                    ← Retour à la connexion
                                </Link>
                                <Link
                                    href="/signup"
                                    style={{ fontSize: 12, color: "#e63012", fontWeight: 600, textDecoration: "none" }}
                                >
                                    Créer un compte
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
