"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirebaseAuthErrorMessage } from "@/lib/authErrors";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
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
                <h1>Connexion</h1>
                <p>Accédez à votre espace client PixShop</p>
            </div>

            <div style={{
                background: "#f5f4f0", padding: "48px 32px",
                display: "flex", justifyContent: "center", minHeight: 400,
            }}>
                <div style={{
                    background: "#fff", borderRadius: 6, border: "1px solid #eee",
                    padding: 40, width: "100%", maxWidth: 420,
                    height: "fit-content",
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 28, textAlign: "center" }}>
                        Se connecter
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label className="px-label">Email</label>
                            <input
                                className="px-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Mail"
                                required
                            />
                        </div>

                        <div>
                            <label className="px-label">Mot de passe</label>
                            <input
                                className="px-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mot de passe"
                                required
                            />
                        </div>

                        {error && (
                            <div style={{
                                background: "#fce4e4", border: "1px solid #f7c1c1",
                                borderRadius: 4, padding: "10px 14px",
                                fontSize: 12, color: "#c62828",
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-btn px-btn-red"
                            style={{
                                width: "100%", justifyContent: "center",
                                padding: "13px", marginTop: 4,
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0f0f0",
                    }}>
                        <Link href="/reset-password" style={{ fontSize: 12, color: "#888", textDecoration: "none" }}>
                            Mot de passe oublié ?
                        </Link>
                        <Link href="/signup" style={{ fontSize: 12, color: "#e63012", fontWeight: 600, textDecoration: "none" }}>
                            Créer un compte →
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
