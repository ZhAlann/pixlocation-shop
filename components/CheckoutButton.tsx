"use client";

import { auth } from "@/lib/firebase";
import { CartItem } from "@/lib/cart";

type CheckoutButtonProps = {
    cart: CartItem[];
};

export default function CheckoutButton({ cart }: CheckoutButtonProps) {
    const handleCheckout = async () => {
        if (!auth.currentUser) {
            alert("Vous devez être connecté pour passer commande.");
            return;
        }

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ items: cart }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Impossible de lancer le paiement.");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors du checkout.");
        }
    };

    return (
        <button
            onClick={handleCheckout}
            className="rounded bg-black px-6 py-3 text-white"
        >
            Passer au paiement
        </button>
    );
}