import { describe, it, expect } from "vitest";
import { toCheckoutItems } from "./cart";

describe("Checkout", () => {
    it("transforme le panier en payload backend", () => {
        const cart = [
            {
                product: {
                    id: "1",
                    name: "Camera",
                    description: "",
                    price: 100,
                    stock: 5,
                    imageUrl: "",
                    condition: "neuf" as const,
                    category: "camera" as const,
                },
                quantity: 2,
            },
        ];

        const result = toCheckoutItems(cart);

        expect(result).toEqual([
            {
                productId: "1",
                quantity: 2,
            },
        ]);
    });
});