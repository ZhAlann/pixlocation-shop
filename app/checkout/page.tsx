"use client";

import { useEffect, useState } from "react";
import { getCart, getCartTotal } from "@/lib/cart";
import { saveShippingData } from "@/lib/checkoutStorage";

export default function CheckoutPage() {
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        setCart(getCart());
    }, []);

    const total = getCartTotal(cart);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const data = {
            firstName: form.get("firstName"),
            lastName: form.get("lastName"),
            email: form.get("email"),
            address: form.get("address"),
            city: form.get("city"),
            zip: form.get("zip"),
            country: form.get("country"),
        };

        saveShippingData(data);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ items: cart }),
            });

            const result = await response.json();

            if (result.url) {
                window.location.href = result.url;
            } else {
                alert("Impossible de lancer le paiement.");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la redirection vers Stripe.");
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
                            <input
                                name="firstName"
                                placeholder="Prénom"
                                required
                                className="input"
                            />
                            <input
                                name="lastName"
                                placeholder="Nom"
                                required
                                className="input"
                            />
                            <input
                                name="email"
                                placeholder="Email"
                                required
                                className="input md:col-span-2"
                            />
                            <input
                                name="address"
                                placeholder="Adresse"
                                required
                                className="input md:col-span-2"
                            />
                            <input
                                name="city"
                                placeholder="Ville"
                                required
                                className="input"
                            />
                            <input
                                name="zip"
                                placeholder="Code postal"
                                required
                                className="input"
                            />
                            <input
                                name="country"
                                placeholder="Pays"
                                required
                                className="input md:col-span-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-fit rounded-xl border bg-white p-6 text-black shadow-sm">
                    <h2 className="mb-4 font-semibold">Récapitulatif</h2>

                    <div className="space-y-2 text-sm text-slate-600">
                        {cart.map((item) => (
                            <div key={item.product.id} className="flex justify-between gap-4">
                                <span>{item.product.name}</span>
                                <span>{item.product.price} €</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 border-t pt-4 font-semibold">
                        Total : {total} €
                    </div>

                    <button className="mt-6 w-full rounded-lg bg-[#4a3fb3] py-3 font-semibold text-white">
                        Commander
                    </button>
                </div>
            </form>
        </main>
    );
}