import Link from "next/link";

const features = [
  "Matériel neuf et d’occasion soigneusement sélectionné",
  "Produits destinés aux créateurs, studios et indépendants",
  "Commande simple, rapide et sécurisée",
  "Expérience premium pensée pour les besoins audiovisuels",
];

const categories = [
  {
    title: "Caméras",
    description: "Boîtiers hybrides, reflex et solutions vidéo pour tous les niveaux.",
  },
  {
    title: "Objectifs",
    description: "Focales fixes, zooms polyvalents et optiques spécialisées.",
  },
  {
    title: "Micros",
    description: "Solutions audio compactes, studio et tournage terrain.",
  },
  {
    title: "Accessoires",
    description: "Éclairage, monitoring, batteries, supports et plus encore.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#f4f1ef]">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-[#d9d4f4] to-transparent lg:block" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div className="relative z-10">

            <h1 className="max-w-xl text-4xl font-bold leading-tight text-[#1c1c24] md:text-5xl">
              Le matériel audiovisuel pensé pour vos productions.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              PixShop propose une sélection de matériel photo, vidéo et audio
              neuf ou d’occasion pour les créateurs, indépendants, studios et
              professionnels de l’image.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-slate-700">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#ff2d55]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/catalogue"
                className="rounded-lg bg-[#4a3fb3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3d3399]"
              >
                Découvrir le catalogue
              </Link>

              <Link
                href="/contact"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#1c1c24] transition hover:bg-slate-50"
              >
                Nous contacter
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                <p className="font-semibold text-[#1c1c24]">+1200 clients</p>
                <p className="text-slate-500">nous font déjà confiance</p>
              </div>
              <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                <p className="font-semibold text-[#1c1c24]">Stock sélectionné</p>
                <p className="text-slate-500">pour la création audiovisuelle</p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative h-[380px] w-full max-w-[520px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#201c3b] via-[#3f338e] to-[#7b6df2] p-8 shadow-2xl">
              <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-pink-400/10 blur-3xl" />

              <div className="relative flex h-full flex-col justify-between rounded-[24px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                    PixShop
                  </p>
                  <h2 className="mt-4 max-w-xs text-3xl font-bold text-white">
                    Une boutique claire, rapide et pensée pour les créateurs.
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-4 text-white">
                    <p className="text-sm text-white/70">Catégories</p>
                    <p className="mt-2 text-xl font-semibold">4 univers</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 text-white">
                    <p className="text-sm text-white/70">Commande</p>
                    <p className="mt-2 text-xl font-semibold">Simple & fluide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#4a3fb3]">
              Nos univers
            </p>
            <h2 className="text-3xl font-bold text-grey">
              Explorez le catalogue
            </h2>
          </div>

          <Link
            href="/catalogue"
            className="hidden rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#1c1c24] transition hover:bg-slate-50 md:inline-flex"
          >
            Voir tous les produits
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 h-32 rounded-2xl bg-gradient-to-br from-[#ede9fe] to-[#dbeafe]" />
              <h3 className="text-xl font-semibold text-[#1c1c24]">
                {category.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {category.description}
              </p>
              <Link
                href="/catalogue"
                className="mt-6 inline-flex text-sm font-semibold text-[#4a3fb3] transition hover:text-[#3d3399]"
              >
                Découvrir
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="rounded-[32px] bg-[#171a2b] px-8 py-12 text-white md:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Pourquoi PixShop
              </p>
              <h2 className="text-3xl font-bold">
                Une plateforme e-commerce claire, moderne et orientée conversion.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-semibold">Interface fluide</p>
                <p className="mt-2 text-sm text-slate-300">
                  Navigation claire entre catalogue, compte et panier.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-semibold">Paiement sécurisé</p>
                <p className="mt-2 text-sm text-slate-300">
                  Tunnel de commande Stripe simple et fiable.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-semibold">Gestion utilisateur</p>
                <p className="mt-2 text-sm text-slate-300">
                  Compte client, profil, commandes et données de livraison.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-semibold">Back-office admin</p>
                <p className="mt-2 text-sm text-slate-300">
                  Gestion des produits, utilisateurs et commandes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 