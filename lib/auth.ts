import { getUser } from "./users";

export async function isAdmin(uid: string): Promise<boolean> {
    const user = await getUser(uid);
    return user?.role === "admin";
}