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

export async function getProducts() {
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
            createdAt: data.createdAt?.seconds
                ? new Date(data.createdAt.seconds * 1000).toISOString()
                : null,
        };
    });
}

export async function getProductById(id: string) {
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
        createdAt: data.createdAt?.seconds
            ? new Date(data.createdAt.seconds * 1000).toISOString()
            : null,
    };
}

export async function createProduct(product: any) {
    const docRef = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: new Date(),
    });

    return docRef.id;
}

export async function deleteProduct(productId: string) {
    await deleteDoc(doc(db, "products", productId));
}

export async function updateProduct(productId: string, product: any) {
    await updateDoc(doc(db, "products", productId), {
        ...product,
    });
}