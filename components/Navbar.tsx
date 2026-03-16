"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Navbar() {
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const cart = getCart();

        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalItems);

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    return (
        <header className="border-b border-gray-800">
            <nav className="mx-auto flex max-w-6xl items-center justify-between p-6">
                <Link href="/" className="text-xl font-bold">
                    PixLocation Shop
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/catalogue" className="hover:underline">
                        Catalogue
                    </Link>

                    <Link href="/cart" className="hover:underline">
                        Panier ({cartCount})
                    </Link>

                    {!user ? (
                        <>
                            <Link href="/login" className="hover:underline">
                                Connexion
                            </Link>

                            <Link href="/signup" className="hover:underline">
                                Inscription
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/mon-compte" className="hover:underline">
                                Mon compte
                            </Link>
                            <Link href="/profil">Profil</Link>
                            <span className="text-sm text-gray-300">{user.email}</span>

                            <button onClick={handleLogout} className="hover:underline">
                                Déconnexion
                            </button>
                        </>
                    )}

                    <Link href="/admin/products" className="hover:underline">
                        Admin
                    </Link>

                </div>
            </nav>
        </header>
    );
}