import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getDocs, orderBy, query } from "firebase/firestore";
import { Order } from "@/types/order";
import { where } from "firebase/firestore";
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
export async function getOrdersByEmail(email: string): Promise<Order[]> {
    const q = query(
        collection(db, "orders"),
        where("customerEmail", "==", email)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Order[];
}