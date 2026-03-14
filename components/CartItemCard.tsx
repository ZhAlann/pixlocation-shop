"use client";

import { CartItem } from "@/lib/cart";

type CartItemCardProps = {
    item: CartItem;
    onRemove: (productId: string) => void;
};

export default function CartItemCard({ item, onRemove }: CartItemCardProps) {
    return (
        <article className="rounded-lg border p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <span className="rounded bg-black px-2 py-1 text-sm text-white">
                    {item.product.condition}
                </span>
            </div>

            <p className="mb-2 text-sm text-gray-600">{item.product.description}</p>

            <p className="mb-1">Prix unitaire : {item.product.price} €</p>
            <p className="mb-1">Quantité : {item.quantity}</p>
            <p className="mb-4 font-semibold">
                Sous-total : {item.product.price * item.quantity} €
            </p>

            <button
                onClick={() => onRemove(item.product.id)}
                className="rounded bg-red-600 px-4 py-2 text-white"
            >
                Supprimer
            </button>
        </article>
    );
}