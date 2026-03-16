"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getFirebaseAuthErrorMessage } from "@/lib/authErrors";
export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setMessage("Compte créé avec succès.");
            setEmail("");
            setPassword("");
            router.push("/");
        } catch (error: any) {
            console.error(error);
            setMessage(getFirebaseAuthErrorMessage(error.code));
        }
    };

    return (
        <main className="p-10">
            <h1 className="mb-6 text-3xl font-bold">Inscription</h1>

            <form onSubmit={handleSignup} className="max-w-md space-y-4">
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
                    Créer un compte
                </button>
            </form>

            {message && (
                <p className="mt-4 rounded border border-red-500 bg-red-950 px-4 py-3 text-red-300">
                    {message}
                </p>
            )}
        </main>
    );
}