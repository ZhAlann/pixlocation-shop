"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUser } from "@/lib/users";
import { getOrders } from "@/lib/orders";
import OrderCard from "@/components/OrderCard";

export default function AdminPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [allowed, setAllowed] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setAllowed(false);
                return;
            }

            const profile: any = await getUser(user.uid);

            if (profile?.role === "admin") {
                setAllowed(true);

                const data = await getOrders();
                setOrders(data);
            } else {
                setAllowed(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (allowed === null) {
        return (
            <main className="p-10">
                <p>Chargement...</p>
            </main>
        );
    }

    if (!allowed) {
        return (
            <main className="p-10">
                <h1 className="text-2xl font-bold">Accès refusé</h1>
            </main>
        );
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = orders.length;

    return (
        <main className="p-10">
            <h1 className="mb-8 text-3xl font-bold">Dashboard Admin</h1>

            <section className="mb-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border p-6">
                    <h2 className="mb-2 text-lg font-semibold">Nombre de commandes</h2>
                    <p className="text-3xl font-bold">{totalOrders}</p>
                </div>

                <div className="rounded-lg border p-6">
                    <h2 className="mb-2 text-lg font-semibold">Chiffre d’affaires</h2>
                    <p className="text-3xl font-bold">
                        {totalRevenue.toLocaleString("fr-FR")} €
                    </p>
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-2xl font-semibold">Commandes récentes</h2>

                <div className="grid gap-6">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            </section>
        </main>
    );
}