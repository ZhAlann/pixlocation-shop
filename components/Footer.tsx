import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-20 bg-[#171a2b] text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
                <div>
                    <div className="mb-4 inline-block rounded-md bg-white px-3 py-1 text-sm font-bold tracking-wide text-[#171a2b]">
                        PIXSHOP
                    </div>
                    <p className="max-w-xs text-sm leading-6 text-slate-300">
                        Boutique dédiée à la vente de matériel audiovisuel neuf et d’occasion
                        pour professionnels et particuliers.
                    </p>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-200">
                        Navigation
                    </h3>
                    <div className="flex flex-col gap-3 text-sm text-slate-300">
                        <Link href="/" className="transition hover:text-white">
                            Accueil
                        </Link>
                        <Link href="/catalogue" className="transition hover:text-white">
                            Catalogue
                        </Link>
                        <Link href="/contact" className="transition hover:text-white">
                            Contact
                        </Link>
                        <Link href="/mon-compte" className="transition hover:text-white">
                            Mon compte
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-200">
                        Informations
                    </h3>
                    <div className="space-y-3 text-sm text-slate-300">
                        <p>26, rue Antoine Devescure</p>
                        <p>69000 Lyon</p>
                        <p>contact@pixloc.fr</p>
                        <p>09 00 00 00 00</p>
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-200">
                        Suivez-nous
                    </h3>
                    <div className="space-y-3 text-sm text-slate-300">
                        <p>Instagram</p>
                        <p>Facebook</p>
                        <p>YouTube</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
                    <p>© 2026 PixShop. Tous droits réservés.</p>
                    <p>Projet e-commerce audiovisuel développé avec Next.js & Firebase.</p>
                </div>
            </div>
        </footer>
    );
}