"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { getCart } from "@/lib/cart";
import { getUser } from "@/lib/users";

export default function Navbar() {
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const cart = getCart();
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalItems);

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                setIsAdmin(false);
                return;
            }

            const profile: any = await getUser(currentUser.uid);
            setIsAdmin(profile?.role === "admin");
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsAdmin(false);
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#171a2b] text-white shadow-sm">
            <div className="border-b border-white/10 bg-[#111322]">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs text-slate-300">
                    <p>Location & vente de matériel audiovisuel</p>
                    <div className="flex items-center gap-4">
                        <Link href="/contact" className="transition hover:text-white">
                            Contact
                        </Link>
                        {!user ? (
                            <>
                                <Link href="/login" className="transition hover:text-white">
                                    Connexion
                                </Link>
                                <Link href="/signup" className="transition hover:text-white">
                                    Inscription
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="hidden text-slate-400 sm:inline">
                                    {user.email}
                                </span>
                                <button onClick={handleLogout} className="transition hover:text-white">
                                    Déconnexion
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-3">
                    <div className="rounded-md bg-white px-3 py-1 text-sm font-bold tracking-wide text-[#171a2b]">
                        PIXSHOP
                    </div>
                    <span className="hidden text-sm text-slate-300 md:inline">
                        just shoot it
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
                    <Link href="/" className="transition hover:text-slate-300">
                        Accueil
                    </Link>
                    <Link href="/catalogue" className="transition hover:text-slate-300">
                        Catalogue
                    </Link>
                    <Link href="/contact" className="transition hover:text-slate-300">
                        Contact
                    </Link>
                    {user && (
                        <>
                            <Link href="/mon-compte" className="transition hover:text-slate-300">
                                Mon compte
                            </Link>

                        </>
                    )}
                    {isAdmin && (
                        <Link href="/admin" className="transition hover:text-slate-300">
                            Admin
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        href="/cart"
                        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                        Panier ({cartCount})
                    </Link>
                </div>
            </div>
        </header>
    );
}