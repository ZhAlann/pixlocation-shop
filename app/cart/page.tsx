"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";

import CartItemCard from "@/components/CartItemCard";
import CheckoutButton from "@/components/CheckoutButton";
import { auth } from "@/lib/firebase";
import { CartItem, getCart, getCartTotal, removeFromCart } from "@/lib/cart";

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setCart(getCart());

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleRemove = (productId: string) => {
        removeFromCart(productId);
        setCart(getCart());
    };

    const total = getCartTotal(cart);

    return (
        <main className="p-10">
            <h1 className="mb-6 text-3xl font-bold">Panier</h1>

            {cart.length === 0 ? (
                <p>Votre panier est vide.</p>
            ) : (
                <>
                    <div className="mb-8 grid gap-6">
                        {cart.map((item) => (
                            <CartItemCard
                                key={item.product.id}
                                item={item}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>

                    <div className="rounded-lg border p-6">
                        <p className="mb-4 text-xl font-bold">
                            Total : {total.toLocaleString("fr-FR")} €
                        </p>

                        {!user && (
                            <p className="mb-4 text-sm text-yellow-400">
                                Vous devez être connecté pour finaliser votre commande.
                            </p>
                        )}

                        {user ? (
                            <CheckoutButton cart={cart} />
                        ) : (
                            <Link
                                href="/login"
                                className="inline-block rounded bg-white px-6 py-3 font-semibold text-black"
                            >
                                Se connecter pour commander
                            </Link>
                        )}
                    </div>
                </>
            )}
        </main>
    );
}