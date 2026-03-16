"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUser, saveUserProfile, createUserProfile } from "@/lib/users";
export default function ProfilPage() {
    const [uid, setUid] = useState<string | null>(null);
    const [form, setForm] = useState<any>({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            setUid(user.uid);

            let data = await getUser(user.uid);

            if (!data) {
                await createUserProfile(user.uid, user.email || "");
                data = await getUser(user.uid);
            }

            if (data) setForm(data);
        });

        return () => unsubscribe();
    }, []);
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: any) => {
        e.preventDefault();

        if (!uid) return;

        const currentEmail = auth.currentUser?.email || "";

        await saveUserProfile(uid, form, currentEmail);

        setMessage("Profil mis à jour.");
    };

    return (
        <main className="p-10 max-w-xl">
            <h1 className="mb-6 text-3xl font-bold">Mon profil</h1>

            <form onSubmit={handleSave} className="grid gap-4">

                <input
                    name="firstName"
                    placeholder="Prénom"
                    value={form.firstName || ""}
                    onChange={handleChange}
                    className="rounded border px-4 py-2"
                />

                <input
                    name="lastName"
                    placeholder="Nom"
                    value={form.lastName || ""}
                    onChange={handleChange}
                    className="rounded border px-4 py-2"
                />

                <input
                    name="address"
                    placeholder="Adresse"
                    value={form.address || ""}
                    onChange={handleChange}
                    className="rounded border px-4 py-2"
                />

                <input
                    name="city"
                    placeholder="Ville"
                    value={form.city || ""}
                    onChange={handleChange}
                    className="rounded border px-4 py-2"
                />

                <input
                    name="postalCode"
                    placeholder="Code postal"
                    value={form.postalCode || ""}
                    onChange={handleChange}
                    className="rounded border px-4 py-2"
                />

                <input
                    name="country"
                    placeholder="Pays"
                    value={form.country || ""}
                    onChange={handleChange}
                    className="rounded border px-4 py-2"
                />

                <input
                    name="phone"
                    placeholder="Téléphone"
                    value={form.phone || ""}
                    onChange={handleChange}
                    className="rounded border px-4 py-2"
                />

                <button
                    type="submit"
                    className="rounded bg-black text-white px-4 py-2"
                >
                    Enregistrer les modifications
                </button>

                {message && <p>{message}</p>}
            </form>
        </main>
    );
}