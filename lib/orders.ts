import { collection, addDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/types/order";

export async function createOrder(order: any) {
    const docRef = await addDoc(collection(db, "orders"), {
        ...order,
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