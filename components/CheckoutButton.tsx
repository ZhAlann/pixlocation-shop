"use client";

import { CartItem } from "@/lib/cart";
import { saveShippingData } from "@/lib/checkoutStorage";

type CheckoutButtonProps = {
    cart: CartItem[];
    shippingData: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
    };
};

export default function CheckoutButton({
    cart,
    shippingData,
}: CheckoutButtonProps) {
    const handleCheckout = async () => {
        try {
            saveShippingData(shippingData);

            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: cart,
                    shippingData,
                }),
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
            className="rounded bg-black px-4 py-2 text-white"
        >
            Passer au paiement
        </button>
    );
}