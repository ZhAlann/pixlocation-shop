import Link from "next/link";

export default function CancelPage() {
    return (
        <main className="p-10">
            <h1 className="mb-4 text-3xl font-bold text-red-500">
                Paiement annulé
            </h1>

            <p className="mb-6 max-w-2xl text-gray-300">
                Votre paiement a été annulé. Aucun montant n’a été débité.
                Vous pouvez revenir à votre panier ou continuer votre navigation.
            </p>

            <div className="flex flex-wrap gap-4">
                <Link
                    href="/cart"
                    className="rounded bg-white px-4 py-2 font-semibold text-black"
                >
                    Retour au panier
                </Link>

                <Link
                    href="/catalogue"
                    className="rounded border border-gray-600 px-4 py-2"
                >
                    Retour au catalogue
                </Link>
            </div>
        </main>
    );
}