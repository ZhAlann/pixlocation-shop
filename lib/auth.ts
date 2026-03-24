import { getUser } from "./users";

export async function isAdmin(uid: string) {
    const user: any = await getUser(uid);

    return user?.role === "admin";
}