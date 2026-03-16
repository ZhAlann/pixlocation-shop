import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function getUser(uid: string) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return { id: snap.id, ...snap.data() };
}

export async function createUserProfile(uid: string, email: string) {
    const ref = doc(db, "users", uid);

    await setDoc(ref, {
        email,
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
        role: "user",
        createdAt: new Date(),
    });
}

export async function saveUserProfile(uid: string, data: any, email?: string) {
    const ref = doc(db, "users", uid);

    await setDoc(
        ref,
        {
            email: email || data.email || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            address: data.address || "",
            city: data.city || "",
            postalCode: data.postalCode || "",
            country: data.country || "",
            phone: data.phone || "",
            role: data.role || "user",
            updatedAt: new Date(),
        },
        { merge: true }
    );
}