"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Email de réinitialisation envoyé !");
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de l'envoi.");
        }
    };

    return (
        <main className="p-10">
            <h1 className="mb-6 text-3xl font-bold">Mot de passe oublié</h1>

            <form onSubmit={handleReset} className="max-w-md space-y-4">
                <input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border border-gray-700 bg-black px-4 py-2 text-white"
                />

                <button
                    type="submit"
                    className="rounded bg-white px-4 py-2 text-black"
                >
                    Réinitialiser
                </button>
            </form>

            {message && (
                <p className="mt-4 rounded border px-4 py-3">
                    {message}
                </p>
            )}
        </main>
    );
}