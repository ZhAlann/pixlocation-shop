import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
} from "firebase/firestore";
import { Product } from "@/types/product";

type ProductInput = Omit<Product, "id">;

export async function getProducts(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, "products"));

    return snapshot.docs.map((document) => {
        const data = document.data();

        return {
            id: document.id,
            name: data.name ?? "",
            description: data.description ?? "",
            price: data.price ?? 0,
            stock: data.stock ?? 0,
            condition: data.condition ?? "neuf",
            category: data.category ?? "camera",
            imageUrl: data.imageUrl ?? "",
        } as Product;
    });
}

export async function getProductById(id: string): Promise<Product | null> {
    const docRef = doc(db, "products", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();

    return {
        id: snapshot.id,
        name: data.name ?? "",
        description: data.description ?? "",
        price: data.price ?? 0,
        stock: data.stock ?? 0,
        condition: data.condition ?? "neuf",
        category: data.category ?? "camera",
        imageUrl: data.imageUrl ?? "",
    } as Product;
}

export async function createProduct(product: ProductInput) {
    const docRef = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: new Date(),
    });

    return docRef.id;
}

export async function deleteProduct(productId: string) {
    await deleteDoc(doc(db, "products", productId));
}

export async function updateProduct(productId: string, product: Partial<ProductInput>) {
    await updateDoc(doc(db, "products", productId), {
        ...product,
        updatedAt: new Date(),
    });
}