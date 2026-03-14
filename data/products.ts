import { Product } from "@/types/product";

export const products: Product[] = [
    {
        id: "canon-eos-r6",
        name: "Canon EOS R6",
        description: "Boîtier hybride plein format performant.",
        price: 1899,
        stock: 3,
        imageUrl: "/placeholder-product.jpg",
        condition: "occasion",
        category: "camera",
    },
    {
        id: "sony-a7iii",
        name: "Sony A7 III",
        description: "Hybride polyvalent pour photo et vidéo.",
        price: 1499,
        stock: 5,
        imageUrl: "/placeholder-product.jpg",
        condition: "neuf",
        category: "camera",
    },
    {
        id: "rode-videomic",
        name: "Rode VideoMic",
        description: "Micro canon compact pour prise de son.",
        price: 149,
        stock: 8,
        imageUrl: "/placeholder-product.jpg",
        condition: "neuf",
        category: "micro",
    },
];