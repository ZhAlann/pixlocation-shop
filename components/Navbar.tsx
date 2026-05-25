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
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const updateCart = () => {
            const cart = getCart();
            setCartCount(cart.reduce((t, i) => t + i.quantity, 0));
        };
        updateCart();

        const unsub = onAuthStateChanged(auth, async (u) => {
            if (!u) { setUser(null); return; }
            const profile = await getUser(u.uid);
            setUser({ email: u.email ?? "", isAdmin: profile?.role === "admin" });
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

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
                <Link href="/" className="px-logo">PIXSHOP</Link>
                <span className="px-slogan hidden lg:block">just shoot it</span>

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

                <form onSubmit={handleSearch} className="hidden lg:block">
                    <input
                        className="px-search"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                <div className="px-nav-right">
                    <Link href="/contact" className="hidden md:block">Contactez-nous</Link>

                    {user ? (
                        <>
                            <span className="hidden md:block" style={{ color: "#c8c8dc", fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {user.email}
                            </span>
                            <Link href="/mon-compte" className="hidden md:block">Mon compte</Link>
                            <button
                                onClick={handleSignOut}
                                className="hidden md:block"
                                style={{ background: "none", border: "none", color: "#c8c8dc", fontSize: 12, cursor: "pointer" }}
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

                    <Link href="/cart" className="px-btn-cart">
                        Panier ({cartCount})
                    </Link>

                    <button
                        className="px-hamburger md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                    >
                        <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
                        <span style={{ opacity: menuOpen ? 0 : 1 }} />
                        <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
                    </button>
                </div>
            </div>

            <div className={`px-mobile-menu ${menuOpen ? "open" : ""}`}>
                <Link href="/" className={isActive("/") && pathname === "/" ? "active" : ""}>
                    🏠 Accueil
                </Link>
                <Link href="/catalogue" className={isActive("/catalogue") ? "active" : ""}>
                    📷 Catalogue
                </Link>
                <Link href="/contact">
                    ✉️ Contactez-nous
                </Link>

                <form onSubmit={handleSearch} style={{ padding: "4px 12px" }}>
                    <input
                        className="px-search"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "100%", marginTop: 4 }}
                    />
                </form>

                {user ? (
                    <>
                        {user.isAdmin && (
                            <Link href="/admin" className={isActive("/admin") ? "active" : ""}>
                                ⚙️ Back-office
                            </Link>
                        )}
                        <Link href="/mon-compte">
                            👤 Mon compte ({user.email})
                        </Link>
                        <button
                            onClick={handleSignOut}
                            style={{ background: "none", border: "none", color: "#c8c8dc", fontSize: 14, cursor: "pointer", padding: "10px 12px", textAlign: "left", borderRadius: 4 }}
                        >
                            🚪 Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login">🔑 Connexion</Link>
                        <Link href="/signup">✨ Inscription</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
