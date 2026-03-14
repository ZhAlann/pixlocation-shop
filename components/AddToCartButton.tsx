"use client";

import { Product } from "@/types/product";
import { addToCart } from "@/lib/cart";

type Props = {
    product: Product;
};

export default function AddToCartButton({ product }: Props) {
    const handleClick = () => {
        addToCart(product);
        alert("Produit ajouté au panier !");
    };

    return (
        <button
            onClick={handleClick}
            className="rounded bg-black px-4 py-2 text-white"
        >
            Ajouter au panier
        </button>
    );
}