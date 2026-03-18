"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUser, getAllUsers, updateUserRole } from "@/lib/users";

export default function AdminUsersPage() {
    const [allowed, setAllowed] = useState<boolean | null>(null);
    const [users, setUsers] = useState<any[]>([]);

    const loadUsers = async () => {
        const data = await getAllUsers();
        setUsers(data as any[]);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setAllowed(false);
                return;
            }

            const profile: any = await getUser(user.uid);

            if (profile?.role === "admin") {
                setAllowed(true);
                await loadUsers();
            } else {
                setAllowed(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleMakeAdmin = async (uid: string) => {
        await updateUserRole(uid, "admin");
        await loadUsers();
    };

    const handleMakeUser = async (uid: string) => {
        await updateUserRole(uid, "user");
        await loadUsers();
    };

    if (allowed === null) {
        return (
            <main className="p-10">
                <p>Chargement...</p>
            </main>
        );
    }

    if (!allowed) {
        return (
            <main className="p-10">
                <h1 className="text-2xl font-bold">Accès refusé</h1>
            </main>
        );
    }

    return (
        <main className="p-10">
            <h1 className="mb-8 text-3xl font-bold">Admin Utilisateurs</h1>

            <div className="grid gap-6">
                {users.map((user) => (
                    <article key={user.id} className="rounded-lg border p-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">{user.email}</h2>
                            <span
                                className={`rounded px-2 py-1 text-sm text-white ${user.role === "admin" ? "bg-green-600" : "bg-gray-700"
                                    }`}
                            >
                                {user.role}
                            </span>
                        </div>

                        <div className="grid gap-2 text-sm text-gray-300 md:grid-cols-2">
                            <p>Prénom : {user.firstName || "-"}</p>
                            <p>Nom : {user.lastName || "-"}</p>
                            <p>Adresse : {user.address || "-"}</p>
                            <p>Ville : {user.city || "-"}</p>
                            <p>Code postal : {user.postalCode || "-"}</p>
                            <p>Pays : {user.country || "-"}</p>
                            <p>Téléphone : {user.phone || "-"}</p>
                        </div>

                        <div className="mt-4 flex gap-4">
                            <button
                                onClick={() => handleMakeAdmin(user.id)}
                                className="rounded bg-green-600 px-4 py-2 text-white"
                            >
                                Passer admin
                            </button>

                            <button
                                onClick={() => handleMakeUser(user.id)}
                                className="rounded bg-gray-700 px-4 py-2 text-white"
                            >
                                Remettre user
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}