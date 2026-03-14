export type ProductCondition = "neuf" | "occasion";

export type ProductCategory =
    | "camera"
    | "objectif"
    | "micro"
    | "accessoire";

export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    condition: ProductCondition;
    category: ProductCategory;
};