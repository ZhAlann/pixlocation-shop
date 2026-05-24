import Link from "next/link";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "PixShop — Matériel audiovisuel neuf & occasion",
  description: "Achetez du matériel audiovisuel professionnel neuf et occasion. Caméras, objectifs, micros et accessoires sélectionnés par nos experts.",
};

const HERO_IMAGE = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=80&auto=format&fit=crop";

const CATEGORIES = [
  {
    val: "camera",
    label: "Caméras",
    sub: "Hybrides, reflex, vidéo",
    image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=600&q=80&auto=format&fit=crop",
  },
  {
    val: "objectif",
    label: "Objectifs",
    sub: "Grand-angle, télé, fixe",
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&q=80&auto=format&fit=crop",
  },
  {
    val: "micro",
    label: "Micros",
    sub: "Cravates, perches, USB",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80&auto=format&fit=crop",
  },
  {
    val: "accessoire",
    label: "Accessoires",
    sub: "Stabilisateurs, lumières",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80&auto=format&fit=crop",
  },
];

export default async function HomePage() {
  const allProducts = await getProducts();
  const recent = allProducts.slice(0, 3);

  return (
    <>
      <section className="px-hero">
        <div className="px-hero-left">
          <span className="px-hero-label">Matériel audiovisuel professionnel</span>
          <h1 className="px-hero-title">
            Achetez du matériel<br />
            pro, neuf &amp; occasion
          </h1>
          <p className="px-hero-sub">
            Caméras, objectifs, micros et accessoires<br />
            sélectionnés et vérifiés par nos experts.
          </p>
          <div className="px-hero-cta">
            <Link href="/catalogue" className="px-btn px-btn-red">
              Voir le catalogue
            </Link>
            <Link href="/contact" className="px-btn px-btn-outline">
              Nous contacter
            </Link>
          </div>
        </div>

        <div className="px-hero-right" style={{ padding: 0, overflow: "hidden", height: "500px" }}>
          <img
            src={HERO_IMAGE}
            alt="Appareil photo professionnel"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </div>
      </section>

      <div className="px-stats-bar">
        <div className="px-stats-inner">
          <div className="px-stat">
            <div className="px-stat-icon">✓</div>
            <div className="px-stat-text">
              <strong>Livraison 24h</strong>
              <span>partout en France</span>
            </div>
          </div>
          <div className="px-stat">
            <div className="px-stat-icon">🔒</div>
            <div className="px-stat-text">
              <strong>Paiement sécurisé</strong>
              <span>Stripe — 3D Secure</span>
            </div>
          </div>
          <div className="px-stat">
            <div className="px-stat-icon">★</div>
            <div className="px-stat-text">
              <strong>Matériel vérifié</strong>
              <span>100% contrôlé</span>
            </div>
          </div>
          <div className="px-stat">
            <div className="px-stat-icon">↩</div>
            <div className="px-stat-text">
              <strong>Retours faciles</strong>
              <span>14 jours</span>
            </div>
          </div>
        </div>
      </div>

      <section className="px-categories-section">
        <p className="px-section-label">Parcourir par catégorie</p>
        <div className="px-categories-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.val}
              href={`/catalogue?category=${cat.val}`}
              className="px-cat-card-img"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="px-cat-bg-img"
              />
              <div className="px-cat-overlay" />
              <div className="px-cat-content">
                <div className="px-cat-label">{cat.label}</div>
                <div className="px-cat-sub-label">{cat.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="px-recent-section">
          <div className="px-section-header">
            <p className="px-section-label">Produits récents</p>
            <Link href="/catalogue" className="px-see-all">Voir tout →</Link>
          </div>
          <div className="px-products-grid">
            {recent.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="px-why-section">
        <p className="px-why-label">Pourquoi PixShop ?</p>
        <h2 className="px-why-title">
          Du matériel de qualité, livré partout en France
        </h2>
        <div className="px-why-grid">
          {[
            { icon: "🖥", title: "Interface fluide", desc: "Navigation simple et rapide pour trouver le bon produit en quelques clics." },
            { icon: "🔒", title: "Paiement sécurisé", desc: "Paiement en ligne 100% sécurisé via Stripe, certifié PCI DSS." },
            { icon: "👤", title: "Espace personnel", desc: "Gérez votre compte, consultez et suivez vos commandes facilement." },
          ].map((item) => (
            <div key={item.title} className="px-why-card">
              <div className="px-why-icon">{item.icon}</div>
              <div className="px-why-card-title">{item.title}</div>
              <div className="px-why-card-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
