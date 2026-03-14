"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage("Connexion réussie.");
            setEmail("");
            setPassword("");
            router.push("/");
        } catch (error: any) {
            console.error(error);
            setMessage(error.message || "Erreur lors de la connexion.");
        }
    };

    return (
        <main className="p-10">
            <h1 className="mb-6 text-3xl font-bold">Connexion</h1>

            <form onSubmit={handleLogin} className="max-w-md space-y-4">
                <div>
                    <label className="mb-2 block">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded border border-gray-700 bg-black px-4 py-2 text-white"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block">Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded border border-gray-700 bg-black px-4 py-2 text-white"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="rounded bg-white px-4 py-2 font-semibold text-black"
                >
                    Se connecter
                </button>
            </form>

            {message && <p className="mt-4">{message}</p>}
        </main>
    );
}