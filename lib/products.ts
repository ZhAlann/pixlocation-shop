import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";

export async function getProducts() {
    const snapshot = await getDocs(collection(db, "products"));

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
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