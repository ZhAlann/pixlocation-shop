import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getDocs,
} from "firebase/firestore";
import { UserProfile, UserProfileInput, UserRole } from "@/types/user";

function mapUserProfile(
    id: string,
    data: Record<string, unknown>
): UserProfile {
    return {
        id,
        email: typeof data.email === "string" ? data.email : "",
        firstName: typeof data.firstName === "string" ? data.firstName : "",
        lastName: typeof data.lastName === "string" ? data.lastName : "",
        address: typeof data.address === "string" ? data.address : "",
        city: typeof data.city === "string" ? data.city : "",
        postalCode: typeof data.postalCode === "string" ? data.postalCode : "",
        country: typeof data.country === "string" ? data.country : "",
        phone: typeof data.phone === "string" ? data.phone : "",
        role: data.role === "admin" ? "admin" : "user",
        createdAt:
            data.createdAt instanceof Date
                ? data.createdAt
                : typeof data.createdAt === "string"
                    ? data.createdAt
                    : null,

        updatedAt:
            data.updatedAt instanceof Date
                ? data.updatedAt
                : typeof data.updatedAt === "string"
                    ? data.updatedAt
                    : null,
    };
}

export async function getUser(uid: string): Promise<UserProfile | null> {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return mapUserProfile(snap.id, snap.data() as Record<string, unknown>);
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

export async function saveUserProfile(
    uid: string,
    data: UserProfileInput,
    email?: string
) {
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
            updatedAt: new Date(),
        },
        { merge: true }
    );
}

export async function getAllUsers(): Promise<UserProfile[]> {
    const snapshot = await getDocs(collection(db, "users"));

    return snapshot.docs.map((docSnap) =>
        mapUserProfile(docSnap.id, docSnap.data() as Record<string, unknown>)
    );
}

export async function updateUserRole(uid: string, role: UserRole) {
    const ref = doc(db, "users", uid);

    await updateDoc(ref, {
        role,
        updatedAt: new Date(),
    });
}