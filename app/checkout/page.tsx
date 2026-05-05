"use client";

import { useEffect, useState } from "react";
import { getCart, getCartTotal, toCheckoutItems } from "@/lib/cart";
import { saveShippingData } from "@/lib/checkoutStorage";
import { ShippingData } from "@/types/checkout";
import type { CartItem } from "@/lib/cart";

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        setCart(getCart());
    }, []);

    const total = getCartTotal(cart);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const form = new FormData(e.currentTarget);

        const data: ShippingData = {
            firstName: String(form.get("firstName") || ""),
            lastName: String(form.get("lastName") || ""),
            email: String(form.get("email") || ""),
            address: String(form.get("address") || ""),
            city: String(form.get("city") || ""),
            postalCode: String(form.get("postalCode") || ""),
            country: String(form.get("country") || ""),
        };

        try {
            // Sauvegarde en localStorage avant redirection Stripe
            // (la redirection externe fait perdre l'état React)
            saveShippingData(data);

            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: toCheckoutItems(cart),
                    shippingData: data,
                }),
            });

            const result = await response.json();

            if (result.url) {
                window.location.href = result.url;
            } else {
                setError("Impossible de lancer le paiement.");
            }
        } catch (error) {
            console.error("Erreur checkout :", error);
            setError("Erreur lors de la redirection vers Stripe.");
        }
    };

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="mb-10 text-3xl font-bold">Validation de commande</h1>

            <form
                onSubmit={handleSubmit}
                className="grid gap-10 lg:grid-cols-[1fr_350px]"
            >
                <div className="space-y-6">
                    <div className="rounded-xl border bg-white p-6 text-black shadow-sm">
                        <h2 className="mb-4 font-semibold">Informations</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <input name="firstName" placeholder="Prénom" required className="input" />
                            <input name="lastName" placeholder="Nom" required className="input" />
                            <input name="email" type="email" placeholder="Email" required className="input md:col-span-2" />
                            <input name="address" placeholder="Adresse" required className="input md:col-span-2" />
                            <input name="city" placeholder="Ville" required className="input" />
                            <input name="postalCode" placeholder="Code postal" required className="input" />
                            <input name="country" placeholder="Pays" required className="input md:col-span-2" />
                        </div>
                    </div>
                </div>

                <div className="h-fit rounded-xl border bg-white p-6 text-black shadow-sm">
                    <h2 className="mb-4 font-semibold">Récapitulatif</h2>

                    <div className="space-y-2 text-sm text-slate-600">
                        {cart.map((item) => (
                            <div key={item.product.id} className="flex justify-between gap-4">
                                <span>{item.product.name} x{item.quantity}</span>
                                <span>{item.product.price * item.quantity} €</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 border-t pt-4 font-semibold">
                        Total : {total} €
                    </div>

                    {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

                    <button className="mt-6 w-full rounded-lg bg-[#4a3fb3] py-3 font-semibold text-white">
                        Commander
                    </button>
                </div>
            </form>
        </main>
    );
}
