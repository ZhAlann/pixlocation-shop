import OrderCard from "@/components/OrderCard";
import { getOrders } from "@/lib/orders";

const ADMIN_EMAIL = "admin@pixlocation.com";

export default async function AdminPage() {

    // protection simple pour éviter accès public en production
    if (process.env.NODE_ENV === "production") {
        return (
            <main className="p-10">
                <h1 className="text-3xl font-bold">Accès refusé</h1>
                <p>Cette page est réservée à l'administration.</p>
            </main>
        );
    }

    const orders = await getOrders();

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = orders.length;

    return (
        <main className="p-10">
            <h1 className="mb-8 text-3xl font-bold">Dashboard Admin</h1>

            <section className="mb-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border p-6">
                    <h2 className="mb-2 text-lg font-semibold">Nombre de commandes</h2>
                    <p className="text-3xl font-bold">{totalOrders}</p>
                </div>

                <div className="rounded-lg border p-6">
                    <h2 className="mb-2 text-lg font-semibold">Chiffre d’affaires</h2>
                    <p className="text-3xl font-bold">
                        {totalRevenue.toLocaleString("fr-FR")} €
                    </p>
                </div>
            </section>

            <section>
                <h2 className="mb-4 text-2xl font-semibold">Commandes récentes</h2>

                {orders.length === 0 ? (
                    <p>Aucune commande enregistrée.</p>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}