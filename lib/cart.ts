import { Product } from "@/types/product";

const CART_KEY = "pixlocation_cart";

export type CartItem = {
    product: Product;
    quantity: number;
};

export type CheckoutCartItem = {
    productId: string;
    quantity: number;
};

export function getCart(): CartItem[] {
    if (typeof window === "undefined") return [];

    try {
        const data = localStorage.getItem(CART_KEY);
        return data ? (JSON.parse(data) as CartItem[]) : [];
    } catch {
        return [];
    }
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

export function updateCartQuantity(productId: string, quantity: number) {
    const cart = getCart()
        .map((item) =>
            item.product.id === productId
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
        )
        .filter((item) => item.quantity > 0);

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

export function toCheckoutItems(cart: CartItem[]): CheckoutCartItem[] {
    return cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
    }));
}