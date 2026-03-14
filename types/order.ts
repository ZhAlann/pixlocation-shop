export type OrderItem = {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        stock: number;
        imageUrl: string;
        condition: "neuf" | "occasion";
        category: "camera" | "objectif" | "micro" | "accessoire";
    };
    quantity: number;
};

export type Order = {
    id: string;
    customerEmail: string;
    items: OrderItem[];
    amount: number;
    status: "paid" | "pending" | "cancelled";
    createdAt: any;
};