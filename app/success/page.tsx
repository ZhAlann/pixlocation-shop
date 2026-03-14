"use client";

import { useEffect, useState } from "react";
import { createOrder } from "@/lib/orders";
import { getCart, clearCart } from "@/lib/cart";
import { auth } from "@/lib/firebase";

export default function SuccessPage() {
    const [message, setMessage] = useState("Enregistrement de la commande...");

    useEffect(() => {
        const saveOrder = async () => {
            try {
                const cart = getCart();

                const total = cart.reduce(
                    (sum: number, item: any) => sum + item.product.price * item.quantity,
                    0
                );

                const user = auth.currentUser;

                await createOrder({
                    userId: user?.uid || null,
                    customerEmail: user?.email || "client@pixlocation.com",
                    items: cart,
                    amount: total,
                    status: "paid",
                });

                clearCart();

                setMessage("Commande enregistrée avec succès.");
            } catch (error) {
                console.error(error);
                setMessage("Erreur lors de l'enregistrement.");
            }
        };

        saveOrder();
    }, []);

    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold mb-4">Paiement réussi</h1>
            <p>Merci pour votre commande.</p>
            <p className="mt-4">{message}</p>
        </main>
    );
}