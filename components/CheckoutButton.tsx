"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { CartItem, toCheckoutItems } from "@/lib/cart";
import { ShippingData } from "@/types/checkout";

type CheckoutButtonProps = {
    cart: CartItem[];
    shippingData?: ShippingData;
};

export default function CheckoutButton({
    cart,
    shippingData,
}: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCheckout = async () => {
        if (!auth.currentUser) {
            setError("Vous devez être connecté pour passer commande.");
            return;
        }

        if (cart.length === 0) {
            setError("Votre panier est vide.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: toCheckoutItems(cart),
                    shippingData,
                }),
            });

            const data = (await response.json()) as { url?: string; error?: string };

            if (!response.ok) {
                setError(data.error || "Impossible de lancer le paiement.");
                return;
            }

            if (data.url) {
                window.location.href = data.url;
                return;
            }

            setError("Impossible de lancer le paiement.");
        } catch {
            setError("Erreur lors du checkout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Redirection..." : "Passer au paiement"}
            </button>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
    );
}