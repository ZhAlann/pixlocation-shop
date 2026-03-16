"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUser } from "@/lib/users";
import { getCart } from "@/lib/cart";
import CheckoutButton from "@/components/CheckoutButton";

export default function ConfirmationPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [shippingData, setShippingData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });

    useEffect(() => {
        setCart(getCart());

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            const data: any = await getUser(user.uid);

            if (data) {
                setShippingData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    address: data.address || "",
                    city: data.city || "",
                    postalCode: data.postalCode || "",
                    country: data.country || "",
                    phone: data.phone || "",
                });
            }
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingData({
            ...shippingData,
            [e.target.name]: e.target.value,
        });
    };

    const total = cart.reduce(
        (sum: number, item: any) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <main className="mx-auto max-w-4xl p-10">
            <h1 className="mb-8 text-3xl font-bold">Confirmation de commande</h1>

            <section className="mb-10">
                <h2 className="mb-4 text-xl font-semibold">Adresse de livraison</h2>

                <div className="grid gap-4">
                    <input
                        name="firstName"
                        placeholder="Prénom"
                        value={shippingData.firstName}
                        onChange={handleChange}
                        className="rounded border px-4 py-2"
                    />

                    <input
                        name="lastName"
                        placeholder="Nom"
                        value={shippingData.lastName}
                        onChange={handleChange}
                        className="rounded border px-4 py-2"
                    />

                    <input
                        name="address"
                        placeholder="Adresse"
                        value={shippingData.address}
                        onChange={handleChange}
                        className="rounded border px-4 py-2"
                    />

                    <input
                        name="city"
                        placeholder="Ville"
                        value={shippingData.city}
                        onChange={handleChange}
                        className="rounded border px-4 py-2"
                    />

                    <input
                        name="postalCode"
                        placeholder="Code postal"
                        value={shippingData.postalCode}
                        onChange={handleChange}
                        className="rounded border px-4 py-2"
                    />

                    <input
                        name="country"
                        placeholder="Pays"
                        value={shippingData.country}
                        onChange={handleChange}
                        className="rounded border px-4 py-2"
                    />

                    <input
                        name="phone"
                        placeholder="Téléphone"
                        value={shippingData.phone}
                        onChange={handleChange}
                        className="rounded border px-4 py-2"
                    />
                </div>
            </section>

            <section className="mb-10">
                <h2 className="mb-4 text-xl font-semibold">Votre commande</h2>

                <div className="space-y-4">
                    {cart.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="flex justify-between rounded border p-4"
                        >
                            <div>
                                <p className="font-semibold">{item.product.name}</p>
                                <p>Quantité : {item.quantity}</p>
                            </div>

                            <p>{item.product.price * item.quantity} €</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-right text-xl font-bold">
                    Total : {total} €
                </div>
            </section>

            <CheckoutButton cart={cart} shippingData={shippingData} />
        </main>
    );
}