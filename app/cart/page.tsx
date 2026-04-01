"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { getCart, removeFromCart, getCartTotal } from "@/lib/cart";

export default function CartPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setCart(getCart());

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });

        return () => unsubscribe();
    }, []);

    const handleRemove = (id: string) => {
        removeFromCart(id);
        setCart(getCart());
    };

    const total = getCartTotal(cart);

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="mb-10 text-3xl font-bold">Mon panier</h1>

            {cart.length === 0 ? (
                <p>Votre panier est vide.</p>
            ) : (
                <div className="grid gap-10 lg:grid-cols-[1fr_350px]">
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm text-black"
                            >
                                <div>
                                    <h2 className="font-semibold text-black">{item.product.name}</h2>
                                    <p className="text-sm text-slate-500 text-black">
                                        {item.product.condition}
                                    </p>
                                </div>

                                <div className="text-sm text-slate-600">
                                    x{item.quantity}
                                </div>

                                <div className="font-semibold ">
                                    {item.product.price} €
                                </div>

                                <button
                                    onClick={() => handleRemove(item.product.id)}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Supprimer
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="rounded-2xl border bg-white p-6 shadow-sm h-fit text-black">
                        <h2 className="mb-4 text-lg font-semibold">
                            Récapitulatif
                        </h2>

                        <div className="mb-4 space-y-2 text-sm text-slate-600 text-black">
                            <p>Articles : {cart.length}</p>
                            <p>Total : {total} €</p>
                        </div>

                        {!user && (
                            <p className="mb-4 text-sm text-red-500 text-black">
                                Connectez-vous pour commander
                            </p>
                        )}

                        {user ? (
                            <Link
                                href="/checkout"
                                className="block w-full rounded-lg bg-[#4a3fb3] py-3 text-center text-white font-semibold hover:bg-[#3d3399] text-black"
                            >
                                Valider la commande
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="block w-full rounded-lg border py-3 text-center text-black"
                            >
                                Se connecter
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}