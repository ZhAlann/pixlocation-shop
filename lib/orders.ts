import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    where,
} from "firebase/firestore";
import { Order } from "@/types/order";

export async function createOrder(
    data: Omit<Order, "id" | "createdAt">
): Promise<string> {
    const docRef = await addDoc(collection(db, "orders"), {
        ...data,
        createdAt: new Date(),
    });
    return docRef.id;
}

export async function getOrders(): Promise<Order[]> {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Order[];
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
    const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Order[];
}