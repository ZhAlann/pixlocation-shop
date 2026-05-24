"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUser } from "@/lib/users";
import { getCart } from "@/lib/cart";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null);
    const [cartCount, setCartCount] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const cart = getCart();
        setCartCount(cart.reduce((t, i) => t + i.quantity, 0));

        const unsub = onAuthStateChanged(auth, async (u) => {
            if (!u) { setUser(null); return; }
            const profile = await getUser(u.uid);
            setUser({ email: u.email ?? "", isAdmin: profile?.role === "admin" });
        });
        return () => unsub();
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/catalogue?search=${encodeURIComponent(search.trim())}`);
        }
    };

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    return (
        <nav className="px-navbar">
            <div className="px-navbar-inner">
                {/* Logo */}
                <Link href="/" className="px-logo">PIXSHOP</Link>
                <span className="px-slogan hidden lg:block">just shoot it</span>

                {/* Nav links — Accueil + Catalogue uniquement */}
                <div className="px-nav-links hidden md:flex">
                    <Link href="/" className={`px-nav-link ${pathname === "/" ? "active" : ""}`}>
                        Accueil
                    </Link>
                    <Link href="/catalogue" className={`px-nav-link ${isActive("/catalogue") ? "active" : ""}`}>
                        Catalogue
                    </Link>
                    {user?.isAdmin && (
                        <Link href="/admin" className={`px-nav-link ${isActive("/admin") ? "active" : ""}`}>
                            Back-office
                        </Link>
                    )}
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="hidden lg:block">
                    <input
                        className="px-search"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                {/* Right — Contactez-nous + auth + panier */}
                <div className="px-nav-right">
                    {/* Contactez-nous — toujours visible */}
                    <Link href="/contact" className="hidden md:block">
                        Contactez-nous
                    </Link>

                    {user ? (
                        <>
                            <span
                                className="hidden md:block"
                                style={{ color: "#c8c8dc", fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            >
                                {user.email}
                            </span>
                            <Link href="/mon-compte" className="hidden md:block">
                                Mon compte
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="hidden md:block"
                                style={{
                                    background: "none", border: "none",
                                    color: "#c8c8dc", fontSize: 12, cursor: "pointer",
                                }}
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hidden md:block">Connexion</Link>
                            <Link href="/signup" className="hidden md:block">Inscription</Link>
                        </>
                    )}

                    {/* Panier */}
                    <Link href="/cart" className="px-btn-cart">
                        Panier ({cartCount})
                    </Link>
                </div>
            </div>
        </nav>
    );
}
