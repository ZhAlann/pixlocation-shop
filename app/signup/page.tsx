"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/lib/users";
import { getFirebaseAuthErrorMessage } from "@/lib/authErrors";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (password !== confirm) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        if (password.length < 12) {
            setError("Le mot de passe doit contenir au moins 12 caractères.");
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError("Le mot de passe doit contenir au moins une lettre majuscule.");
            return;
        }
        if (!/[0-9]/.test(password)) {
            setError("Le mot de passe doit contenir au moins un chiffre.");
            return;
        }
        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await createUserProfile(cred.user.uid, email);
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
                <h1>Inscription</h1>
                <p>Créez votre compte PixShop gratuitement</p>
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
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 8, textAlign: "center" }}>
                        Inscrivez-vous
                    </h2>
                    <p style={{ fontSize: 12, color: "#888", textAlign: "center", marginBottom: 28 }}>
                        Créez votre espace client PixShop
                    </p>

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
                                placeholder="Min. 12 caractères, 1 majuscule, 1 chiffre"
                                required
                            />
                        </div>
                        <div>
                            <label className="px-label">Confirmation mot de passe</label>
                            <input
                                className="px-input"
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="Confirmer le mot de passe"
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
                            className="px-btn px-btn-dark"
                            style={{
                                width: "100%", justifyContent: "center",
                                padding: "13px", marginTop: 4,
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? "Création..." : "S'inscrire"}
                        </button>
                    </form>

                    <p style={{ fontSize: 12, color: "#888", textAlign: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
                        Vous avez déjà un compte ?{" "}
                        <Link href="/login" style={{ color: "#e63012", fontWeight: 600, textDecoration: "none" }}>
                            Connectez-vous →
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
