import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-10">
      <h1 className="mb-6 text-4xl font-bold">PixLocation Shop</h1>

      <div className="flex flex-col gap-3">
        <Link href="/catalogue" className="underline">
          Aller au catalogue
        </Link>
        <Link href="/cart" className="underline">
          Voir le panier
        </Link>
        <Link href="/checkout" className="underline">
          Aller au checkout
        </Link>
        <Link href="/admin" className="underline">
          Aller à l’admin
        </Link>
        <Link href="/product/test-produit" className="underline">
          Voir une fiche produit test
        </Link>
      </div>
    </main>
  );
}