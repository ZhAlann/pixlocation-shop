"use client";

import { useEffect, useState } from "react";
import CartItemCard from "@/components/CartItemCard";
import { CartItem, getCart, getCartTotal, removeFromCart } from "@/lib/cart";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        setCart(getCart());
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
                        <p className="mb-4 text-xl font-bold">Total : {total} €</p>

                        <CheckoutButton cart={cart} />
                    </div>
                </>
            )}
        </main>
    );
}