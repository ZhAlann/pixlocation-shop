import { Order } from "@/types/order";

type OrderCardProps = {
    order: Order;
};

export default function OrderCard({ order }: OrderCardProps) {
    return (
        <article className="rounded-lg border p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Commande #{order.id}</h2>
                <span
                    className={`rounded px-2 py-1 text-sm text-white ${order.status === "paid"
                            ? "bg-green-600"
                            : order.status === "pending"
                                ? "bg-yellow-600"
                                : "bg-red-600"
                        }`}
                >
                    {order.status}
                </span>
            </div>

            <p className="mb-2">Client : {order.customerEmail}</p>
            <p className="mb-2">Montant : {order.amount} €</p>
            <p className="mb-2">Articles : {order.items?.length ?? 0}</p>

            <div className="mt-4">
                <h3 className="mb-2 font-semibold">Produits :</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                    {order.items?.map((item: any, index: number) => {
                        if (typeof item === "string") {
                            return <li key={index}>{item}</li>;
                        }

                        if (item?.product?.name) {
                            return (
                                <li key={index}>
                                    {item.product.name} × {item.quantity}
                                </li>
                            );
                        }

                        return <li key={index}>Produit inconnu</li>;
                    })}

                </ul>
                <p className="mb-2">
                    Date : {new Date(order.createdAt?.seconds ? order.createdAt.seconds * 1000 : order.createdAt).toLocaleString()}
                </p>
            </div>
        </article>
    );
}