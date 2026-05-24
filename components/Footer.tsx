import Link from "next/link";

export default function Footer() {
    return (
        <footer>
            <div className="px-footer">
                <div className="px-footer-grid">
                    {/* L'agence */}
                    <div>
                        <div className="px-footer-title">L'agence</div>
                        <p className="px-footer-text">
                            36, rue Émile Decorps<br />
                            69100 Villeurbanne<br />
                            <br />
                            Horaires d'ouverture<br />
                            Du lundi au vendredi<br />
                            09h00–12h00 / 14h00–17h00
                        </p>
                        <div className="px-footer-social">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-social-icon"
                                aria-label="Facebook"
                            >
                                f
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-social-icon"
                                aria-label="Instagram"
                            >
                                in
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-social-icon"
                                aria-label="YouTube"
                            >
                                ▶
                            </a>
                        </div>
                    </div>

                    {/* Mon compte */}
                    <div>
                        <div className="px-footer-title">Mon compte</div>
                        <Link href="/login" className="px-footer-link">Connexion / Inscription</Link>
                        <Link href="/mon-compte" className="px-footer-link">Mes commandes</Link>
                        <Link href="/reset-password" className="px-footer-link">Mot de passe oublié</Link>
                    </div>

                    {/* Nous contacter */}
                    <div>
                        <div className="px-footer-title">Nous contacter</div>
                        <a href="tel:0428298298" className="px-footer-link">04 28 298 298</a>
                        <a href="mailto:contact@pixloc.fr" className="px-footer-link">contact@pixloc.fr</a>
                        <Link href="/contact" className="px-footer-link">Formulaire de contact</Link>
                    </div>

                    {/* Suivez-nous */}
                    <div>
                        <div className="px-footer-title">Suivez-nous !</div>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-footer-link"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-footer-link"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-footer-link"
                        >
                            YouTube
                        </a>
                    </div>
                </div>
            </div>
            <div className="px-footer-bottom">
                © 2026 PixShop — Vente de matériel audiovisuel neuf &amp; occasion
            </div>
        </footer>
    );
}
