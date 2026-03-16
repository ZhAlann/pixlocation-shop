"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createOrder } from "@/lib/orders";
import { getCart, clearCart } from "@/lib/cart";
import { auth } from "@/lib/firebase";
import {
    getShippingData,
    clearShippingData,
} from "@/lib/checkoutStorage";

export default function SuccessPage() {
    const [message, setMessage] = useState("Enregistrement de la commande...");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                const cart = getCart();

                if (!cart.length) {
                    setMessage("Aucun panier à enregistrer.");
                    return;
                }

                const total = cart.reduce(
                    (sum: number, item: any) => sum + item.product.price * item.quantity,
                    0
                );

                const shipping = getShippingData();

                await createOrder({
                    userId: user?.uid || null,
                    customerEmail: user?.email || "client@pixlocation.com",
                    items: cart,
                    amount: total,
                    status: "paid",
                    shipping: shipping || null,
                });

                clearCart();
                clearShippingData();

                setMessage("Commande enregistrée avec succès.");
            } catch (error) {
                console.error(error);
                setMessage("Erreur lors de l'enregistrement.");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <main className="p-10">
            <h1 className="mb-4 text-3xl font-bold">Paiement réussi</h1>
            <p>Merci pour votre commande.</p>
            <p className="mt-4">{message}</p>
        </main>
    );
}