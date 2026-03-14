import { Product } from "@/types/product";

const CART_KEY = "pixlocation_cart";

export type CartItem = {
    product: Product;
    quantity: number;
};

export function getCart(): CartItem[] {
    if (typeof window === "undefined") return [];

    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveCart(cart: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: Product) {
    const cart = getCart();

    const existing = cart.find((item) => item.product.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }

    saveCart(cart);
}

export function removeFromCart(productId: string) {
    const cart = getCart().filter((item) => item.product.id !== productId);
    saveCart(cart);
}

export function getCartTotal(cart: CartItem[]) {
    return cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );
}
export function clearCart() {
    localStorage.removeItem(CART_KEY);
}