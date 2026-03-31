import { describe, it, expect } from "vitest";
import { getCartTotal } from "./cart";

describe("Cart", () => {
    it("calcule le total du panier", () => {
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
            {
                product: {
                    id: "2",
                    name: "Micro",
                    description: "",
                    price: 50,
                    stock: 5,
                    imageUrl: "",
                    condition: "occasion" as const,
                    category: "micro" as const,
                },
                quantity: 1,
            },
        ];

        const total = getCartTotal(cart);

        expect(total).toBe(250);
    });
});