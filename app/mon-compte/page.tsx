"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getOrdersByEmail } from "@/lib/orders";
import { getUser, saveUserProfile } from "@/lib/users";
import { sendPasswordResetEmail } from "firebase/auth";
export default function MonComptePage() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userUid, setUserUid] = useState<string | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user?.email || !user?.uid) {
                setUserEmail(null);
                setUserUid(null);
                setOrders([]);
                setProfile(null);
                setLoading(false);
                return;
            }

            setUserEmail(user.email);
            setUserUid(user.uid);

            try {
                const [userOrders, userProfile] = await Promise.all([
                    getOrdersByEmail(user.email),
                    getUser(user.uid),
                ]);

                setOrders(userOrders);
                setProfile(
                    userProfile || {
                        email: user.email,
                        firstName: "",
                        lastName: "",
                        address: "",
                        city: "",
                        postalCode: "",
                        country: "",
                        phone: "",
                        role: "user",
                    }
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleProfileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!profile) return;

        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userUid || !profile) return;

        try {
            await saveUserProfile(userUid, profile, userEmail || undefined);
            setMessage("Profil mis à jour avec succès.");
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de l’enregistrement du profil.");
        }
    };

    if (loading) {
        return (
            <main className="p-10">
                <p>Chargement...</p>
            </main>
        );
    }

    if (!userEmail) {
        return (
            <main className="p-10">
                <h1 className="mb-4 text-3xl font-bold">Mon compte</h1>
                <p>Vous devez être connecté pour accéder à cette page.</p>
            </main>
        );
    }

    const totalSpent = orders.reduce(
        (sum, order) => sum + (order.amount || 0),
        0
    );
    const handleResetPassword = async () => {
        if (!userEmail) return;

        try {
            await sendPasswordResetEmail(auth, userEmail);
            setMessage("Email de réinitialisation envoyé.");
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de l’envoi.");
        }
    };
    return (
        <main className="p-10">
            <h1 className="mb-6 text-3xl font-bold">Mon compte</h1>

            <section className="mb-8 rounded-lg border p-6">
                <h2 className="mb-2 text-xl font-semibold">Informations client</h2>

                <p>Email : {userEmail}</p>
                <button
                    onClick={handleResetPassword}
                    className="mt-4 rounded bg-gray-800 px-4 py-2 text-sm hover:bg-gray-700"
                >
                    Modifier mon mot de passe
                </button>
                <p className="mt-2">Nombre de commandes : {orders.length}</p>
                <p>Total dépensé : {totalSpent.toLocaleString("fr-FR")} €</p>
            </section>

            <section className="mb-8 rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-semibold">Mes informations de livraison</h2>

                {profile && (
                    <form onSubmit={handleSaveProfile} className="grid gap-4 md:grid-cols-2">
                        <input
                            name="firstName"
                            placeholder="Prénom"
                            value={profile.firstName || ""}
                            onChange={handleProfileChange}
                            className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                        />

                        <input
                            name="lastName"
                            placeholder="Nom"
                            value={profile.lastName || ""}
                            onChange={handleProfileChange}
                            className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                        />

                        <input
                            name="address"
                            placeholder="Adresse"
                            value={profile.address || ""}
                            onChange={handleProfileChange}
                            className="rounded border border-gray-700 bg-black px-4 py-2 text-white md:col-span-2"
                        />

                        <input
                            name="city"
                            placeholder="Ville"
                            value={profile.city || ""}
                            onChange={handleProfileChange}
                            className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                        />

                        <input
                            name="postalCode"
                            placeholder="Code postal"
                            value={profile.postalCode || ""}
                            onChange={handleProfileChange}
                            className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                        />

                        <input
                            name="country"
                            placeholder="Pays"
                            value={profile.country || ""}
                            onChange={handleProfileChange}
                            className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                        />

                        <input
                            name="phone"
                            placeholder="Téléphone"
                            value={profile.phone || ""}
                            onChange={handleProfileChange}
                            className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                        />

                        <button
                            type="submit"
                            className="rounded bg-white px-4 py-2 font-semibold text-black md:col-span-2"
                        >
                            Enregistrer mes informations
                        </button>
                    </form>
                )}

                {message && (
                    <p className="mt-4 rounded border border-green-600 bg-green-950 px-4 py-3 text-green-300">
                        {message}
                    </p>
                )}
            </section>

            <section>
                <h2 className="mb-4 text-2xl font-semibold">Mes commandes</h2>

                {orders.length === 0 ? (
                    <p>Vous n’avez encore passé aucune commande.</p>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <article key={order.id} className="rounded-lg border p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Commande #{order.id}</h3>
                                    <span className="rounded bg-green-600 px-2 py-1 text-sm text-white">
                                        {order.status}
                                    </span>
                                </div>

                                <p className="mb-2">Montant : {order.amount} €</p>

                                <div className="mt-3">
                                    <h4 className="mb-2 font-semibold">Produits :</h4>
                                    <ul className="space-y-1 text-sm text-gray-300">
                                        {order.items?.map((item: any, index: number) => {
                                            if (typeof item === "string") {
                                                return <li key={index}>{item}</li>;
                                            }

                                            if (item?.product?.name) {
                                                return (
                                                    <li key={index}>
                                                        {item.product.name} × {item.quantity}
                                                    </li>
                                                );
                                            }

                                            return <li key={index}>Produit inconnu</li>;
                                        })}
                                    </ul>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}