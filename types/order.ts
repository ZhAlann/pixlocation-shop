export type OrderStatus = "paid" | "pending" | "cancelled";

export type OrderItem = {
    product: {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        condition: "neuf" | "occasion";
        category: string;
    };
    quantity: number;
};

export type Order = {
    id: string;
    userId?: string;
    customerEmail: string;
    items: OrderItem[];
    amount: number;
    status: OrderStatus;
    shipping?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        address?: string;
        city?: string;
        postalCode?: string;
        country?: string;
    } | null;
    createdAt: { toDate?: () => Date } | Date | string | null;
};
